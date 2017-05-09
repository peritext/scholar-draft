'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertContextualizationInEditor = insertContextualizationInEditor;
exports.getContextualizationsToDeleteFromEditor = getContextualizationsToDeleteFromEditor;
exports.deleteContextualizationFromEditor = deleteContextualizationFromEditor;

var _draftJs = require('draft-js');

function insertContextualizationInEditor(editorState, insertionType, contextualization, selection) {
  var newContentState = editorState.getCurrentContent().createEntity(insertionType, 'IMMUTABLE', {
    insertionType: insertionType,
    contextualization: contextualization
  });

  var newEntityKey = newContentState.getLastCreatedEntityKey();
  var currentContent = editorState.getCurrentContent();
  var activeSelection = editorState.getSelection();
  var thatSelection = activeSelection.merge({
    anchorOffset: selection.getStartOffset(),
    focusOffset: selection.getEndOffset(),
    focusKey: selection.getFocusKey(),
    anchorKey: selection.getAnchorKey()
  });
  var updatedEditor = _draftJs.EditorState.acceptSelection(_draftJs.EditorState.createWithContent(newContentState), thatSelection);
  // let updatedEditor = EditorState.createWithContent(newContentState);
  if (insertionType === 'blockContextualization') {
    updatedEditor = _draftJs.AtomicBlockUtils.insertAtomicBlock(updatedEditor, newEntityKey, ' ');
  } else {
    var anchorKey = thatSelection.getAnchorKey();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);
    var start = thatSelection.getStartOffset();
    var end = thatSelection.getEndOffset();
    var selectedText = currentContentBlock.getText().slice(start, end);
    var _newContentState = void 0;
    if (selectedText.length > 0) {
      _newContentState = _draftJs.Modifier.applyEntity(currentContent, thatSelection, newEntityKey);
    } else {
      selectedText = ' ';

      _newContentState = _draftJs.Modifier.replaceText(currentContent, thatSelection, selectedText, null,
      // inlineStyle?: DraftInlineStyle,
      newEntityKey);
    }
    var endSelection = thatSelection.merge({
      anchorOffset: thatSelection.getEndOffset() + selectedText.length,
      focusOffset: thatSelection.getEndOffset() + selectedText.length
    });
    _newContentState = _draftJs.Modifier.replaceText(_newContentState, endSelection, '  ', null, null);
    updatedEditor = _draftJs.EditorState.push(editorState, _newContentState, 'apply-entity');
  }
  return updatedEditor;
}

function getContextualizationsToDeleteFromEditor(editorState) {
  var acceptedEntitiesTypes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var contextualizations = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var contentState = editorState.getCurrentContent();
  var blockMap = contentState.getBlockMap().toJS();
  var activeEntitiesIds = Object.keys(blockMap).reduce(function (finalList, blockMapId) {
    return finalList.concat(blockMap[blockMapId].characterList.filter(function (chara) {
      return chara.entity !== null;
    }).map(function (chara) {
      return chara.entity;
    }));
  }, []).map(function (entityKey) {
    return contentState.getEntity(entityKey);
  }).filter(function (entity) {
    return acceptedEntitiesTypes.indexOf(entity.getType()) > -1;
  }).map(function (entity) {
    return entity.getData().contextualization.id;
  });
  return Object.keys(contextualizations).filter(function (key) {
    return activeEntitiesIds.indexOf(key) === -1;
  });
}

function deleteContextualizationFromEditor(editorState) {
  var acceptedEntitiesTypes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var id = arguments[2];
  var callback = arguments[3];

  var contentState = editorState.getCurrentContent();
  var blockMap = contentState.getBlockMap().toJS();
  var entities = Object.keys(blockMap).map(function (blockMapId) {

    return blockMap[blockMapId].characterList.filter(function (chara) {
      return chara.entity !== null;
    }).map(function (chara) {
      return chara.entity;
    }).map(function (entityKey) {
      return {
        entityKey: entityKey,
        entity: contentState.getEntity(entityKey),
        blockMapId: blockMapId
      };
    }).find(function (entity) {
      var data = entity.entity.getData();
      return data.contextualization && data.contextualization.id === id;
    });
  }).filter(function (d) {
    return d !== undefined;
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
      var newContentState = void 0;
      newContentState = _draftJs.Modifier.removeRange(contentState, selectionToDelete);
      // const trimmedBlockLength = contentState.getBlockForKey(entityInfos.blockMapId).getText().trim().length;
      // if (!trimmedBlockLength) {
      //   newContentState = Modifier.replaceText(
      //     contentState,
      //     selectionToDelete,
      //     '',
      //     null,
      //     entityInfos.entityKey
      //   );
      // } else {
      //   // remove block
      //   newContentState = Modifier.replaceText(
      //     contentState,
      //     selectionToDelete,
      //     '',
      //     null,
      //     entityInfos.entityKey
      //   );
      // }
      // newContentState = newContentState.replaceEntityData(entityInfos.entityKey, null);
      var newEditor = _draftJs.EditorState.push(editorState, newContentState, 'replace-text');
      return callback(newEditor);
    });
  }
  return callback(editorState);
}