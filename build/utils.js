'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAssetsFromEditors = exports.updateNotesFromEditor = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.addText = addText;
exports.addEmptyBlock = addEmptyBlock;
exports.insertAssetInEditor = insertAssetInEditor;
exports.insertNoteInEditor = insertNoteInEditor;
exports.getAssetsToDeleteFromEditor = getAssetsToDeleteFromEditor;
exports.deleteAssetFromEditor = deleteAssetFromEditor;
exports.deleteNoteFromEditor = deleteNoteFromEditor;
exports.getUnusedAssets = getUnusedAssets;
exports.getUsedAssets = getUsedAssets;

var _draftJs = require('draft-js');

var _immutable = require('immutable');

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Utils taken from draft-js-markdown-plugin
 */

function getEmptyContentBlock() {
  return new _draftJs.ContentBlock({
    key: (0, _draftJs.genKey)(),
    text: '',
    characterList: (0, _immutable.List)()
  });
}

function addText(editorState, bufferText) {
  var contentState = _draftJs.Modifier.insertText(editorState.getCurrentContent(), editorState.getSelection(), bufferText);
  return _draftJs.EditorState.push(editorState, contentState, 'insert-characters');
}

function addEmptyBlock(editorState) {
  var contentState = editorState.getCurrentContent();
  var emptyBlock = getEmptyContentBlock();
  var blockMap = contentState.getBlockMap();
  var selectionState = editorState.getSelection();
  contentState = contentState.merge({
    blockMap: blockMap.set(emptyBlock.getKey(), emptyBlock),
    selectionAfter: selectionState.merge({
      anchorKey: emptyBlock.getKey(),
      focusKey: emptyBlock.getKey(),
      anchorOffset: 0,
      focusOffset: 0
    })
  });
  return _draftJs.EditorState.push(editorState, contentState, 'insert-characters');
}

/**
 * Other utils
 */

