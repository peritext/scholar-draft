/**
 * This module exports a series of draft-js utils
 * to manipulate scholar-draft state upstream to component's implementation
 * @module scholar-draft/utils
 */
import {
  EditorState,
  Modifier,
  AtomicBlockUtils,
  SelectionState
} from 'draft-js';

import {
  NOTE_POINTER,
  INLINE_ASSET,
  BLOCK_ASSET
} from './constants';

/**
 * Inserts an inline or block asset within a draft-js editorState
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {object} asset - the asset data to embed withing draft-js new entity
 * @param {object} selection - the selection to use for targetting asset insertion
 * @return {ImmutableRecord} updatedEditorState - the new editor state
 */
export function insertAssetInEditor(
    editorState, 
    asset, 
    selection
  ) {
  const currentContent = editorState.getCurrentContent();
  const activeSelection = editorState.getSelection();
  const inputSelection = selection || activeSelection;

  // infer the type of insertion (BLOCK or INLINE)
  // from selection :
  // selection in empty block --> block insertion
  // else --> inline insertion
  // (note : could be provided as a param, but then would require a more complex behavior)
  const isInEmptyBlock = currentContent
                          .getBlockForKey(inputSelection.getStartKey())
                          .getText()
                          .trim().length === 0;
  const insertionType = isInEmptyBlock ? BLOCK_ASSET : INLINE_ASSET;

  // create new entity within content state
  let newContentState = editorState.getCurrentContent().createEntity(
      insertionType,
      'IMMUTABLE',
    {
      insertionType,
      asset
    }
    );
  const newEntityKey = newContentState.getLastCreatedEntityKey();

  // define a new selection
  const thatSelection = activeSelection.merge({
    anchorOffset: inputSelection.getStartOffset(),
    focusOffset: inputSelection.getEndOffset(),
    focusKey: inputSelection.getFocusKey(),
    anchorKey: inputSelection.getAnchorKey(),
  });
  // add the given selection to a new editor state with appropriate content state and selection
  let updatedEditor = EditorState.acceptSelection(
    EditorState.createWithContent(newContentState), 
    thatSelection
  );
  // insert block asset instruction
  if (insertionType === BLOCK_ASSET) {
    // create a new atomic block with asset's entity
    updatedEditor = AtomicBlockUtils.insertAtomicBlock(
        updatedEditor,
        newEntityKey,
        ' '
      );
    const newContent = updatedEditor.getCurrentContent();
    const blockMap = newContent.getBlockMap().toJS();

    // now we update the selection to be on the new block
    const blockE = Object.keys(blockMap).map(blockId => blockMap[blockId])
      .find((block) => {
        if (block.type === 'atomic') {
          return block.characterList.find(char => char.entity && char.entity === newEntityKey);
        }
        return undefined;
      });
    const block = newContent.getBlockAfter(blockE.key);
    const finalSelection = SelectionState.createEmpty(block.getKey());
    updatedEditor = EditorState.acceptSelection(updatedEditor, finalSelection);
  // insert inline asset instruction
  } else {
    // determine the range of the entity
    const anchorKey = thatSelection.getAnchorKey();
    const currentContentBlock = currentContent.getBlockForKey(anchorKey);
    const start = thatSelection.getStartOffset();
    const end = thatSelection.getEndOffset();
    let selectedText = currentContentBlock.getText().slice(start, end);
    // now we apply the entity to a portion of content
    // case 1 : asset annotates some existing selected text
    if (selectedText.length > 0) {
      // --> we apply the entity to that text
      newContentState = Modifier.applyEntity(
          currentContent,
          thatSelection,
          newEntityKey
        );
    // case 2 : asset targets an empty selection
    } else {
      // --> we apply the entity to a whitespace character
      selectedText = ' ';
      newContentState = Modifier.replaceText(
          currentContent,
          thatSelection,
          selectedText,
          null,
          newEntityKey
        );
    }
    // now we add a whitespace character after the new entity
    const endSelection = thatSelection.merge({
      anchorOffset: thatSelection.getEndOffset() + selectedText.length,
      focusOffset: thatSelection.getEndOffset() + selectedText.length,
    });
    newContentState = Modifier.replaceText(
        newContentState,
        endSelection,
        ' ',
        null,
        null
      );
    // finally, apply new content state ...
    updatedEditor = EditorState.push(editorState, newContentState, 'apply-entity');
    // ... and put selection after newly created content
    updatedEditor = EditorState.acceptSelection(updatedEditor, endSelection);
  }
  return updatedEditor;
}

