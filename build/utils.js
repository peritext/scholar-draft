"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertAssetInEditor = insertAssetInEditor;
exports.insertInlineAssetInEditor = insertInlineAssetInEditor;
exports.insertBlockAssetInEditor = insertBlockAssetInEditor;
exports.insertNoteInEditor = insertNoteInEditor;
exports.deleteAssetFromEditor = deleteAssetFromEditor;
exports.deleteNoteFromEditor = deleteNoteFromEditor;
exports.getUnusedAssets = getUnusedAssets;
exports.getUsedAssets = getUsedAssets;
exports.insertFragment = insertFragment;
exports.checkCharacterForState = checkCharacterForState;
exports.checkReturnForState = checkReturnForState;
exports.Emitter = exports.isParentOf = exports.getSelectionRange = exports.getSelectedBlockElement = exports.updateAssetsFromEditors = exports.updateNotesFromEditor = exports.getEventTextRange = exports.getOffsetRelativeToContainer = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread3 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _draftJs = require("draft-js");

var _uuid = require("uuid");

var _constants = require("./constants");

var _handleBlockType = _interopRequireDefault(require("./modifiers/handleBlockType"));

var _handleInlineStyle = _interopRequireDefault(require("./modifiers/handleInlineStyle"));

var _handleNewCodeBlock = _interopRequireDefault(require("./modifiers/handleNewCodeBlock"));

var _insertEmptyBlock = _interopRequireDefault(require("./modifiers/insertEmptyBlock"));

var _leaveList = _interopRequireDefault(require("./modifiers/leaveList"));

var _insertText = _interopRequireDefault(require("./modifiers/insertText"));

/**
 * This module exports a series of draft-js utils
 * to manipulate scholar-draft state upstream to component's implementation
 * @module scholar-draft/utils
 */
// modifiers helping to modify editorState
var getOffsetRelativeToContainer = function getOffsetRelativeToContainer(el, stopClassName) {
  try {
    var element = el;
    var offset = {
      offsetX: 0,
      offsetY: 0
    };

    if (element) {
      var _element = element,
          parentNode = _element.parentNode;
      offset = {
        offsetX: el.offsetLeft || 0,
        offsetY: el.offsetTop || 0
      };

      while (parentNode && parentNode.tagName !== 'BODY' && parentNode.className.indexOf(stopClassName) === -1) {
        offset.offsetX += parentNode.offsetLeft;
        offset.offsetY += parentNode.offsetTop;
        element = parentNode;
        var newParentNode = element.parentNode.parentNode;
        parentNode = newParentNode;
      }
    }

    return offset;
  } catch (error) {
    return {
      offsetX: 0,
      offsetY: 0
    };
  }
};

exports.getOffsetRelativeToContainer = getOffsetRelativeToContainer;

var getEventTextRange = function getEventTextRange(pageX, pageY) {
  try {
    var range;
    var textNode;
    var offset;

    if (document.caretPositionFromPoint) {
      // standard
      range = document.caretPositionFromPoint(pageX, pageY);
      textNode = range.offsetNode;
      var _range = range,
          rangeOffset = _range.offset;
      offset = rangeOffset;
    } else if (document.caretRangeFromPoint) {
      // WebKit
      range = document.caretRangeFromPoint(pageX, pageY);
      textNode = range.startContainer;
      offset = range.startOffset;
    }

    return {
      range: range,
      textNode: textNode,
      offset: offset
    };
  } catch (error) {
    return undefined;
  }
};
/**
 * Inserts an inline or block asset within a draft-js editorState
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {object} asset - the asset data to embed withing draft-js new entity
 * @param {object} selection - the selection to use for targetting asset insertion
 * @return {ImmutableRecord} updatedEditorState - the new editor state
 */


exports.getEventTextRange = getEventTextRange;