function insertAssetInEditor(editorState, asset, selection) {
  var currentContent = editorState.getCurrentContent();
  var activeSelection = editorState.getSelection();
  var inputSelection = selection || activeSelection;

  var isInEmptyBlock = currentContent.getBlockForKey(inputSelection.getStartKey()).getText().trim().length === 0;
  var insertionType = isInEmptyBlock ? _constants.BLOCK_ASSET : _constants.INLINE_ASSET;
  var newContentState = editorState.getCurrentContent().createEntity(insertionType, 'IMMUTABLE', {
    insertionType: insertionType,
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
  if (insertionType === _constants.BLOCK_ASSET) {
    updatedEditor = _draftJs.AtomicBlockUtils.insertAtomicBlock(updatedEditor, newEntityKey, ' ');
    var newContent = updatedEditor.getCurrentContent();
    var lastEntity = newContent.getEntity(newEntityKey);
    var blockMap = newContent.getBlockMap().toJS();
    var blockE = (0, _keys2.default)(blockMap).map(function (blockId) {
      return blockMap[blockId];
    }).find(function (block) {
      if (block.type === 'atomic') {
        return block.characterList.find(function (char) {
          return char.entity && char.entity === newEntityKey;
        });
      }
    });
    var block = newContent.getBlockAfter(blockE.key);
    var finalSelection = _draftJs.SelectionState.createEmpty(block.getKey());
    updatedEditor = _draftJs.EditorState.acceptSelection(updatedEditor, finalSelection);
    // inline entity
  } else {
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
  }
  return updatedEditor;
}

function insertNoteInEditor(editorState, noteId, selection) {
  var newContentState = editorState.getCurrentContent().createEntity(_constants.NOTE_POINTER, 'IMMUTABLE', {
    noteId: noteId
  });
  var newEntityKey = newContentState.getLastCreatedEntityKey();
  var currentContent = editorState.getCurrentContent();
  var activeSelection = editorState.getSelection();
  // // retaining only the end of selection
  var thatSelection = activeSelection.merge({
    anchorOffset: activeSelection.getEndOffset(),
    focusOffset: activeSelection.getEndOffset(),
    focusKey: activeSelection.getAnchorKey(),
    anchorKey: activeSelection.getAnchorKey()
  });
  var updatedEditor = _draftJs.EditorState.acceptSelection(_draftJs.EditorState.createWithContent(newContentState), thatSelection);
  var anchorKey = thatSelection.getAnchorKey();
  var currentContentBlock = currentContent.getBlockForKey(anchorKey);
  var start = thatSelection.getStartOffset();
  var end = thatSelection.getEndOffset();
  var selectedText = ' ';

  newContentState = _draftJs.Modifier.replaceText(currentContent, thatSelection, selectedText, null,
  // inlineStyle?: DraftInlineStyle,
  newEntityKey);
  var endSelection = thatSelection.merge({
    anchorOffset: thatSelection.getEndOffset() + selectedText.length,
    focusOffset: thatSelection.getEndOffset() + selectedText.length
  });
  newContentState = _draftJs.Modifier.replaceText(newContentState, endSelection, '  ', null, null);
  newContentState = _draftJs.Modifier.applyEntity(newContentState, endSelection, newEntityKey);

  updatedEditor = _draftJs.EditorState.push(editorState, newContentState, 'apply-entity');
  updatedEditor = _draftJs.EditorState.acceptSelection(updatedEditor, endSelection);
  return updatedEditor;
}

function getAssetsToDeleteFromEditor(editorState) {
  var assets = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var contentState = editorState.getCurrentContent();
  var blockMap = contentState.getBlockMap().toJS();
  var activeEntitiesIds = (0, _keys2.default)(blockMap).reduce(function (finalList, blockMapId) {
    return finalList.concat(blockMap[blockMapId].characterList.filter(function (chara) {
      return chara.entity !== null;
    }).map(function (chara) {
      return chara.entity;
    }));
  }, []).map(function (entityKey) {
    return contentState.getEntity(entityKey);
  })
  // .filter(entity => acceptedEntitiesTypes.indexOf(entity.getType()) > -1)
  .map(function (entity) {
    return entity.getData().asset.id;
  });
  return (0, _keys2.default)(assets).filter(function (key) {
    return activeEntitiesIds.indexOf(key) === -1;
  });
}

function deleteAssetFromEditor(editorState, id, callback) {
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

var updateNotesFromEditor = exports.updateNotesFromEditor = function updateNotesFromEditor(editorState, inputNotes) {
  var notes = (0, _extends5.default)({}, inputNotes);
  var contentState = editorState.getCurrentContent();
  var blockMap = contentState.getBlockMap().toJS();
  // list active entities
  var noteEntities = (0, _keys2.default)(blockMap).reduce(function (entities, blockMapId) {
    var newEnt = blockMap[blockMapId].characterList
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
    // find relevant entity (corresponding to the note to delete)
    .filter(function (thatEntity) {
      return thatEntity.entity.getType() === _constants.NOTE_POINTER;
    });
    return entities.concat(newEnt);
  }, []);
  // attribute orders to notes
  var order = 0;
  noteEntities.forEach(function (entity) {
    var noteId = entity.entity.getData().noteId;
    order++;
    if (notes[noteId]) {
      notes[noteId].order = order;
    }
  });
  // filter unused notes
  return (0, _keys2.default)(notes).filter(function (noteId) {
    var note = notes[noteId];
    var entityIndex = void 0;
    var entity = noteEntities.find(function (noteEntity, index) {
      return noteEntity.entity.getData().noteId === noteId;
    });
    return entity !== undefined;
  }).reduce(function (finalNotes, noteId) {
    var note = notes[noteId];
    return (0, _extends5.default)({}, finalNotes, (0, _defineProperty3.default)({}, noteId, note));
  }, {});
};

var updateAssetsFromEditors = exports.updateAssetsFromEditors = function updateAssetsFromEditors(editorStates, inputAssets) {
  var assets = (0, _extends5.default)({}, inputAssets);
  // list active entities
  var assetsEntities = editorStates.reduce(function (total, editorState) {
    var contentState = editorState.getCurrentContent();
    var blockMap = contentState.getBlockMap().toJS();
    return (0, _keys2.default)(blockMap).reduce(function (entities, blockMapId) {
      var newEnt = blockMap[blockMapId].characterList
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
      .filter(function (thatEntity) {
        return thatEntity.entity.getType() === _constants.INLINE_ASSET || thatEntity.entity.getType() === _constants.BLOCK_ASSET;
      });
      return entities.concat(newEnt);
    }, []);
  }, []);
  // filter unused assets
  return (0, _keys2.default)(assets).filter(function (assetId) {
    var asset = assets[assetId];
    var entityIndex = void 0;
    var entity = assetsEntities.find(function (assetEntity, index) {
      return assetEntity.entity.getData().asset.id === assetId;
    });
    return entity !== undefined;
  }).reduce(function (finalAssets, assetId) {
    var asset = assets[assetId];
    return (0, _extends5.default)({}, finalAssets, (0, _defineProperty3.default)({}, assetId, asset));
  }, {});
};

var getAssetEntity = function getAssetEntity(editorState, id) {
  var contentState = editorState.getCurrentContent();
  var blockMap = contentState.getBlockMap().toJS();
  var entity = (0, _keys2.default)(blockMap)
  // iterate through blocks
  .find(function (blockMapId) {
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
    .find(function (thatEntity) {
      var data = thatEntity.entity.getData();
      return data.asset && data.asset.id === id;
    });
  });
  return entity;
};

function getUnusedAssets(editorState, assets) {
  return (0, _keys2.default)(assets).filter(function (id) {
    return getAssetEntity(editorState, id) === undefined;
  });
}

function getUsedAssets(editorState, assets) {
  return (0, _keys2.default)(assets).filter(function (id) {
    return getAssetEntity(editorState, id) !== undefined;
  });
}