export function insertInlineAssetInEditor(
    editorState, 
    asset, 
    selection
  ) {
  const currentContent = editorState.getCurrentContent();
  const activeSelection = editorState.getSelection();
  const inputSelection = selection || activeSelection;
  let newContentState = editorState.getCurrentContent().createEntity(
      INLINE_ASSET,
      'IMMUTABLE',
    {
      insertionType: INLINE_ASSET,
      asset
    }
    );

  const newEntityKey = newContentState.getLastCreatedEntityKey();
  const thatSelection = activeSelection.merge({
    anchorOffset: inputSelection.getStartOffset(),
    focusOffset: inputSelection.getEndOffset(),
    focusKey: inputSelection.getFocusKey(),
    anchorKey: inputSelection.getAnchorKey(),
  });
  let updatedEditor = EditorState.acceptSelection(
    EditorState.createWithContent(newContentState), 
    thatSelection
  );
  const anchorKey = thatSelection.getAnchorKey();
  const currentContentBlock = currentContent.getBlockForKey(anchorKey);
  const start = thatSelection.getStartOffset();
  const end = thatSelection.getEndOffset();
  let selectedText = currentContentBlock.getText().slice(start, end);
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
  updatedEditor = EditorState.acceptSelection(updatedEditor, endSelection);
  return updatedEditor;
}

/**
 * Inserts a block asset within a draft-js editorState
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {object} asset - the asset data to embed withing draft-js new entity
 * @param {object} selection - the selection to use for targetting asset insertion
 * @return {ImmutableRecord} updatedEditorState - the new editor state
 */
export function insertBlockAssetInEditor(
    editorState, 
    asset, 
    selection
  ) {
  const activeSelection = editorState.getSelection();
  const inputSelection = selection || activeSelection;

  const newContentState = editorState.getCurrentContent().createEntity(
      BLOCK_ASSET,
      'IMMUTABLE',
    {
      insertionType: BLOCK_ASSET,
      asset
    }
    );

  const newEntityKey = newContentState.getLastCreatedEntityKey();
  const thatSelection = activeSelection.merge({
    anchorOffset: inputSelection.getStartOffset(),
    focusOffset: inputSelection.getEndOffset(),
    focusKey: inputSelection.getFocusKey(),
    anchorKey: inputSelection.getAnchorKey(),
  });
  let updatedEditor = EditorState.acceptSelection(
    EditorState.createWithContent(newContentState), 
    thatSelection
  );
  updatedEditor = AtomicBlockUtils.insertAtomicBlock(
      updatedEditor,
      newEntityKey,
      ' '
    );
  /**
   * UPDATE SELECTION
   */
  const newContent = updatedEditor.getCurrentContent();
  const blockMap = newContent.getBlockMap().toJS();
  const blockE = Object.keys(blockMap).map(blockId => blockMap[blockId])
    .find((block) => {
      if (block.type === 'atomic') {
        return block.characterList.find(char => char.entity && char.entity === newEntityKey);
      }
      return undefined;
    });
  const block = newContent.getBlockAfter(blockE.key);
  const finalSelection = SelectionState.createEmpty(block.getKey());
  updatedEditor = EditorState.acceptSelection(updatedEditor, finalSelection);

  return updatedEditor;
}

/**
 * Inserts a note pointer entity within a draft-js editorState
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {string} noteId - the id of the note to embed (note : note number is handled upstream)
 * @param {object} selection - the selection to use for targetting asset insertion
 * @return {ImmutableRecord} updatedEditorState - the new editor state
 */
