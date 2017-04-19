import {
  EditorState,
  Modifier,
  AtomicBlockUtils,
  SelectionState
} from 'draft-js';

export function insertContextualizationInEditor(editorState, insertionType, contextualization, selection) {
    const newContentState = editorState.getCurrentContent().createEntity(
      insertionType,
      'IMMUTABLE',
      {
        insertionType,
        contextualization
      }
    );

    const newEntityKey = newContentState.getLastCreatedEntityKey();
    const currentContent = editorState.getCurrentContent();
    const activeSelection = editorState.getSelection();
    const thatSelection = activeSelection.merge({
      anchorOffset: selection.getStartOffset(),
      focusOffset: selection.getEndOffset(),
      focusKey: selection.getFocusKey(),
      anchorKey: selection.getAnchorKey(),
    });
    let updatedEditor = EditorState.acceptSelection(EditorState.createWithContent(newContentState), thatSelection);
    // let updatedEditor = EditorState.createWithContent(newContentState);
    if (insertionType === 'blockContextualization') {
      updatedEditor = AtomicBlockUtils.insertAtomicBlock(
        updatedEditor,
        newEntityKey,
        ' '
      );
    } else {
      const anchorKey = thatSelection.getAnchorKey();
      const currentContentBlock = currentContent.getBlockForKey(anchorKey);
      const start = thatSelection.getStartOffset();
      const end = thatSelection.getEndOffset();
      let selectedText = currentContentBlock.getText().slice(start, end);
      let newContentState;
      if (selectedText.length > 0) {
        newContentState = Modifier.applyEntity(
          currentContent,
          thatSelection,
          newEntityKey
        );
      } else {
        selectedText = ' ';

        newContentState = Modifier.replaceText(
          currentContent,
          thatSelection,
          selectedText,
          null,
          // inlineStyle?: DraftInlineStyle,
          newEntityKey
        );
      }
      const endSelection = thatSelection.merge({
        anchorOffset: thatSelection.getEndOffset() + selectedText.length,
        focusOffset: thatSelection.getEndOffset() + selectedText.length,
      });
      newContentState = Modifier.replaceText(
        newContentState,
        endSelection,
        '  ',
        null,
        null
      );
      updatedEditor = EditorState.push(editorState, newContentState, 'apply-entity');
    }
    return updatedEditor;
}

export function getContextualizationsToDeleteFromEditor (editorState, acceptedEntitiesTypes = [], contextualizations = {}) {
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap().toJS();
  const activeEntitiesIds = Object.keys(blockMap).reduce((finalList, blockMapId) => 
    finalList.concat(
      blockMap[blockMapId].characterList.filter(chara => chara.entity !== null).map(chara => chara.entity)
    )
  , [])
  .map(entityKey => contentState.getEntity(entityKey))
  .filter(entity => acceptedEntitiesTypes.indexOf(entity.getType()) > -1)
  .map(entity => entity.getData().contextualization.id);
  return Object.keys(contextualizations)
    .filter(key => activeEntitiesIds.indexOf(key) === -1);
}

export function deleteContextualizationFromEditor (editorState, acceptedEntitiesTypes = [], id, callback) {
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap().toJS();
  const entities = Object.keys(blockMap)
  .map(blockMapId => {

    return blockMap[blockMapId]
      .characterList
      .filter(chara => chara.entity !== null)
      .map(chara => chara.entity)
      .map(entityKey => ({
        entityKey, 
        entity: contentState.getEntity(entityKey),
        blockMapId
      }))
      .find(entity => {
        const data = entity.entity.getData();
        return data.contextualization && data.contextualization.id === id;
      });
  }).filter(d => d !== undefined);
  if (entities.length) {
    const entityInfos = entities[0];
    return contentState.getBlockForKey(entityInfos.blockMapId).findEntityRanges(
      (characterMetadata) => {
        return characterMetadata.entity === entityInfos.entityKey
      },
      (start, end) => {
        const selectionToDelete = SelectionState.createEmpty(entityInfos.blockMapId).merge({
          anchorOffset: start,
          focusOffset: end
        });
        let newContentState;
        newContentState = Modifier.removeRange(
          contentState,
          selectionToDelete,
        );
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
        const newEditor = EditorState.push(editorState, newContentState, 'replace-text')
        return callback(newEditor);
      });

  }
  return callback(editorState);
}