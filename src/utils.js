import {
  EditorState,
  Modifier,
  AtomicBlockUtils,
  SelectionState,
  genKey, 
  ContentBlock
} from 'draft-js';

import { List } from 'immutable';

import {
  NOTE_POINTER,
  INLINE_ASSET,
  BLOCK_ASSET
} from './constants';

/**
 * Utils taken from draft-js-markdown-plugin
 */

function getEmptyContentBlock() {
  return new ContentBlock({
    key: genKey(),
    text: '',
    characterList: List(),
  });
}

export function addText(editorState, bufferText) {
  const contentState = Modifier.insertText(editorState.getCurrentContent(), editorState.getSelection(), bufferText);
  return EditorState.push(editorState, contentState, 'insert-characters');
}

export function addEmptyBlock(editorState) {
  let contentState = editorState.getCurrentContent();
  const emptyBlock = getEmptyContentBlock();
  const blockMap = contentState.getBlockMap();
  const selectionState = editorState.getSelection();
  contentState = contentState.merge({
    blockMap: blockMap.set(emptyBlock.getKey(), emptyBlock),
    selectionAfter: selectionState.merge({
      anchorKey: emptyBlock.getKey(),
      focusKey: emptyBlock.getKey(),
      anchorOffset: 0,
      focusOffset: 0,
    }),
  });
  return EditorState.push(editorState, contentState, 'insert-characters');
}

/**
 * Other utils
 */

export function insertAssetInEditor(
    editorState, 
    asset, 
    selection
  ) {
  const currentContent = editorState.getCurrentContent();
  const activeSelection = editorState.getSelection();
  const inputSelection = selection || activeSelection;

  const isInEmptyBlock = currentContent.getBlockForKey(inputSelection.getStartKey()).getText().trim().length === 0;
  const insertionType = isInEmptyBlock ? BLOCK_ASSET : INLINE_ASSET;
  let newContentState = editorState.getCurrentContent().createEntity(
      insertionType,
      'IMMUTABLE',
    {
      insertionType,
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
  if (insertionType === BLOCK_ASSET) {
    updatedEditor = AtomicBlockUtils.insertAtomicBlock(
        updatedEditor,
        newEntityKey,
        ' '
      );
    const newContent = updatedEditor.getCurrentContent();
    const lastEntity = newContent.getEntity(newEntityKey);
    const blockMap = newContent.getBlockMap().toJS();
    const blockE = Object.keys(blockMap).map(blockId => blockMap[blockId])
      .find(block => {
        if (block.type === 'atomic') {
          return block.characterList.find(char => char.entity && char.entity === newEntityKey);
        }
      });
    const block = newContent.getBlockAfter(blockE.key);
    const finalSelection = SelectionState.createEmpty(block.getKey());

    // const finalSelection = block.getSelectionAfter();
    updatedEditor = EditorState.acceptSelection(updatedEditor, finalSelection);
  } else {
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
  }
  return updatedEditor;
}

export function insertNoteInEditor(
    editorState, 
    noteId, 
    selection
  ) {
  let newContentState = editorState.getCurrentContent().createEntity(
      NOTE_POINTER,
      'IMMUTABLE',
    {
      noteId
    }
    );
  const newEntityKey = newContentState.getLastCreatedEntityKey();
  const currentContent = editorState.getCurrentContent();
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
  const anchorKey = thatSelection.getAnchorKey();
  const currentContentBlock = currentContent.getBlockForKey(anchorKey);
  const start = thatSelection.getStartOffset();
  const end = thatSelection.getEndOffset();
  const selectedText = ' ';

  newContentState = Modifier.replaceText(
      currentContent,
      thatSelection,
      selectedText,
      null,
      // inlineStyle?: DraftInlineStyle,
      newEntityKey
    );
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
  newContentState = Modifier.applyEntity(newContentState, endSelection, newEntityKey);

  updatedEditor = EditorState.push(editorState, newContentState, 'apply-entity');
  updatedEditor = EditorState.acceptSelection(updatedEditor, endSelection);
  return updatedEditor;
}

export function getAssetsToDeleteFromEditor(
  editorState, 
  // acceptedEntitiesTypes = [], 
  assets = {}
) {
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap().toJS();
  const activeEntitiesIds = Object.keys(blockMap).reduce((finalList, blockMapId) => 
    finalList.concat(
      blockMap[blockMapId]
        .characterList
        .filter(chara => chara.entity !== null)
        .map(chara => chara.entity)
    )
  , [])
  .map(entityKey => contentState.getEntity(entityKey))
  // .filter(entity => acceptedEntitiesTypes.indexOf(entity.getType()) > -1)
  .map(entity => entity.getData().asset.id);
  return Object.keys(assets)
    .filter(key => activeEntitiesIds.indexOf(key) === -1);
}

export function deleteAssetFromEditor(
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

export const updateNotesFromEditor = (editorState, inputNotes) => {
  const notes = { ...inputNotes };
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap().toJS();
  // list active entities
  const noteEntities = Object.keys(blockMap).reduce((entities, blockMapId) => {
    const newEnt = blockMap[blockMapId]
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
        // find relevant entity (corresponding to the note to delete)
        .filter(thatEntity => thatEntity.entity.getType() === NOTE_POINTER);
    return entities.concat(newEnt);
  }, []);
  // attribute orders to notes
  let order = 0;
  noteEntities.forEach((entity) => {
    const noteId = entity.entity.getData().noteId;
    order++;
    if (notes[noteId]) {
      notes[noteId].order = order;
    } else {
      console.log('could note attribute order to note', noteId, ' in ', notes, notes[noteId]);
    }
  });
  // filter unused notes
  return Object.keys(notes)
  .filter((noteId) => {
    const note = notes[noteId];
    let entityIndex;
    const entity = noteEntities.find((noteEntity, index) => noteEntity.entity.getData().noteId === noteId);
    return entity !== undefined;
  })
  .reduce((finalNotes, noteId) => {
    const note = notes[noteId];
    return {
      ...finalNotes,
      [noteId]: note
    };
  }, {});
};

export const updateAssetsFromEditors = (editorStates, inputAssets) => {
  const assets = { ...inputAssets };
  // list active entities
  const assetsEntities = editorStates.reduce((total, editorState) => {
    const contentState = editorState.getCurrentContent();
    const blockMap = contentState.getBlockMap().toJS();
    return Object.keys(blockMap).reduce((entities, blockMapId) => {
      const newEnt = blockMap[blockMapId]
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
          .filter(thatEntity => 
            thatEntity.entity.getType() === INLINE_ASSET ||
            thatEntity.entity.getType() === BLOCK_ASSET
          );
      return entities.concat(newEnt);
    }, []);
  }, []);
  // filter unused assets
  return Object.keys(assets)
  .filter((assetId) => {
    const asset = assets[assetId];
    let entityIndex;
    const entity = assetsEntities.find((assetEntity, index) => assetEntity.entity.getData().asset.id === assetId);
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

const getAssetEntity = (editorState, id) => {
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap().toJS();
  const entity = Object.keys(blockMap)
  // iterate through blocks
  .find(blockMapId => blockMap[blockMapId]
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
      .find((thatEntity) => {
        const data = thatEntity.entity.getData();
        return data.asset && data.asset.id === id;
      }));
  return entity;
};

export function getUnusedAssets(editorState, assets) {
  return Object
  .keys(assets)
  .filter(id => getAssetEntity(editorState, id) === undefined);
}

export function getUsedAssets(editorState, assets) {
  return Object
  .keys(assets)
  .filter(id => getAssetEntity(editorState, id) !== undefined);
}