function insertAssetInEditor(editorState, asset, selection) {
  var currentContent = editorState.getCurrentContent();
  var activeSelection = editorState.getSelection();
  var inputSelection = selection || activeSelection;
  /*
   * infer the type of insertion (BLOCK or INLINE)
   * from selection :
   * selection in empty block --> block insertion
   * else --> inline insertion
   * (note : could be provided as a param, but then would require a more complex behavior)
   */

  var isInEmptyBlock = currentContent.getBlockForKey(inputSelection.getStartKey()).getText().trim().length === 0;
  var insertionType = isInEmptyBlock ? _constants.BLOCK_ASSET : _constants.INLINE_ASSET; // create new entity within content state

  var newContentState = editorState.getCurrentContent().createEntity(insertionType, 'IMMUTABLE', {
    insertionType: insertionType,
    asset: asset
  });
  var newEntityKey = newContentState.getLastCreatedEntityKey(); // define a new selection

  var thatSelection = activeSelection.merge({
    anchorOffset: inputSelection.getStartOffset(),
    focusOffset: inputSelection.getEndOffset(),
    focusKey: inputSelection.getFocusKey(),
    anchorKey: inputSelection.getAnchorKey()
  }); // add the given selection to a new editor state with appropriate content state and selection

  var updatedEditor = _draftJs.EditorState.acceptSelection(_draftJs.EditorState.createWithContent(newContentState), thatSelection); // insert block asset instruction


  if (insertionType === _constants.BLOCK_ASSET) {
    // create a new atomic block with asset's entity
    updatedEditor = _draftJs.AtomicBlockUtils.insertAtomicBlock(updatedEditor, newEntityKey, ' ');
    var newContent = updatedEditor.getCurrentContent();
    var blockMap = newContent.getBlockMap().toJS(); // now we update the selection to be on the new block

    var blockE = Object.keys(blockMap).map(function (blockId) {
      return blockMap[blockId];
    }).find(function (block) {
      if (block.type === 'atomic') {
        return block.characterList.find(function (char) {
          return char.entity && char.entity === newEntityKey;
        });
      }

      return undefined;
    });
    var block = newContent.getBlockAfter(blockE.key);

    var finalSelection = _draftJs.SelectionState.createEmpty(block.getKey());

    updatedEditor = _draftJs.EditorState.acceptSelection(updatedEditor, finalSelection); // insert inline asset instruction
  } else if (insertionType === _constants.INLINE_ASSET) {
    // determine the range of the entity
    var anchorKey = thatSelection.getAnchorKey();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);
    var start = thatSelection.getStartOffset();
    var end = thatSelection.getEndOffset();
    var selectedText = currentContentBlock.getText().slice(start, end);
    /*
     * now we apply the entity to a portion of content
     * case 1 : asset annotates some existing selected text
     */

    if (selectedText.length > 0) {
      // --> we apply the entity to that text
      newContentState = _draftJs.Modifier.applyEntity(currentContent, thatSelection, newEntityKey); // case 2 : asset targets an empty selection
    } else {
      // --> we apply the entity to a whitespace character
      selectedText = ' ';
      newContentState = _draftJs.Modifier.replaceText(currentContent, thatSelection, selectedText, null, newEntityKey);
    } // now we add a whitespace character after the new entity


    var endSelection = thatSelection.merge({
      anchorOffset: thatSelection.getEndOffset() + selectedText.length,
      focusOffset: thatSelection.getEndOffset() + selectedText.length
    });
    newContentState = _draftJs.Modifier.replaceText(newContentState, endSelection, ' ', null, null); // then we put the selection at end

    endSelection = endSelection.merge({
      anchorOffset: endSelection.getEndOffset() + 1,
      focusOffset: endSelection.getEndOffset() + 1
    }); // finally, apply new content state ...

    updatedEditor = _draftJs.EditorState.push(editorState, newContentState, 'apply-entity'); // ... and put selection after newly created content

    updatedEditor = _draftJs.EditorState.forceSelection(updatedEditor, endSelection);
  }

  return updatedEditor;
}
/**
 * Inserts an inline asset within a draft-js editorState
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {object} asset - the asset data to embed withing draft-js new entity
 * @param {object} selection - the selection to use for targetting asset insertion
 * @return {ImmutableRecord} updatedEditorState - the new editor state
 */