export function insertNoteInEditor(
    editorState, 
    noteId, 
    selection
  ) {
  const currentContent = editorState.getCurrentContent();
  let newContentState = currentContent.createEntity(
    NOTE_POINTER,
    'IMMUTABLE',
    { noteId }
  );
  const newEntityKey = newContentState.getLastCreatedEntityKey();
  const activeSelection = editorState.getSelection();
  // // retaining only the end of selection
  const thatSelection = activeSelection.merge({
    anchorOffset: activeSelection.getEndOffset(),
    focusOffset: activeSelection.getEndOffset(),
    focusKey: activeSelection.getAnchorKey(),
    anchorKey: activeSelection.getAnchorKey(),
  });
  let updatedEditor = EditorState.acceptSelection(
    EditorState.createWithContent(newContentState), 
    thatSelection
  );

  const selectedText = ' ';

  newContentState = Modifier.replaceText(
      currentContent,
      thatSelection,
      selectedText,
      null,
      newEntityKey
    );
  const anchorOffset = thatSelection.getEndOffset() + selectedText.length;
  const focusOffset = thatSelection.getEndOffset() + selectedText.length;
  let endSelection = thatSelection.merge({
    anchorOffset,
    focusOffset,
  });
  newContentState = Modifier.replaceText(
      newContentState,
      endSelection,
      '  ',
      null,
      null
    );
  endSelection = thatSelection.merge({
    anchorOffset: anchorOffset + 1,
    focusOffset: focusOffset + 1,
  });
  newContentState = Modifier.applyEntity(newContentState, endSelection, newEntityKey);
  updatedEditor = EditorState.push(editorState, newContentState, 'edit-entity');
  updatedEditor = EditorState.acceptSelection(updatedEditor, endSelection);
  return updatedEditor;
}

/**
 * Delete an asset from the editor, given its id only
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {string} id - the asset of the id to look for in entities' data
 * @param {func} callback - callbacks the updated editor state purged from targeted entity
 */
