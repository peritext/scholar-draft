/**
 * This module exports a series of draft-js utils
 * to manipulate scholar-draft state upstream to component's implementation
 * @module scholar-draft/utils
 */
import React from 'react';
import {
  EditorState,
  ContentState,
  Modifier,
  AtomicBlockUtils,
  SelectionState,
  CompositeDecorator
} from 'draft-js';

import { v4 as generateId } from 'uuid';

/*
 * import MultiDecorator from './multidecorators';
 * import SimpleDecorator from 'draft-js-simpledecorator';
 */

import {
  NOTE_POINTER,
  INLINE_ASSET,
  BLOCK_ASSET
} from './constants';

// modifiers helping to modify editorState
import handleBlockType from './modifiers/handleBlockType';
import handleInlineStyle from './modifiers/handleInlineStyle';
import handleNewCodeBlock from './modifiers/handleNewCodeBlock';
import insertEmptyBlock from './modifiers/insertEmptyBlock';
import leaveList from './modifiers/leaveList';
import insertText from './modifiers/insertText';

export const getOffsetRelativeToContainer = ( el, stopClassName ) => {
  try {
    let element = el;
    let offset = {
      offsetX: 0,
      offsetY: 0
    };
    if ( element ) {
      let { parentNode } = element;
      offset = {
        offsetX: el.offsetLeft || 0,
        offsetY: el.offsetTop || 0
      };
      while ( parentNode && parentNode.tagName !== 'BODY' && parentNode.className.indexOf( stopClassName ) === -1 ) {
        offset.offsetX += parentNode.offsetLeft;
        offset.offsetY += parentNode.offsetTop;
        element = parentNode;
        const { parentNode: newParentNode } = element.parentNode;
        parentNode = newParentNode;
      }
    }
    return offset;
  }
  catch ( error ) {
    return {
      offsetX: 0,
      offsetY: 0,
    };
  }
};