function insertInlineAssetInEditor(editorState, asset, selection) {
  var mutable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var currentContent = editorState.getCurrentContent();
  var activeSelection = editorState.getSelection();
  var inputSelection = selection || activeSelection;
  var newContentState = editorState.getCurrentContent().createEntity(_constants.INLINE_ASSET, mutable ? 'MUTABLE' : 'IMMUTABLE', {
    insertionType: _constants.INLINE_ASSET,
    asset: asset
  });
  var newEntityKey = newContentState.getLastCreatedEntityKey();
  var thatSelection = activeSelection.merge({
    anchorOffset: inputSelection.getStartOffset(),
    focusOffset: inputSelection.getEndOffset(),
    focusKey: inputSelection.getFocusKey(),
    anchorKey: inputSelection.getAnchorKey()
  });

  var updatedEditor = _draftJs.EditorState.acceptSelection(_draftJs.EditorState.createWithContent(newContentState), thatSelection);

  var anchorKey = thatSelection.getAnchorKey();
  var currentContentBlock = currentContent.getBlockForKey(anchorKey);
  var start = thatSelection.getStartOffset();
  var end = thatSelection.getEndOffset();
  var selectedText = currentContentBlock.getText().slice(start, end);

  if (selectedText.length > 0) {
    newContentState = _draftJs.Modifier.applyEntity(currentContent, thatSelection, newEntityKey);
  } else {
    selectedText = ' ';
    newContentState = _draftJs.Modifier.replaceText(currentContent, thatSelection, selectedText, null, // inlineStyle?: DraftInlineStyle,
    newEntityKey);
  }

  var endSelection = thatSelection.merge({
    anchorOffset: thatSelection.getEndOffset(),
    focusOffset: thatSelection.getEndOffset()
  });
  /*
   * newContentState = Modifier.replaceText(
   *   newContentState,
   *   endSelection,
   *   ' ',
   *   null,
   *   null
   * );
   */

  updatedEditor = _draftJs.EditorState.push(editorState, newContentState, 'apply-entity');
  updatedEditor = _draftJs.EditorState.acceptSelection(updatedEditor, endSelection);
  return updatedEditor;
}
/**
 * Inserts a block asset within a draft-js editorState
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {object} asset - the asset data to embed withing draft-js new entity
 * @param {object} selection - the selection to use for targetting asset insertion
 * @return {ImmutableRecord} updatedEditorState - the new editor state
 */


function insertBlockAssetInEditor(editorState, asset, selection) {
  var mutable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var allowReplacingBlock = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var activeSelection = editorState.getSelection();
  var inputSelection = selection || activeSelection;
  var selectionInEmptyBlock; // let selectionInAtomic;

  if (inputSelection.isCollapsed()) {
    var blockId = inputSelection.getAnchorKey();

    var _block = editorState.getCurrentContent().getBlockForKey(blockId);

    var text = _block.getText();

    var type = _block.getType();

    if (text.trim().length === 0 && type !== 'atomic') {
      selectionInEmptyBlock = blockId;
    }
    /* else if (type === 'atomic') {
    selectionInAtomic = true;
    } */

  }

  var newContentState = editorState.getCurrentContent().createEntity(_constants.BLOCK_ASSET, mutable ? 'MUTABLE' : 'IMMUTABLE', {
    insertionType: _constants.BLOCK_ASSET,
    asset: asset
  });
  var newEntityKey = newContentState.getLastCreatedEntityKey();
  var thatSelection = activeSelection.merge({
    anchorOffset: inputSelection.getStartOffset(),
    focusOffset: inputSelection.getEndOffset(),
    focusKey: inputSelection.getFocusKey(),
    anchorKey: inputSelection.getAnchorKey()
  });

  var updatedEditor = _draftJs.EditorState.acceptSelection(_draftJs.EditorState.createWithContent(newContentState), thatSelection);

  updatedEditor = _draftJs.AtomicBlockUtils.insertAtomicBlock(updatedEditor, newEntityKey, ' ');

  if (selectionInEmptyBlock) {
    updatedEditor = _draftJs.EditorState.acceptSelection(_draftJs.EditorState.createWithContent(_draftJs.ContentState.createFromBlockArray(
    /* eslint array-callback-return : 0 */
    updatedEditor.getCurrentContent().getBlocksAsArray().filter(function (block, blockIndex) {
      var key = block.getKey();

      if (blockIndex === 0 || key !== selectionInEmptyBlock) {
        return true;
      }
    }), updatedEditor.getCurrentContent().getBlockMap())), thatSelection);
  }
  /**
   * UPDATE SELECTION
   */


  var newContent = updatedEditor.getCurrentContent();
  var blockMap = newContent.getBlockMap().toJS();
  var blockE = Object.keys(blockMap).map(function (blockId) {
    return blockMap[blockId];
  }).find(function (block) {
    if (block.type === 'atomic') {
      return block.characterList.find(function (char) {
        return char.entity && char.entity === newEntityKey;
      });
    }

    return undefined;
  });
  var block = newContent.getBlockAfter(blockE.key);

  var finalSelection = _draftJs.SelectionState.createEmpty(block.getKey());

  updatedEditor = _draftJs.EditorState.acceptSelection(updatedEditor, finalSelection);
  return updatedEditor;
}
/**
 * Inserts a note pointer entity within a draft-js editorState
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {string} noteId - the id of the note to embed (note : note number is handled upstream)
 * @param {object} selection - the selection to use for targetting asset insertion
 * @return {ImmutableRecord} updatedEditorState - the new editor state
 */


