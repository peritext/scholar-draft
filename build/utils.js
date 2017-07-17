'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAssetsFromEditors = exports.updateNotesFromEditor = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.insertAssetInEditor = insertAssetInEditor;
exports.insertInlineAssetInEditor = insertInlineAssetInEditor;
exports.insertBlockAssetInEditor = insertBlockAssetInEditor;
exports.insertNoteInEditor = insertNoteInEditor;
exports.deleteAssetFromEditor = deleteAssetFromEditor;
exports.deleteNoteFromEditor = deleteNoteFromEditor;
exports.getUnusedAssets = getUnusedAssets;
exports.getUsedAssets = getUsedAssets;
exports.insertFragment = insertFragment;

var _draftJs = require('draft-js');

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Inserts an inline or block asset within a draft-js editorState
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {object} asset - the asset data to embed withing draft-js new entity
 * @param {object} selection - the selection to use for targetting asset insertion
 * @return {ImmutableRecord} updatedEditorState - the new editor state
 */
/**
 * This module exports a series of draft-js utils
 * to manipulate scholar-draft state upstream to component's implementation
 * @module scholar-draft/utils
 */
function insertAssetInEditor(editorState, asset, selection) {
  var currentContent = editorState.getCurrentContent();
  var activeSelection = editorState.getSelection();
  var inputSelection = selection || activeSelection;

  // infer the type of insertion (BLOCK or INLINE)
  // from selection :
  // selection in empty block --> block insertion
  // else --> inline insertion
  // (note : could be provided as a param, but then would require a more complex behavior)
  var isInEmptyBlock = currentContent.getBlockForKey(inputSelection.getStartKey()).getText().trim().length === 0;
  var insertionType = isInEmptyBlock ? _constants.BLOCK_ASSET : _constants.INLINE_ASSET;

  // create new entity within content state
  var newContentState = editorState.getCurrentContent().createEntity(insertionType, 'IMMUTABLE', {
    insertionType: insertionType,
    asset: asset
  });
  var newEntityKey = newContentState.getLastCreatedEntityKey();

  // define a new selection
  var thatSelection = activeSelection.merge({
    anchorOffset: inputSelection.getStartOffset(),
    focusOffset: inputSelection.getEndOffset(),
    focusKey: inputSelection.getFocusKey(),
    anchorKey: inputSelection.getAnchorKey()
  });
  // add the given selection to a new editor state with appropriate content state and selection
  var updatedEditor = _draftJs.EditorState.acceptSelection(_draftJs.EditorState.createWithContent(newContentState), thatSelection);
  // insert block asset instruction
  if (insertionType === _constants.BLOCK_ASSET) {
    // create a new atomic block with asset's entity
    updatedEditor = _draftJs.AtomicBlockUtils.insertAtomicBlock(updatedEditor, newEntityKey, ' ');
    var newContent = updatedEditor.getCurrentContent();
    var blockMap = newContent.getBlockMap().toJS();

    // now we update the selection to be on the new block
    var blockE = (0, _keys2.default)(blockMap).map(function (blockId) {
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
    // insert inline asset instruction
  } else {
    // determine the range of the entity
    var anchorKey = thatSelection.getAnchorKey();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);
    var start = thatSelection.getStartOffset();
    var end = thatSelection.getEndOffset();
    var selectedText = currentContentBlock.getText().slice(start, end);
    // now we apply the entity to a portion of content
    // case 1 : asset annotates some existing selected text
    if (selectedText.length > 0) {
      // --> we apply the entity to that text
      newContentState = _draftJs.Modifier.applyEntity(currentContent, thatSelection, newEntityKey);
      // case 2 : asset targets an empty selection
    } else {
      // --> we apply the entity to a whitespace character
      selectedText = ' ';
      newContentState = _draftJs.Modifier.replaceText(currentContent, thatSelection, selectedText, null, newEntityKey);
    }
    // now we add a whitespace character after the new entity
    var endSelection = thatSelection.merge({
      anchorOffset: thatSelection.getEndOffset() + selectedText.length,
      focusOffset: thatSelection.getEndOffset() + selectedText.length
    });
    newContentState = _draftJs.Modifier.replaceText(newContentState, endSelection, ' ', null, null);
    // finally, apply new content state ...
    updatedEditor = _draftJs.EditorState.push(editorState, newContentState, 'apply-entity');
    // ... and put selection after newly created content
    updatedEditor = _draftJs.EditorState.acceptSelection(updatedEditor, endSelection);
  }
  return updatedEditor;
}

function insertInlineAssetInEditor(editorState, asset, selection) {
  var currentContent = editorState.getCurrentContent();
  var activeSelection = editorState.getSelection();
  var inputSelection = selection || activeSelection;
  var newContentState = editorState.getCurrentContent().createEntity(_constants.INLINE_ASSET, 'IMMUTABLE', {
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

    newContentState = _draftJs.Modifier.replaceText(currentContent, thatSelection, selectedText, null,
    // inlineStyle?: DraftInlineStyle,
    newEntityKey);
  }
  var endSelection = thatSelection.merge({
    anchorOffset: thatSelection.getEndOffset() + selectedText.length,
    focusOffset: thatSelection.getEndOffset() + selectedText.length
  });
  newContentState = _draftJs.Modifier.replaceText(newContentState, endSelection, '  ', null, null);
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
  var activeSelection = editorState.getSelection();
  var inputSelection = selection || activeSelection;

  var newContentState = editorState.getCurrentContent().createEntity(_constants.BLOCK_ASSET, 'IMMUTABLE', {
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
  /**
   * UPDATE SELECTION
   */
  var newContent = updatedEditor.getCurrentContent();
  var blockMap = newContent.getBlockMap().toJS();
  var blockE = (0, _keys2.default)(blockMap).map(function (blockId) {
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
  var newContentState = currentContent.createEntity(_constants.NOTE_POINTER, 'IMMUTABLE', { noteId: noteId });
  var newEntityKey = newContentState.getLastCreatedEntityKey();
  var activeSelection = editorState.getSelection();
  // // retaining only the end of selection
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
  newContentState = _draftJs.Modifier.replaceText(newContentState, endSelection, '  ', null, null);
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
  var entities = (0, _keys2.default)(blockMap)
  // iterate through blocks
  // todo : use getEntitiesRange ?
  .map(function (blockMapId) {
    return blockMap[blockMapId].characterList
    // find characters attached to an entity
    .filter(function (chara) {
      return chara.entity !== null;
    })
    // keep entities only
    .map(function (chara) {
      return chara.entity;
    })
    // add info about entity and its location
    .map(function (entityKey) {
      return {
        entityKey: entityKey,
        entity: contentState.getEntity(entityKey),
        blockMapId: blockMapId
      };
    })
    // find relevant entity (corresponding to the asset to delete)
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

// todo : delete that function which seems to be a duplicate
// of deleteAssetFromEditor
/**
 * Delete an asset from the editor, given its id only
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {string} id - the asset of the id to look for in entities' data
 * @param {func} callback - callbacks the updated editor state purged from targeted entity
 */
function deleteNoteFromEditor(editorState, id, callback) {
  var contentState = editorState.getCurrentContent();
  var blockMap = contentState.getBlockMap().toJS();
  var entities = (0, _keys2.default)(blockMap)
  // iterate through blocks
  .map(function (blockMapId) {
    return blockMap[blockMapId].characterList
    // find characters attached to an entity
    .filter(function (chara) {
      return chara.entity !== null;
    })
    // keep entities only
    .map(function (chara) {
      return chara.entity;
    })
    // add info about entity and its location
    .map(function (entityKey) {
      return {
        entityKey: entityKey,
        entity: contentState.getEntity(entityKey),
        blockMapId: blockMapId
      };
    })
    // find relevant entity (corresponding to the asset to delete)
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
 * @return {obj} newNotes - a map of the updated notes
 */
var updateNotesFromEditor = exports.updateNotesFromEditor = function updateNotesFromEditor(editorState, inputNotes) {
  var notes = inputNotes; // { ...inputNotes };
  var contentState = editorState.getCurrentContent();

  // list all entities
  // should be replaced by contentState.getEntityMap() with draft@0.11.0
  var entities = [];
  contentState.getBlockMap().forEach(function (block) {
    block.findEntityRanges(function (character) {
      var entityKey = character.getEntity();
      if (entityKey) {
        entities.push(contentState.getEntity(entityKey));
      }
    });
  });
  // filter to note pointer entities
  var noteEntities = entities.filter(function (thatEntity) {
    return thatEntity.getType() === _constants.NOTE_POINTER;
  });

  // attribute orders to notes
  var order = 0;
  noteEntities.forEach(function (entity) {
    var noteId = entity.getData().noteId;
    order++;
    if (notes[noteId]) {
      notes[noteId].order = order;
    }
  });
  var notesToDelete = (0, _keys2.default)(notes).filter(function (noteId) {
    var entity = noteEntities.find(function (noteEntity, index) {
      return noteEntity.getData().noteId === noteId;
    });
    return entity !== undefined;
  });

  notesToDelete.forEach(function (noteId) {
    delete notes[noteId];
  });

  return notes;

  // filter unused notes
  // return Object.keys(notes)
  // .filter((noteId) => {
  //   const entity = noteEntities.find(
  //     (noteEntity, index) => 
  //       noteEntity.getData().noteId === noteId
  //   );
  //   return entity !== undefined;
  // })
  // .reduce((finalNotes, noteId) => {
  //   const note = notes[noteId];
  //   return {
  //     ...finalNotes,
  //     [noteId]: note
  //   };
  // }, {});
};

/**
 * Delete assets which are not linked to an entity in any of a collection of editorStates
 * @param {array<ImmutableRecord>} editorStates - 
 * the array of editor states to parse (e.g. main editor state 
 * + notes editor states)
 * @param {object} notes - a map of the notes with shape 
 * {noteId: string, order: number, editorState: ImmutableRecord}
 * @return {obj} newAssets - a map of the assets actually in use
 */
var updateAssetsFromEditors = exports.updateAssetsFromEditors = function updateAssetsFromEditors(editorStates, inputAssets) {
  var assets = (0, _extends4.default)({}, inputAssets);
  // list all entities
  // todo: should be replaced by contentState.getEntityMap() with draft@0.11.0
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
  });

  // filter unused assets
  return (0, _keys2.default)(assets).filter(function (assetId) {
    var entity = assetsEntities.find(function (assetEntity, index) {
      return assetEntity.getData().asset.id === assetId;
    });
    return entity !== undefined;
  }).reduce(function (finalAssets, assetId) {
    var asset = assets[assetId];
    return (0, _extends4.default)({}, finalAssets, (0, _defineProperty3.default)({}, assetId, asset));
  }, {});
};

/**
 * Gets entity data from an editor state and an asset id
 * @param {ImmutableRecord} editorState - the editor state to look into
 * @param {string} id - the asset id
 * @return {ImmutableRecord} entity - the related draft-js entity
 */
var getAssetEntity = function getAssetEntity(editorState, id) {
  var entity = void 0;
  var data = void 0;
  var assetEntity = void 0;
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
  return (0, _keys2.default)(assets).filter(function (id) {
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
  return (0, _keys2.default)(assets).filter(function (id) {
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