export const getEventTextRange = ( pageX, pageY ) => {
  try {
    let range;
    let textNode;
    let offset;

    if ( document.caretPositionFromPoint ) { // standard
      range = document.caretPositionFromPoint( pageX, pageY );
      textNode = range.offsetNode;
      const { offset: rangeOffset } = range;
      offset = rangeOffset;

    }
    else if ( document.caretRangeFromPoint ) { // WebKit
      range = document.caretRangeFromPoint( pageX, pageY );
      textNode = range.startContainer;
      offset = range.startOffset;
    }
    return { range, textNode, offset };
  }
  catch ( error ) {
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
export function insertAssetInEditor(
  editorState,
  asset,
  selection
) {
  const currentContent = editorState.getCurrentContent();
  const activeSelection = editorState.getSelection();
  const inputSelection = selection || activeSelection;

  /*
   * infer the type of insertion (BLOCK or INLINE)
   * from selection :
   * selection in empty block --> block insertion
   * else --> inline insertion
   * (note : could be provided as a param, but then would require a more complex behavior)
   */
  const isInEmptyBlock = currentContent
    .getBlockForKey( inputSelection.getStartKey() )
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
  const thatSelection = activeSelection.merge( {
    anchorOffset: inputSelection.getStartOffset(),
    focusOffset: inputSelection.getEndOffset(),
    focusKey: inputSelection.getFocusKey(),
    anchorKey: inputSelection.getAnchorKey(),
  } );
  // add the given selection to a new editor state with appropriate content state and selection
  let updatedEditor = EditorState.acceptSelection(
    EditorState.createWithContent( newContentState ),
    thatSelection
  );
  // insert block asset instruction
  if ( insertionType === BLOCK_ASSET ) {
    // create a new atomic block with asset's entity
    updatedEditor = AtomicBlockUtils.insertAtomicBlock(
      updatedEditor,
      newEntityKey,
      ' '
    );
    // const newContent = updatedEditor.getCurrentContent();

    // let blockKey;

    /*
     * newContent.getBlockMap().forEach(contentBlock => {
     *   if (contentBlock.getEntityAt(0) === newEntityKey) {
     *     blockKey = contentBlock.getKey();
     *   }
     * })
     */

    /*
     * now we update the selection to be on the new block
     * const nextBlock = newContent.getBlockAfter( blockKey );
     * console.log('next block', nextBlock, nextBlock.getKey())
     * const finalSelection = SelectionState.createEmpty( nextBlock.getKey() );
     * newContentState = Modifier.insertText(
     *   newContent,
     *   finalSelection,
     *   'coucou ça a va',
     *   null,
     * );
     */

    // updatedEditor = EditorState.createWithContent(newContentState, updatedEditor.getDecorator())
    
  // insert inline asset instruction
  }
  else if ( insertionType === INLINE_ASSET ) {
    // determine the range of the entity
    const anchorKey = thatSelection.getAnchorKey();
    const currentContentBlock = currentContent.getBlockForKey( anchorKey );
    const start = thatSelection.getStartOffset();
    const end = thatSelection.getEndOffset();
    let selectedText = currentContentBlock.getText().slice( start, end );

    /*
     * now we apply the entity to a portion of content
     * case 1 : asset annotates some existing selected text
     */
    if ( selectedText.length > 0 ) {
      // --> we apply the entity to that text
      newContentState = Modifier.applyEntity(
        currentContent,
        thatSelection,
        newEntityKey
      );
    // case 2 : asset targets an empty selection
    }
    else {
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
    let endSelection = thatSelection.merge( {
      anchorOffset: thatSelection.getEndOffset() + selectedText.length,
      focusOffset: thatSelection.getEndOffset() + selectedText.length,
    } );
    newContentState = Modifier.replaceText(
      newContentState,
      endSelection,
      '  ',
      null,
      null
    );
    // then we put the selection at end
    endSelection = endSelection.merge( {
      anchorOffset: endSelection.getEndOffset() + 1,
      focusOffset: endSelection.getEndOffset() + 1,
    } );
    // finally, apply new content state ...
    updatedEditor = EditorState.push( editorState, newContentState, 'apply-entity' );

    // /*
    //  * ... and put selection after newly created content
    //  * dirty workaround for a firefox-specific bug - related to https://github.com/facebook/draft-js/issues/1812
    //  */
    // if ( navigator.userAgent.search( 'Firefox' ) > -1 ) {
    //   updatedEditor = EditorState.acceptSelection( updatedEditor, endSelection );
    // }
    // else {
    //   updatedEditor = EditorState.forceSelection( updatedEditor, endSelection );
    // }
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
export function insertInlineAssetInEditor(
  editorState,
  asset,
  selection,
  mutable = false
) {
  const currentContent = editorState.getCurrentContent();
  const activeSelection = editorState.getSelection();
  const inputSelection = selection || activeSelection;
  let newContentState = editorState.getCurrentContent().createEntity(
    INLINE_ASSET,
    mutable ? 'MUTABLE' : 'IMMUTABLE',
    {
      insertionType: INLINE_ASSET,
      asset
    }
  );

  const newEntityKey = newContentState.getLastCreatedEntityKey();
  const thatSelection = activeSelection.merge( {
    anchorOffset: inputSelection.getStartOffset(),
    focusOffset: inputSelection.getEndOffset(),
    focusKey: inputSelection.getFocusKey(),
    anchorKey: inputSelection.getAnchorKey(),
  } );
  let updatedEditor = EditorState.acceptSelection(
    EditorState.createWithContent( newContentState ),
    thatSelection
  );
  const anchorKey = thatSelection.getAnchorKey();
  const currentContentBlock = currentContent.getBlockForKey( anchorKey );
  const start = thatSelection.getStartOffset();
  const end = thatSelection.getEndOffset();
  let selectedText = currentContentBlock.getText().slice( start, end );
  if ( selectedText.length > 0 ) {
    newContentState = Modifier.applyEntity(
      currentContent,
      thatSelection,
      newEntityKey
    );
  }
  else {
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
  const endSelection = thatSelection.merge( {
    anchorOffset: thatSelection.getEndOffset(),
    focusOffset: thatSelection.getEndOffset(),
  } );

  /*
   * newContentState = Modifier.replaceText(
   *   newContentState,
   *   endSelection,
   *   ' ',
   *   null,
   *   null
   * );
   */
  updatedEditor = EditorState.push( editorState, newContentState, 'apply-entity' );
  updatedEditor = EditorState.acceptSelection( updatedEditor, endSelection );
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
  selection,
  mutable = false,
  allowReplacingBlock = false,
) {
  const activeSelection = editorState.getSelection();
  const inputSelection = selection || activeSelection;

  let selectionInEmptyBlock;
  // let selectionInAtomic;
  if ( inputSelection.isCollapsed() ) {
    const blockId = inputSelection.getAnchorKey();
    const block = editorState.getCurrentContent().getBlockForKey( blockId );
    const text = block.getText();
    const type = block.getType();
    if ( text.trim().length === 0 && type !== 'atomic' ) {
      selectionInEmptyBlock = blockId;
    } /* else if (type === 'atomic') {
      selectionInAtomic = true;
    } */
  }

  const newContentState = editorState.getCurrentContent().createEntity(
    BLOCK_ASSET,
    mutable ? 'MUTABLE' : 'IMMUTABLE',
    {
      insertionType: BLOCK_ASSET,
      asset
    }
  );

  const newEntityKey = newContentState.getLastCreatedEntityKey();
  const thatSelection = activeSelection.merge( {
    anchorOffset: inputSelection.getStartOffset(),
    focusOffset: inputSelection.getEndOffset(),
    focusKey: inputSelection.getFocusKey(),
    anchorKey: inputSelection.getAnchorKey(),
  } );

  let updatedEditor = EditorState.acceptSelection(
    EditorState.createWithContent( newContentState ),
    thatSelection
  );

  updatedEditor = AtomicBlockUtils.insertAtomicBlock(
    updatedEditor,
    newEntityKey,
    ' '
  );
  if ( selectionInEmptyBlock ) {
    updatedEditor = EditorState.acceptSelection(
      EditorState.createWithContent( ContentState
        .createFromBlockArray( /* eslint array-callback-return : 0 */
          updatedEditor.getCurrentContent().getBlocksAsArray().filter( ( block, blockIndex ) => {
            const key = block.getKey();
            if ( blockIndex === 0 || key !== selectionInEmptyBlock ) {
              return true;
            }
          } ),
          updatedEditor.getCurrentContent().getBlockMap()
        ) ),
      thatSelection
    );
  }

  /**
   * UPDATE SELECTION
   */
  const newContent = updatedEditor.getCurrentContent();
  const blockMap = newContent.getBlockMap().toJS();
  const blockE = Object.keys( blockMap ).map( ( blockId ) => blockMap[blockId] )
    .find( ( block ) => {
      if ( block.type === 'atomic' ) {
        return block.characterList.find( ( char ) => char.entity && char.entity === newEntityKey );
      }
      return undefined;
    } );
  if ( blockE ) {
    const block = newContent.getBlockAfter( blockE.key );
    const finalSelection = SelectionState.createEmpty( block.getKey() );
    updatedEditor = EditorState.acceptSelection( updatedEditor, finalSelection );
  }
  
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
  const thatSelection = activeSelection.merge( {
    anchorOffset: activeSelection.getEndOffset(),
    focusOffset: activeSelection.getEndOffset(),
    focusKey: activeSelection.getAnchorKey(),
    anchorKey: activeSelection.getAnchorKey(),
  } );
  let updatedEditor = EditorState.acceptSelection(
    EditorState.createWithContent( newContentState ),
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
  let endSelection = thatSelection.merge( {
    anchorOffset,
    focusOffset,
  } );
  newContentState = Modifier.replaceText(
    newContentState,
    endSelection,
    ' ',
    null,
    null
  );
  endSelection = thatSelection.merge( {
    anchorOffset: anchorOffset + 1,
    focusOffset: focusOffset + 1,
  } );
  newContentState = Modifier.applyEntity( newContentState, endSelection, newEntityKey );
  updatedEditor = EditorState.push( editorState, newContentState, 'edit-entity' );
  updatedEditor = EditorState.acceptSelection( updatedEditor, endSelection );
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
  const entities = Object.keys( blockMap )

  /*
   * iterate through blocks
   * todo : use getEntitiesRange ?
   */
    .map( ( blockMapId ) => blockMap[blockMapId]
      .characterList
      // find characters attached to an entity
      .filter( ( chara ) => chara.entity !== null )
      // keep entities only
      .map( ( chara ) => chara.entity )
      // add info about entity and its location
      .map( ( entityKey ) => ( {
        entityKey,
        entity: contentState.getEntity( entityKey ),
        blockMapId
      } ) )
      // find relevant entity (corresponding to the asset to delete)
      .find( ( entity ) => {
        const data = entity.entity.getData();
        return data.asset && data.asset.id === id;
      } ) ).filter( ( data ) => data !== undefined );
  if ( entities.length ) {
    const entityInfos = entities[0];
    return contentState.getBlockForKey( entityInfos.blockMapId ).findEntityRanges(
      ( characterMetadata ) => characterMetadata.entity === entityInfos.entityKey,
      ( start, end ) => {
        const selectionToDelete = SelectionState.createEmpty( entityInfos.blockMapId ).merge( {
          anchorOffset: start,
          focusOffset: end
        } );
        const newContentState = Modifier.removeRange(
          contentState,
          selectionToDelete,
        );
        const newEditor = EditorState.push( editorState, newContentState, 'replace-text' );
        return callback( newEditor );
      }
    );

  }
  return callback( editorState );
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
export function deleteNoteFromEditor(
  editorState,
  id,
  callback
) {
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap().toJS();
  const entities = Object.keys( blockMap )
  // iterate through blocks
    .map( ( blockMapId ) => blockMap[blockMapId]
      .characterList
      // find characters attached to an entity
      .filter( ( chara ) => chara.entity !== null )
      // keep entities only
      .map( ( chara ) => chara.entity )
      // add info about entity and its location
      .map( ( entityKey ) => ( {
        entityKey,
        entity: contentState.getEntity( entityKey ),
        blockMapId
      } ) )
      // find relevant entity (corresponding to the asset to delete)
      .find( ( entity ) => {
        const data = entity.entity.getData();
        return data.noteId === id;
      } ) ).filter( ( data ) => data !== undefined );
  if ( entities.length ) {
    const entityInfos = entities[0];
    return contentState.getBlockForKey( entityInfos.blockMapId ).findEntityRanges(
      ( characterMetadata ) => characterMetadata.entity === entityInfos.entityKey,
      ( start, end ) => {
        const selectionToDelete = SelectionState.createEmpty( entityInfos.blockMapId ).merge( {
          anchorOffset: start,
          focusOffset: end
        } );
        const newContentState = Modifier.removeRange(
          contentState,
          selectionToDelete,
        );
        const newEditor = EditorState.push( editorState, newContentState, 'replace-text' );
        return callback( newEditor );
      }
    );

  }
  return callback( editorState );
}

/**
 * Updates notes number and delete notes which are not any more pointed in the given editor state
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {object} notes - a map of the notes
 * with shape {noteId: string, order: number, editorState: ImmutableRecord}
 * @return {obj} {newNotes, notesOrder} - a map of the
 * updated notes and the notes order infered from the editor
 */
export const updateNotesFromEditor = ( editorState, inputNotes ) => {
  const notes = inputNotes; // { ...inputNotes };
  const contentState = editorState.getCurrentContent();

  /*
   * list all entities
   * should be replaced by contentState.getEntityMap() with draft@0.11.0
   */
  const entities = [];
  contentState.getBlockMap().forEach( ( block ) => {
    block.findEntityRanges( ( character ) => {
      const entityKey = character.getEntity();
      if ( entityKey ) {
        entities.push( contentState.getEntity( entityKey ) );
      }
    } );
  } );
  // filter to note pointer entities
  const noteEntities = entities
    .filter( ( thatEntity ) => thatEntity.getType() === NOTE_POINTER );

  const notesOrder = [];

  // attribute orders to notes
  let order = 0;
  noteEntities.forEach( ( entity ) => {
    const { noteId } = entity.getData();
    notesOrder.push( noteId );
    order++;
    if ( notes[noteId] ) {
      notes[noteId].order = order;
    }
  } );
  const notesToDelete = Object.keys( notes )
    .filter( ( noteId ) => {
      const entity = noteEntities.find( ( noteEntity, index ) =>
        noteEntity.getData().noteId === noteId );
      return entity === undefined;
    } );

  notesToDelete.forEach( ( noteId ) => {
    delete notes[noteId];
  } );

  return {
    newNotes: notes,
    notesOrder
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
export const updateAssetsFromEditors = ( editorStates, inputAssets ) => {
  const assets = { ...inputAssets };

  /*
   * list all entities
   * todo: should be replaced by contentState.getEntityMap() with draft@0.11.0
   */
  const entities = [];
  editorStates.forEach( ( editorState ) => {
    const contentState = editorState.getCurrentContent();
    contentState.getBlockMap().forEach( ( block ) => {
      block.findEntityRanges( ( character ) => {
        const entityKey = character.getEntity();
        if ( entityKey ) {
          entities.push( contentState.getEntity( entityKey ) );
        }
      } );
    } );
  } );
  const assetsEntities = entities
    .filter( ( thatEntity ) =>
      thatEntity.getType() === INLINE_ASSET ||
        thatEntity.getType() === BLOCK_ASSET );

  // filter unused assets
  return Object.keys( assets )
    .filter( ( assetId ) => {
      const entity = assetsEntities.find( ( assetEntity, index ) =>
        assetEntity.getData().asset.id === assetId );
      return entity !== undefined;
    } )
    .reduce( ( finalAssets, assetId ) => {
      const asset = assets[assetId];
      return {
        ...finalAssets,
        [assetId]: asset
      };
    }, {} );
};

/**
 * Gets entity data from an editor state and an asset id
 * @param {ImmutableRecord} editorState - the editor state to look into
 * @param {string} id - the asset id
 * @return {ImmutableRecord} entity - the related draft-js entity
 */
export const getAssetEntity = ( editorState, id ) => {
  let entity;
  let data;
  let assetEntity;
  const contentState = editorState.getCurrentContent();
  contentState.getBlockMap().some( ( block ) => {
    block.findEntityRanges( ( character ) => {
      const entityKey = character.getEntity();
      if ( entityKey ) {
        entity = contentState.getEntity( entityKey );
        data = entity.getData();
        if ( data.asset && data.asset.id === id ) {
          assetEntity = entity;
        }
      }
    } );
    if ( assetEntity ) {
      return true;
    }
    return false;
  } );
  return assetEntity;
};

/**
 * Gets assets not being used in an editor state
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {object} assets - a map of the assets to parse
 * @return {array} newAssets - array of unused assets
 */
export function getUnusedAssets( editorState, assets = {} ) {
  return Object
    .keys( assets )
    .filter( ( id ) => getAssetEntity( editorState, id ) === undefined );
}

/**
 * Gets assets being used in an editor state
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {object} assets - a map of the assets to parse
 * @return {array} newAssets - array of used assets
 */
export function getUsedAssets( editorState, assets = {} ) {
  return Object
    .keys( assets )
    .filter( ( id ) => getAssetEntity( editorState, id ) !== undefined );
}

/**
 * Inserts a draft-js fragment within an editor state
 * @param {ImmutableRecord} editorState - the editor state before change
 * @param {ImmutableRecord} fragment - the fragment to embed
 * @return {ImmutableRecord} newEditorState - the new editor state
 */
export function insertFragment( editorState, fragment ) {
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

/**
 * Gets the block element corresponding to a given range of selection
 * @param {object} range - the input range to look in
 * @return {object} node
 */
export const getSelectedBlockElement = ( range ) => {
  try {
    let node = range.startContainer;
    do {
      if (
        node.getAttribute &&
        (
          node.getAttribute( 'data-block' ) == 'true' ||
          node.getAttribute( 'data-contents' ) == 'true'
        )
      ) {
        return node;
      }
      node = node.parentNode;
    } while ( node != null );
  }
  catch ( error ) {
    return null;
  }
  return null;
};

/**
 * Gets the current window's selection range (start and end)
 * @return {object} selection range
 */
export const getSelectionRange = () => {
  const selection = window.getSelection();
  if ( selection.rangeCount === 0 ) return null;
  return selection.getRangeAt( 0 );
};

/**
 * Checks if a DOM element is parent of another one
 * @param {inputEle} DOMEl - the presumed child
 * @param {inputEle} DOMEl - the presumed parent
 * @return {boolean} isParent - whether yes or no
 */
export const isParentOf = ( inputEle, maybeParent ) => {
  try {
    let ele = inputEle;
    while ( ele.parentNode != null && ele.parentNode != document.body ) { /* eslint eqeqeq:0 */
      if ( ele.parentNode === maybeParent ) return true;
      ele = ele.parentNode;
    }
    return false;
  }
  catch ( error ) {
    return false;
  }
};

/**
 * Handles a character's style
 * @param {ImmutableRecord} editorState - the input editor state
 * @param {ImmutableRecord} character - the character to check
 * @return {ImmutableRecord} newEditorState - the new editor state
 */
export function checkCharacterForState( editorState, character ) {
  let newEditorState = handleBlockType( editorState, character );
  if ( editorState === newEditorState ) {
    newEditorState = handleInlineStyle( editorState, character );
  }
  return newEditorState;
}

// todo : this function is a perf bottleneck
/**
 * Resolves return key hit
 * @param {ImmutableRecord} editorState - the input editor state
 * @param {object} ev - the original key event
 * @return {ImmutableRecord} newEditorState - the new editor state
 */
export function checkReturnForState( editorState, ev ) {
  let newEditorState = editorState;
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const currentBlock = contentState.getBlockForKey( key );
  const type = currentBlock.getType();
  const text = currentBlock.getText();
  if ( /-list-item$/.test( type ) && text === '' ) {
    newEditorState = leaveList( editorState );
  }
  if ( newEditorState === editorState &&
    ( ev.ctrlKey || ev.shiftKey || ev.metaKey || ev.altKey || /^header-/.test( type ) ) ) {
    newEditorState = insertEmptyBlock( editorState );
  }
  if ( newEditorState === editorState && type === 'code-block' ) {
    newEditorState = insertText( editorState, '\n' );
  }
  if ( newEditorState === editorState ) {
    newEditorState = handleNewCodeBlock( editorState );
  }

  return newEditorState;
}

/**
 * This class allows to produce event emitters
 * that will be used to dispatch assets changes
 * and notes changes through context
 */
export class Emitter {
  assetsListeners = new Map()
  notesListeners = new Map()
  assetChoicePropsListeners = new Map()
  renderingModeListeners = new Map()
  customContextListeners = new Map()

  subscribeToAssets = ( listener ) => {
    const id = generateId();
    this.assetsListeners.set( id, listener );
    return () => this.assetsListeners.delete( id );
  }

  subscribeToNotes = ( listener ) => {
    const id = generateId();
    this.notesListeners.set( id, listener );
    return () => this.notesListeners.delete( id );
  }

  subscribeToAssetChoiceProps = ( listener ) => {
    const id = generateId();
    this.assetChoicePropsListeners.set( id, listener );
    return () => this.assetChoicePropsListeners.delete( id );
  }

  subscribeToRenderingMode = ( listener ) => {
    const id = generateId();
    this.renderingModeListeners.set( id, listener );
    return () => this.renderingModeListeners.delete( id );
  }

  subscribeToCustomContext = ( listener ) => {
    const id = generateId();
    this.customContextListeners.set( id, listener );
    return () => this.customContextListeners.delete( id );
  }

  dispatchAssets = ( assets ) => {
    this.assetsListeners.forEach( ( listener ) => {
      listener( assets );
    } );
  }
  dispatchNotes= ( notes ) => {
    this.notesListeners.forEach( ( listener ) => {
      listener( notes );
    } );
  }

  dispatchAssetChoiceProps= ( props ) => {
    this.assetChoicePropsListeners.forEach( ( listener ) => {
      listener( props );
    } );
  }

  dispatchRenderingMode = ( renderingMode ) => {
    this.renderingModeListeners.forEach( ( listener ) => {
      listener( renderingMode );
    } );
  }

  dispatchCustomContext = ( customContext ) => {
    this.customContextListeners.forEach( ( listener ) => {
      listener( customContext );
    } );
  }
}

/**
 * Util for Draft.js strategies building
 */
export const findWithRegex = ( regex, contentBlock, callback ) => {
  const text = contentBlock.getText();
  let matchArr;
  let start;
  while ( ( matchArr = regex.exec( text ) ) !== null ) {
    start = matchArr.index;
    callback( start, start + matchArr[0].length );
  }
};

/**
 * Draft.js strategy for finding quotes statements
 * @param {ImmutableRecord} contentBlock - the content block in which entities are searched
 * @param {function} callback - callback with arguments (startRange, endRange, props to pass)
 * @param {ImmutableRecord} inputContentState - the content state to parse
 */
/*
 * todo: improve with all lang./typography
 * quotes configurations (french quotes, english quotes, ...)
 */
export const findQuotes = ( contentBlock, callback, contentState ) => {
  const QUOTE_REGEX = /("[^"]+")/gi;
  findWithRegex( QUOTE_REGEX, contentBlock, callback );
};

/**
 * Draft.js strategy for finding inline note pointers and loading them with relevant props
 * @param {ImmutableRecord} contentBlock - the content block in which entities are searched
 * @param {function} callback - callback with arguments (startRange, endRange, props to pass)
 * @param {ImmutableRecord} inputContentState - the content state to parse
 */
export const findNotePointer = ( contentBlock, callback, inputContentState ) => {
  const contentState = inputContentState;
  if ( contentState === undefined ) {
    return callback( null );

  /*
   *  if ( !this.props.editorState ) {
   *    return callback( null );
   *  }
   *  contentState = this.props.editorState.getCurrentContent();
   */
  }
  contentBlock.findEntityRanges(
    ( character ) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
       contentState.getEntity( entityKey ).getType() === NOTE_POINTER
      );
    },
    ( start, end ) => {
      const entityKey = contentBlock.getEntityAt( start );
      const data = contentState.getEntity( entityKey ).toJS();

      const props = {
        ...data.data,
      };
      callback( start, end, props );
    }
  );
};

/**
 * Draft.js strategy for finding inline assets and loading them with relevant props
 * @param {ImmutableRecord} contentBlock - the content block in which entities are searched
 * @param {function} callback - callback with arguments (startRange, endRange, props to pass)
 * @param {ImmutableRecord} inputContentState - the content state to parse
 */
export const findInlineAsset = ( contentBlock, callback, inputContentState, inputProps ) => {
  const contentState = inputContentState;
  if ( contentState === undefined ) {
    // if ( !this.props.editorState ) {
    return callback( null );

    /*
     * }
     * contentState = this.props.editorState.getCurrentContent();
     */
  }
  contentBlock.findEntityRanges(
    ( character ) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
          contentState.getEntity( entityKey ).getType() === INLINE_ASSET
      );
    },
    ( start, end ) => {
      const {
        assets,
        renderingMode,
        inlineAssetComponents: components,
      } = inputProps;

      const entityKey = contentBlock.getEntityAt( start );
      const data = contentState.getEntity( entityKey ).toJS();
      const id = data && data.data && data.data.asset && data.data.asset.id;
      const asset = assets[id];
      const AssetComponent = asset && components[asset.type] ?
        components[asset.type]
        : () => ( <span /> );

      let props = {};
      if ( id ) {
        props = {
          assetId: id,
          renderingMode,
          AssetComponent,
        };
      }
      callback( start, end, props );
    }
  );
};

export const createDecorator = ( {
  NotePointerComponent,
  findInlineAsset: findInlineAssetMethod,
  findNotePointer: findNotePointerMethod,
  findQuotes: findQuotesMethod,
  InlineAssetContainerComponent,
  QuoteContainerComponent,
  inlineEntities, /* [{strategy: function, entity: component}] */
} ) => {

  /*
   * return new MultiDecorator( [
   *   new SimpleDecorator( findInlineAssetMethod, InlineAssetContainerComponent ),
   *   new SimpleDecorator( findNotePointerMethod, NotePointerComponent ),
   *   new SimpleDecorator( findQuotesMethod, QuoteContainerComponent ),
   *   ...( inlineEntities || [] ).map( ( entity ) =>
   *     new SimpleDecorator( entity.strategy, entity.component ) )
   * ] );
   */

  return new CompositeDecorator( [
    {
      strategy: findInlineAssetMethod,
      component: InlineAssetContainerComponent
    },
    {
      strategy: findNotePointerMethod,
      component: NotePointerComponent
    },
    {
      strategy: findQuotesMethod,
      component: QuoteContainerComponent
    },
    ...( inlineEntities || [] )
  ] );
};