function insertNoteInEditor(editorState, noteId, selection) {
  var currentContent = editorState.getCurrentContent();
  var newContentState = currentContent.createEntity(_constants.NOTE_POINTER, 'IMMUTABLE', {
    noteId: noteId
  });
  var newEntityKey = newContentState.getLastCreatedEntityKey();
  var activeSelection = editorState.getSelection(); // // retaining only the end of selection

  var thatSelection = activeSelection.merge({
    anchorOffset: activeSelection.getEndOffset(),
    focusOffset: activeSelection.getEndOffset(),
    focusKey: activeSelection.getAnchorKey(),
    anchorKey: activeSelection.getAnchorKey()
  });

  var updatedEditor = _draftJs.EditorState.acceptSelection(_draftJs.EditorState.createWithContent(newContentState), thatSelection);

  var selectedText = ' ';
  newContentState = _draftJs.Modifier.replaceText(currentContent, thatSelection, selectedText, null, newEntityKey);
  var anchorOffset = thatSelection.getEndOffset() + selectedText.length;
  var focusOffset = thatSelection.getEndOffset() + selectedText.length;
  var endSelection = thatSelection.merge({
    anchorOffset: anchorOffset,
    focusOffset: focusOffset
  });
  newContentState = _draftJs.Modifier.replaceText(newContentState, endSelection, ' ', null, null);
  endSelection = thatSelection.merge({
    anchorOffset: anchorOffset + 1,
    focusOffset: focusOffset + 1
  });
  newContentState = _draftJs.Modifier.applyEntity(newContentState, endSelection, newEntityKey);
  updatedEditor = _draftJs.EditorState.push(editorState, newContentState, 'edit-entity');
  updatedEditor = _draftJs.EditorState.acceptSelection(updatedEditor, endSelection);
  return updatedEditor;
}
/**
 * Delete an asset from the editor, given its id only
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {string} id - the asset of the id to look for in entities' data
 * @param {func} callback - callbacks the updated editor state purged from targeted entity
 */


function deleteAssetFromEditor(editorState, id, callback) {
  // todo : try to optimize this with draftjs-utils
  var contentState = editorState.getCurrentContent();
  var blockMap = contentState.getBlockMap().toJS();
  var entities = Object.keys(blockMap)
  /*
   * iterate through blocks
   * todo : use getEntitiesRange ?
   */
  .map(function (blockMapId) {
    return blockMap[blockMapId].characterList // find characters attached to an entity
    .filter(function (chara) {
      return chara.entity !== null;
    }) // keep entities only
    .map(function (chara) {
      return chara.entity;
    }) // add info about entity and its location
    .map(function (entityKey) {
      return {
        entityKey: entityKey,
        entity: contentState.getEntity(entityKey),
        blockMapId: blockMapId
      };
    }) // find relevant entity (corresponding to the asset to delete)
    .find(function (entity) {
      var data = entity.entity.getData();
      return data.asset && data.asset.id === id;
    });
  }).filter(function (data) {
    return data !== undefined;
  });

  if (entities.length) {
    var entityInfos = entities[0];
    return contentState.getBlockForKey(entityInfos.blockMapId).findEntityRanges(function (characterMetadata) {
      return characterMetadata.entity === entityInfos.entityKey;
    }, function (start, end) {
      var selectionToDelete = _draftJs.SelectionState.createEmpty(entityInfos.blockMapId).merge({
        anchorOffset: start,
        focusOffset: end
      });

      var newContentState = _draftJs.Modifier.removeRange(contentState, selectionToDelete);

      var newEditor = _draftJs.EditorState.push(editorState, newContentState, 'replace-text');

      return callback(newEditor);
    });
  }

  return callback(editorState);
}
/*
 * todo : delete that function which seems to be a duplicate
 * of deleteAssetFromEditor
 */