export function deleteAssetFromEditor(
  editorState, 
  id, 
  callback
) {
  // todo : try to optimize this with draftjs-utils
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap().toJS();
  const entities = Object.keys(blockMap)
  // iterate through blocks
  // todo : use getEntitiesRange ?
  .map(blockMapId => blockMap[blockMapId]
      .characterList
      // find characters attached to an entity
      .filter(chara => chara.entity !== null)
      // keep entities only
      .map(chara => chara.entity)
      // add info about entity and its location
      .map(entityKey => ({
        entityKey, 
        entity: contentState.getEntity(entityKey),
        blockMapId
      }))
      // find relevant entity (corresponding to the asset to delete)
      .find((entity) => {
        const data = entity.entity.getData();
        return data.asset && data.asset.id === id;
      })).filter(data => data !== undefined);
  if (entities.length) {
    const entityInfos = entities[0];
    return contentState.getBlockForKey(entityInfos.blockMapId).findEntityRanges(
      characterMetadata => characterMetadata.entity === entityInfos.entityKey,
      (start, end) => {
        const selectionToDelete = SelectionState.createEmpty(entityInfos.blockMapId).merge({
          anchorOffset: start,
          focusOffset: end
        });
        const newContentState = Modifier.removeRange(
          contentState,
          selectionToDelete,
        );
        const newEditor = EditorState.push(editorState, newContentState, 'replace-text');
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
export function deleteNoteFromEditor(
  editorState, 
  id, 
  callback
) {
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap().toJS();
  const entities = Object.keys(blockMap)
  // iterate through blocks
  .map(blockMapId => blockMap[blockMapId]
      .characterList
      // find characters attached to an entity
      .filter(chara => chara.entity !== null)
      // keep entities only
      .map(chara => chara.entity)
      // add info about entity and its location
      .map(entityKey => ({
        entityKey, 
        entity: contentState.getEntity(entityKey),
        blockMapId
      }))
      // find relevant entity (corresponding to the asset to delete)
      .find((entity) => {
        const data = entity.entity.getData();
        return data.noteId === id;
      })).filter(data => data !== undefined);
  if (entities.length) {
    const entityInfos = entities[0];
    return contentState.getBlockForKey(entityInfos.blockMapId).findEntityRanges(
      characterMetadata => characterMetadata.entity === entityInfos.entityKey,
      (start, end) => {
        const selectionToDelete = SelectionState.createEmpty(entityInfos.blockMapId).merge({
          anchorOffset: start,
          focusOffset: end
        });
        const newContentState = Modifier.removeRange(
          contentState,
          selectionToDelete,
        );
        const newEditor = EditorState.push(editorState, newContentState, 'replace-text');
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
export const updateNotesFromEditor = (editorState, inputNotes) => {
  const notes = inputNotes; // { ...inputNotes };
  const contentState = editorState.getCurrentContent();

  // list all entities
  // should be replaced by contentState.getEntityMap() with draft@0.11.0
  const entities = [];
  contentState.getBlockMap().forEach((block) => {
    block.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      if (entityKey) {
        entities.push(contentState.getEntity(entityKey));        
      }
    });
  });
  // filter to note pointer entities
  const noteEntities = entities
    .filter(thatEntity => thatEntity.getType() === NOTE_POINTER);

  // attribute orders to notes
  let order = 0;
  noteEntities.forEach((entity) => {
    const noteId = entity.getData().noteId;
    order++;
    if (notes[noteId]) {
      notes[noteId].order = order;
    }
  });
  const notesToDelete = Object.keys(notes)
  .filter((noteId) => {
    const entity = noteEntities.find(
      (noteEntity, index) => 
        noteEntity.getData().noteId === noteId
    );
    return entity === undefined;
  });

  notesToDelete.forEach((noteId) => {
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
 * @param {array<ImmutableRecord>} editorStates - the editor states to look into
 * the array of editor states to parse (e.g. main editor state 
 * + notes editor states)
 * @param {object} notes - a map of the notes with shape 
 * {noteId: string, order: number, editorState: ImmutableRecord}
 * @return {obj} newAssets - a map of the assets actually in use
 */
export const updateAssetsFromEditors = (editorStates, inputAssets) => {
  const assets = { ...inputAssets };
  // list all entities
  // todo: should be replaced by contentState.getEntityMap() with draft@0.11.0
  const entities = [];
  editorStates.forEach((editorState) => {
    const contentState = editorState.getCurrentContent();
    contentState.getBlockMap().forEach((block) => {
      block.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        if (entityKey) {
          entities.push(contentState.getEntity(entityKey));        
        }
      });
    });
  });
  const assetsEntities = entities
    .filter(thatEntity => 
      thatEntity.getType() === INLINE_ASSET ||
        thatEntity.getType() === BLOCK_ASSET
      );

  // filter unused assets
  return Object.keys(assets)
  .filter((assetId) => {
    const entity = assetsEntities.find(
      (assetEntity, index) => 
        assetEntity.getData().asset.id === assetId
    );
    return entity !== undefined;
  })
  .reduce((finalAssets, assetId) => {
    const asset = assets[assetId];
    return {
      ...finalAssets,
      [assetId]: asset
    };
  }, {});
};

/**
 * Gets entity data from an editor state and an asset id
 * @param {ImmutableRecord} editorState - the editor state to look into
 * @param {string} id - the asset id
 * @return {ImmutableRecord} entity - the related draft-js entity
 */
const getAssetEntity = (editorState, id) => {
  let entity;
  let data;
  let assetEntity;
  const contentState = editorState.getCurrentContent();
  contentState.getBlockMap().some((block) => {
    block.findEntityRanges((character) => {
      const entityKey = character.getEntity();
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
export function getUnusedAssets(editorState, assets) {
  return Object
  .keys(assets)
  .filter(id => getAssetEntity(editorState, id) === undefined);
}

/**
 * Gets assets being used in an editor state
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {object} assets - a map of the assets to parse
 * @return {array} newAssets - array of used assets
 */
export function getUsedAssets(editorState, assets) {
  return Object
  .keys(assets)
  .filter(id => getAssetEntity(editorState, id) !== undefined);
}

/**
 * Inserts a draft-js fragment within an editor state
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {ImmutableRecord} fragment - the fragment to embed
 * @return {ImmutableRecord} newEditorState - the new editor state
 */
export function insertFragment(editorState, fragment) {
  const newContent = Modifier.replaceWithFragment(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    fragment
  );
  return EditorState.push(
    editorState,
    newContent,
    'insert-fragment'
  );
}