/**
 * Delete an asset from the editor, given its id only
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {string} id - the asset of the id to look for in entities' data
 * @param {func} callback - callbacks the updated editor state purged from targeted entity
 */


function deleteNoteFromEditor(editorState, id, callback) {
  var contentState = editorState.getCurrentContent();
  var blockMap = contentState.getBlockMap().toJS();
  var entities = Object.keys(blockMap) // iterate through blocks
  .map(function (blockMapId) {
    return blockMap[blockMapId].characterList // find characters attached to an entity
    .filter(function (chara) {
      return chara.entity !== null;
    }) // keep entities only
    .map(function (chara) {
      return chara.entity;
    }) // add info about entity and its location
    .map(function (entityKey) {
      return {
        entityKey: entityKey,
        entity: contentState.getEntity(entityKey),
        blockMapId: blockMapId
      };
    }) // find relevant entity (corresponding to the asset to delete)
    .find(function (entity) {
      var data = entity.entity.getData();
      return data.noteId === id;
    });
  }).filter(function (data) {
    return data !== undefined;
  });

  if (entities.length) {
    var entityInfos = entities[0];
    return contentState.getBlockForKey(entityInfos.blockMapId).findEntityRanges(function (characterMetadata) {
      return characterMetadata.entity === entityInfos.entityKey;
    }, function (start, end) {
      var selectionToDelete = _draftJs.SelectionState.createEmpty(entityInfos.blockMapId).merge({
        anchorOffset: start,
        focusOffset: end
      });

      var newContentState = _draftJs.Modifier.removeRange(contentState, selectionToDelete);

      var newEditor = _draftJs.EditorState.push(editorState, newContentState, 'replace-text');

      return callback(newEditor);
    });
  }

  return callback(editorState);
}
/**
 * Updates notes number and delete notes which are not any more pointed in the given editor state
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {object} notes - a map of the notes
 * with shape {noteId: string, order: number, editorState: ImmutableRecord}
 * @return {obj} {newNotes, notesOrder} - a map of the
 * updated notes and the notes order infered from the editor
 */


var updateNotesFromEditor = function updateNotesFromEditor(editorState, inputNotes) {
  var notes = inputNotes; // { ...inputNotes };

  var contentState = editorState.getCurrentContent();
  /*
   * list all entities
   * should be replaced by contentState.getEntityMap() with draft@0.11.0
   */

  var entities = [];
  contentState.getBlockMap().forEach(function (block) {
    block.findEntityRanges(function (character) {
      var entityKey = character.getEntity();

      if (entityKey) {
        entities.push(contentState.getEntity(entityKey));
      }
    });
  }); // filter to note pointer entities

  var noteEntities = entities.filter(function (thatEntity) {
    return thatEntity.getType() === _constants.NOTE_POINTER;
  });
  var notesOrder = []; // attribute orders to notes

  var order = 0;
  noteEntities.forEach(function (entity) {
    var _entity$getData = entity.getData(),
        noteId = _entity$getData.noteId;

    notesOrder.push(noteId);
    order++;

    if (notes[noteId]) {
      notes[noteId].order = order;
    }
  });
  var notesToDelete = Object.keys(notes).filter(function (noteId) {
    var entity = noteEntities.find(function (noteEntity, index) {
      return noteEntity.getData().noteId === noteId;
    });
    return entity === undefined;
  });
  notesToDelete.forEach(function (noteId) {
    delete notes[noteId];
  });
  return {
    newNotes: notes,
    notesOrder: notesOrder
  };
};
/**
 * Delete assets which are not linked to an entity in any of a collection of editorStates
 * @param {array<ImmutableRecord>} editorStates - the editor states to look into
 * the array of editor states to parse (e.g. main editor state
 * + notes editor states)
 * @param {object} notes - a map of the notes with shape
 * {noteId: string, order: number, editorState: ImmutableRecord}
 * @return {obj} newAssets - a map of the assets actually in use
 */


exports.updateNotesFromEditor = updateNotesFromEditor;

var updateAssetsFromEditors = function updateAssetsFromEditors(editorStates, inputAssets) {
  var assets = (0, _objectSpread3.default)({}, inputAssets);
  /*
   * list all entities
   * todo: should be replaced by contentState.getEntityMap() with draft@0.11.0
   */

  var entities = [];
  editorStates.forEach(function (editorState) {
    var contentState = editorState.getCurrentContent();
    contentState.getBlockMap().forEach(function (block) {
      block.findEntityRanges(function (character) {
        var entityKey = character.getEntity();

        if (entityKey) {
          entities.push(contentState.getEntity(entityKey));
        }
      });
    });
  });
  var assetsEntities = entities.filter(function (thatEntity) {
    return thatEntity.getType() === _constants.INLINE_ASSET || thatEntity.getType() === _constants.BLOCK_ASSET;
  }); // filter unused assets

  return Object.keys(assets).filter(function (assetId) {
    var entity = assetsEntities.find(function (assetEntity, index) {
      return assetEntity.getData().asset.id === assetId;
    });
    return entity !== undefined;
  }).reduce(function (finalAssets, assetId) {
    var asset = assets[assetId];
    return (0, _objectSpread3.default)({}, finalAssets, (0, _defineProperty2.default)({}, assetId, asset));
  }, {});
};
/**
 * Gets entity data from an editor state and an asset id
 * @param {ImmutableRecord} editorState - the editor state to look into
 * @param {string} id - the asset id
 * @return {ImmutableRecord} entity - the related draft-js entity
 */


exports.updateAssetsFromEditors = updateAssetsFromEditors;

var getAssetEntity = function getAssetEntity(editorState, id) {
  var entity;
  var data;
  var assetEntity;
  var contentState = editorState.getCurrentContent();
  contentState.getBlockMap().some(function (block) {
    block.findEntityRanges(function (character) {
      var entityKey = character.getEntity();

      if (entityKey) {
        entity = contentState.getEntity(entityKey);
        data = entity.getData();

        if (data.asset && data.asset.id === id) {
          assetEntity = entity;
        }
      }
    });

    if (assetEntity) {
      return true;
    }

    return false;
  });
  return assetEntity;
};
/**
 * Gets assets not being used in an editor state
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {object} assets - a map of the assets to parse
 * @return {array} newAssets - array of unused assets
 */


function getUnusedAssets(editorState, assets) {
  return Object.keys(assets).filter(function (id) {
    return getAssetEntity(editorState, id) === undefined;
  });
}
/**
 * Gets assets being used in an editor state
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {object} assets - a map of the assets to parse
 * @return {array} newAssets - array of used assets
 */


function getUsedAssets(editorState, assets) {
  return Object.keys(assets).filter(function (id) {
    return getAssetEntity(editorState, id) !== undefined;
  });
}
/**
 * Inserts a draft-js fragment within an editor state
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {ImmutableRecord} fragment - the fragment to embed
 * @return {ImmutableRecord} newEditorState - the new editor state
 */


function insertFragment(editorState, fragment) {
  var newContent = _draftJs.Modifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), fragment);

  return _draftJs.EditorState.push(editorState, newContent, 'insert-fragment');
}
/**
 * Gets the block element corresponding to a given range of selection
 * @param {object} range - the input range to look in
 * @return {object} node
 */


var getSelectedBlockElement = function getSelectedBlockElement(range) {
  try {
    var node = range.startContainer;

    do {
      if (node.getAttribute && (node.getAttribute('data-block') == 'true' || node.getAttribute('data-contents') == 'true')) {
        return node;
      }

      node = node.parentNode;
    } while (node != null);
  } catch (error) {
    return null;
  }

  return null;
};
/**
 * Gets the current window's selection range (start and end)
 * @return {object} selection range
 */


exports.getSelectedBlockElement = getSelectedBlockElement;

var getSelectionRange = function getSelectionRange() {
  var selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  return selection.getRangeAt(0);
};
/**
 * Checks if a DOM element is parent of another one
 * @param {inputEle} DOMEl - the presumed child
 * @param {inputEle} DOMEl - the presumed parent
 * @return {boolean} isParent - whether yes or no
 */


exports.getSelectionRange = getSelectionRange;

var isParentOf = function isParentOf(inputEle, maybeParent) {
  try {
    var ele = inputEle;

    while (ele.parentNode != null && ele.parentNode != document.body) {
      /* eslint eqeqeq:0 */
      if (ele.parentNode === maybeParent) return true;
      ele = ele.parentNode;
    }

    return false;
  } catch (error) {
    return false;
  }
};
/**
 * Handles a character's style
 * @param {ImmutableRecord} editorState - the input editor state
 * @param {ImmutableRecord} character - the character to check
 * @return {ImmutableRecord} newEditorState - the new editor state
 */


exports.isParentOf = isParentOf;

function checkCharacterForState(editorState, character) {
  var newEditorState = (0, _handleBlockType.default)(editorState, character);

  if (editorState === newEditorState) {
    newEditorState = (0, _handleInlineStyle.default)(editorState, character);
  }

  return newEditorState;
} // todo : this function is a perf bottleneck

/**
 * Resolves return key hit
 * @param {ImmutableRecord} editorState - the input editor state
 * @param {object} ev - the original key event
 * @return {ImmutableRecord} newEditorState - the new editor state
 */


function checkReturnForState(editorState, ev) {
  var newEditorState = editorState;
  var contentState = editorState.getCurrentContent();
  var selection = editorState.getSelection();
  var key = selection.getStartKey();
  var currentBlock = contentState.getBlockForKey(key);
  var type = currentBlock.getType();
  var text = currentBlock.getText();

  if (/-list-item$/.test(type) && text === '') {
    newEditorState = (0, _leaveList.default)(editorState);
  }

  if (newEditorState === editorState && (ev.ctrlKey || ev.shiftKey || ev.metaKey || ev.altKey || /^header-/.test(type))) {
    newEditorState = (0, _insertEmptyBlock.default)(editorState);
  }

  if (newEditorState === editorState && type === 'code-block') {
    newEditorState = (0, _insertText.default)(editorState, '\n');
  }

  if (newEditorState === editorState) {
    newEditorState = (0, _handleNewCodeBlock.default)(editorState);
  }

  return newEditorState;
}
/**
 * This class allows to produce event emitters
 * that will be used to dispatch assets changes
 * and notes changes through context
 */


var Emitter = function Emitter() {
  var _this = this;

  (0, _classCallCheck2.default)(this, Emitter);
  (0, _defineProperty2.default)(this, "assetsListeners", new Map());
  (0, _defineProperty2.default)(this, "notesListeners", new Map());
  (0, _defineProperty2.default)(this, "assetChoicePropsListeners", new Map());
  (0, _defineProperty2.default)(this, "renderingModeListeners", new Map());
  (0, _defineProperty2.default)(this, "customContextListeners", new Map());
  (0, _defineProperty2.default)(this, "subscribeToAssets", function (listener) {
    var id = (0, _uuid.v4)();

    _this.assetsListeners.set(id, listener);

    return function () {
      return _this.assetsListeners.delete(id);
    };
  });
  (0, _defineProperty2.default)(this, "subscribeToNotes", function (listener) {
    var id = (0, _uuid.v4)();

    _this.notesListeners.set(id, listener);

    return function () {
      return _this.notesListeners.delete(id);
    };
  });
  (0, _defineProperty2.default)(this, "subscribeToAssetChoiceProps", function (listener) {
    var id = (0, _uuid.v4)();

    _this.assetChoicePropsListeners.set(id, listener);

    return function () {
      return _this.assetChoicePropsListeners.delete(id);
    };
  });
  (0, _defineProperty2.default)(this, "subscribeToRenderingMode", function (listener) {
    var id = (0, _uuid.v4)();

    _this.renderingModeListeners.set(id, listener);

    return function () {
      return _this.renderingModeListeners.delete(id);
    };
  });
  (0, _defineProperty2.default)(this, "subscribeToCustomContext", function (listener) {
    var id = (0, _uuid.v4)();

    _this.customContextListeners.set(id, listener);

    return function () {
      return _this.customContextListeners.delete(id);
    };
  });
  (0, _defineProperty2.default)(this, "dispatchAssets", function (assets) {
    _this.assetsListeners.forEach(function (listener) {
      listener(assets);
    });
  });
  (0, _defineProperty2.default)(this, "dispatchNotes", function (notes) {
    _this.notesListeners.forEach(function (listener) {
      listener(notes);
    });
  });
  (0, _defineProperty2.default)(this, "dispatchAssetChoiceProps", function (props) {
    _this.assetChoicePropsListeners.forEach(function (listener) {
      listener(props);
    });
  });
  (0, _defineProperty2.default)(this, "dispatchRenderingMode", function (renderingMode) {
    _this.renderingModeListeners.forEach(function (listener) {
      listener(renderingMode);
    });
  });
  (0, _defineProperty2.default)(this, "dispatchCustomContext", function (customContext) {
    _this.customContextListeners.forEach(function (listener) {
      listener(customContext);
    });
  });
};

exports.Emitter = Emitter;