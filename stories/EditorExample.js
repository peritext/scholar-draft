import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {debounce} from 'lodash';

import {mapSeries} from 'async';
import {
  EditorState,
  Modifier,
  Entity,
  AtomicBlockUtils,
  convertToRaw,
  convertFromRaw
} from 'draft-js';

import {
  getSelectedBlocksList
} from 'draftjs-utils';

import {
  v4 as generateId
} from 'uuid';

import Editor, {
  utils,
  constants
} from '../src';
const {
  NOTE_POINTER,
  INLINE_ASSET
} = constants;

const {
  getAssetsToDeleteFromEditor,
  insertAssetInEditor,
  deleteAssetFromEditor,
  deleteNoteFromEditor,
  getUsedAssets,
  getUnusedAssets,
  updateNotesFromEditor,
  insertNoteInEditor,
  updateAssetsFromEditors,
  insertFragment
} = utils;

import ExampleBlockCitation from './ExampleBlockCitation';
import ExampleInlineCitation from './ExampleInlineCitation';
import ExampleBlockAssetChoice from './ExampleBlockAssetChoice';

const inlineAssetComponents = {
  citation: ExampleInlineCitation
};

const blockAssetComponents = {
  citation: ExampleBlockCitation
};

export default class EditorExample extends Component {
  
  state = {
    // mock related
    assetRequest: false,
    assetRequestType: undefined,
    // all these should be handled by upstream logic in real applications
    mainEditorState: EditorState.createEmpty(),
    notes: {},
    inlineAssetComponents,
    blockAssetComponents,
    contextualizations: {
    },
    resources: {
      [generateId()]: {
        title: 'My nice resource',
        authors: [
          {
            firstName: 'Mickey',
            lastName: 'Rourque'
          }
        ]
      }
    },
    contextualizers: {
      [generateId()]: {
        type: 'citation',
        pages: '12-13'
      }
    },
    readOnly: {
      main: false
    }
  }


  constructor(props) {
    super(props);
    this.cleanStuffFromEditorInspection = debounce(this.cleanStuffFromEditorInspection, 1000);
  }

  componentDidMount = () => {
    document.addEventListener('copy', this.onCopy);
    document.addEventListener('cut', this.onCopy);
    document.addEventListener('paste', this.onPaste);
  }

  componentWillUnmount = () => {
    document.removeEventListener('copy', this.onCopy);
    document.removeEventListener('cut', this.onCopy);
    document.removeEventListener('paste', this.onPaste);
  }

  updateNotesFromEditor = () => {
    const notes = updateNotesFromEditor(this.state.mainEditorState, this.state.notes);
    this.setState({
      notes
    });
  }

  cleanStuffFromEditorInspection = () => {
    // this.clearContextualizations();
    this.updateNotesFromEditor();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.mainEditorState !== prevState.mainEditorState) {
      this.cleanStuffFromEditorInspection();
    }
  }

  // loading data into the clipboard
  onCopy = e => {
    // must do --> we store entities data as js object to reinject them at parsing in editor states
    const copiedEntities = {};
    const copiedNotes = [];
    // for mocks purposes
    const copiedContextualizers = [];
    const copiedContextualizations = [];

    let clipboard = null;
    let currentContent;
    let editorState;
    let activeId;
    const {
      readOnly
    } = this.state;
    if (!readOnly.main) {
      clipboard = this.editor.mainEditor.editor.getClipboard();
      editorState = this.state.mainEditorState;
    } else {
      activeId = Object.keys(this.state.notes)
        .find(id => !readOnly[id]);
      editorState = this.state.notes[activeId].editorState;
      clipboard = this.editor.notes[activeId].editor.getClipboard();
    }
    // todo : this is bad, due to problems with readonly management
    if (!activeId) {
      activeId = 'main';
    }
    copiedEntities[activeId] = [];
    currentContent = editorState.getCurrentContent();
    const selectedBlocksList = getSelectedBlocksList(editorState);

    this.setState({
      clipboard
    });

    selectedBlocksList.forEach(contentBlock => {
      const block = contentBlock.toJS();
      const entitiesIds = block.characterList.filter(char => char.entity).map(char => char.entity);
      let entity;
      let eData;
      entitiesIds.forEach(entityKey => {
        entity = currentContent.getEntity(entityKey);
        eData = entity.toJS();
        copiedEntities[activeId].push({
          key: entityKey,
          entity: eData
        });
        const type = eData.type;
        // copying note pointer and note
        if (type === NOTE_POINTER) {
          const noteId = eData.data.noteId;
          const noteContent = this.state.notes[noteId].editorState.getCurrentContent();
          const rawContent = convertToRaw(noteContent);
          copiedEntities[noteId] = [];
          copiedNotes.push({
            id: noteId,
            // ...this.state.notes[noteId],
            rawContent
          });
          // copying note's entities
          noteContent.getBlockMap().forEach(block => {
            block.getCharacterList().map(char => {
              if (char.entity) {
                entityKey = char.entity;
                entity = currentContent.getEntity(entityKey);
                eData = entity.toJS();
                copiedEntities[noteId].push({
                  key: entityKey,
                  entity: eData
                });
              }
            })
            return true;
          });
        // copying asset pointer
        } else {
          // mock
          const assetId = entity.data.asset.id;
          const contextualization = this.state.contextualizations[assetId];
          copiedContextualizations.push({...contextualization});
          copiedContextualizers.push({
            ...this.state.contextualizers[contextualization.contextualizerId],
            id: contextualization.contextualizerId
          });
        }
      });
      return true;
    });
    const copiedData = {
      copiedEntities,
      copiedContextualizations,
      copiedContextualizers,
      copiedNotes
    };
    const serializedCopiedData = JSON.stringify(copiedData);
    e.clipboardData.setData('data', serializedCopiedData);
    e.clipboardData.setData('text/plain', '$$$internal-clipboard');
    e.preventDefault();
    this.setState({
      copiedData
    });
  }

  onPaste = e => {
    // if data comes from out of the editor
    if (e.clipboardData.getData('text/plain') !== '$$$internal-clipboard') {
      this.setState({
        clipboard: null,
        copiedData: null
      });
      return;
    }
    // let currentContent;
    let editorState;
    let activeId;
    const {
      readOnly,
      clipboard,
      copiedData
    } = this.state;
    if (!readOnly.main) {
      activeId = 'main';
      editorState = this.state.mainEditorState;
    } else {
      activeId = Object.keys(this.state.notes)
        .find(id => !readOnly[id]);
      editorState = this.state.notes[activeId].editorState;
    }
    const currentContent = editorState.getCurrentContent();
    const stateMods = {
      mainEditorState: this.state.mainEditorState,
      notes: {...this.state.notes},
      contextualizers: {...this.state.contextualizers},
      contextualizations: {...this.state.contextualizations},
      resources: {...this.state.resources}
    };
    let newEditorState = editorState;
    if (typeof copiedData === 'object') {
      try{
        const data = copiedData;
        if (data.copiedContextualizations) {
          stateMods.contextualizations = data.copiedContextualizations.reduce((result, contextualization) => {
            return {
              ...result,
              [contextualization.id]: contextualization
            }
          }, {...this.state.contextualizations});
        }
        if (data.copiedContextualizers) {
          stateMods.contextualizers = data.copiedContextualizers.reduce((result, contextualizer) => {
            return {
              ...result,
              [contextualizer.id]: contextualizer
            }
          }, {...this.state.contextualizer});
        }
        // notes
        if (data.copiedNotes) {
          stateMods.notes = {
            ...stateMods.notes,
            ...data.copiedNotes.reduce((result, note) => {
              const newEditorState = EditorState.createWithContent(convertFromRaw(note.rawContent));
              return {
                ...result,
                [note.id]: {
                  ...note,
                  editorState: newEditorState
                }
              };
            }, {...stateMods.notes})
          }
        }
        // integrate entities in respective editorStates
        if (Object.keys(data.copiedEntities).length) {
          let newContentState;
          Object.keys(data.copiedEntities).forEach(contentId => {
            if (contentId === 'main') {
              const editor = stateMods.mainEditorState;
              newContentState = editor.getCurrentContent();
              data.copiedEntities[contentId].forEach(entity => {
                newContentState = newContentState.createEntity(entity.entity);
                // storing old entity key
                // entity.oldKey = entity.key;
                // storing new entity key
                entity.key  = newContentState.getLastCreatedEntityKey();
              });
              stateMods.mainEditorState = EditorState.push(
                newEditorState,
                newContentState,
                'add-entity'
              );
            } else {
              const editor = stateMods.notes[contentId].editorState;
              newContentState = editor.getCurrentContent();
              data.copiedEntities[contentId].forEach(entity => {
                newContentState = newContentState.createEntity(entity.entity);
                // storing old entity key
                // entity.oldKey = entity.key;
                // storing new entity key
                entity.key  = newContentState.getLastCreatedEntityKey();
              });
              stateMods.notes[contentId].editorState = EditorState.push(
                newEditorState,
                newContentState,
                'add-entity'
              );
            }
          });
        }
      } catch(e) {
      }
    }

    if (clipboard) {
      e.preventDefault();
      newEditorState = insertFragment(newEditorState, clipboard);
    }
    if (activeId === 'main') {
      stateMods.mainEditorState = newEditorState;
      stateMods.notes = updateNotesFromEditor(stateMods.mainEditorState, stateMods.notes);
    } else {
      stateMods.notes = {
        ...this.state.notes,
        [activeId]: {
          ...this.state.notes[activeId],
          editorState: newEditorState
        }
      }
    }
    if (Object.keys(stateMods).length) {
      this.setState(stateMods);
    }
  }

  clearContextualizations = () => {
    const notesEditorStates = Object.keys(this.state.notes).reduce((result, noteId) => {
      return {
        ...result,
        [noteId]: this.state.notes[noteId].editorState
      } 
    }, {});
    let editorStates = {
      'main': this.state.mainEditorState,
      ...notesEditorStates,
    };
    editorStates = Object.keys(editorStates).map(id => editorStates[id]).filter(e => e);
    const contextualizations = updateAssetsFromEditors(editorStates, {...this.state.contextualizations});
    this.setState({
      contextualizations
    });
  }

  onEditorChange = (contentType, noteId, editorState) => {
    // list all editor states to purge unused assets
    if (contentType === 'main') {
      this.setState({
        mainEditorState: editorState,
        // notes
      });
    } else {
      this.setState({
        notes: {
            ...this.state.notes,
            [noteId]: {
              ...this.state.notes[noteId],
              editorState
            }
          }
      });
    }
  }

  onAssetRequest = (contentType, noteId, selection) => {

    this.setState({
      readOnly: {
        ...this.state.readOnly,
        [noteId || 'main']: false
      }
    });

    setTimeout(() => {
      this.setState({
        assetRequest: true,
        assetRequestSelection: selection,
        assetRequestContentId: contentType === 'main' ? 'main' : noteId,
        readOnly: {
          ...this.state.readOnly,
          [noteId || 'main']: true
        }
      });
      this.editor.focus(noteId || 'main');

    }, 1);
  }

  onAssetChoice = () => {
    this.insertContextualization();
  }

  onAssetRequestCancel = () => {
    this.setState({
      assetRequest: undefined,
      assetRequestSelection: undefined,
      readOnly: {}
    });
  }

  /*
   * MOCK-RELATED
   */

  onAssetMouseClick = (contextualizationId, contextualizationData, event) => {
    // console.info('on contextualization mouse click', contextualizationId, contextualizationData, event);
  }

  onAssetMouseOver = (contextualizationId, contextualizationData, event) => {
    // console.info('on contextualization mouse over', contextualizationId, contextualizationData, event);
  }

  onAssetMouseOut = (contextualizationId, contextualizationData, event) => {
    // console.info('on contextualization mouse out', contextualizationId, contextualizationData, event);
  }

  onNotePointerMouseOver = (noteId, event) => {
    // console.info('on note pointer mouse over', noteId, event);
  }

  onNotePointerMouseOut = (noteId, event) => {
    // console.info('on note pointer mouse out', noteId, event);
  }

  onNotePointerMouseClick = (noteId, event) => {
    // console.info('on note pointer mouse click', noteId, event);
  }

  insertContextualization = (contentId, inputEditorState) => {
    const {
      mainEditorState,
      notes,
      assetRequestSelection,
      resources,
      contextualizers,
      contextualizations
    } = this.state;

    const assetRequestContentId = contentId || this.state.assetRequestContentId;
    const id = generateId();
    const contextualization = {
      id,
      resourceId: Object.keys(resources)[0],
      contextualizerId: Object.keys(contextualizers)[0],
      type: Object.keys(contextualizers).length ? contextualizers[Object.keys(contextualizers)[0]].type : INLINE_ASSET,
    };
    let editorState = inputEditorState;
    if (!editorState){
      editorState = assetRequestContentId === 'main' ? mainEditorState : notes[assetRequestContentId].editorState;
    }
    const newEditorState = insertAssetInEditor(editorState, {id: contextualization.id}, assetRequestSelection);
    const newState = {
      assetRequest: false,
      assetRequestType: undefined,
      assetRequestSelection: undefined,
      contextualizations: {
        ...contextualizations,
        [id]: contextualization
      },
      notes: this.state.notes,
      readOnly: {
        ...this.state.readOnly,
        [assetRequestContentId]: true
      }
      // editorState: newEditorState,
    };
    if (assetRequestContentId === 'main') {
      newState.mainEditorState = newEditorState;
    } else {
      newState.notes[assetRequestContentId].editorState = newEditorState;
    }
    this.setState(newState);
    setTimeout(() => {
      this.setState({
        readOnly: {
          ...this.state.readOnly,
          [assetRequestContentId]: false
        }
      })
    });
  }

  updateResourceTitle = title => {
    this.setState({
      resources: {
        ...this.state.resources,
        [Object.keys(this.state.resources)[0]] : {
          ...this.state.resources[Object.keys(this.state.resources)[0]],
          title 
        }
      }
    })
  }

  updateContextualizerPages = pages => {
    this.setState({
      contextualizers: {
        ...this.state.contextualizers,
        [Object.keys(this.state.contextualizers)[0]] : {
          ...this.state.contextualizers[Object.keys(this.state.contextualizers)[0]],
          pages
        }
      }
    })
  }

  onDataChange = (dataProp, id, newObject) => {
    this.setState({
      [dataProp]: {
        ...this.state[dataProp],
        [id]: newObject
      }
    });
  }

  deleteContextualizations = ids => {
    const contextualizations = {...this.state.contextualizations};
    ids.forEach(id => {
      delete contextualizations[id]
    });
    return contextualizations;
  }

  deleteContextualization = (id) => {
    const contextualizations = {...this.state.contextualizations};
    let notes = this.state.notes;
    deleteAssetFromEditor(this.state.mainEditorState, id, newEditorState => {
      mapSeries(notes, (note, cb) => {
        deleteAssetFromEditor(note.editorState, id, newNoteEditorState => {
          cb(null, {
            ...note,
            id: note.id,
            editorState: newNoteEditorState
          });
        });
      }, (err, finalNotes) => {
        delete contextualizations[id];
        notes = finalNotes.reduce((final, note) => ({
          ...final,
          [note.id]: note
        }), {});
        this.setState({
          mainEditorState: newEditorState,
          notes,
          contextualizations
        });
      });
    });
  }

  /**
   * Deletes from state contextualizations not used inside the editor
   */
  refreshContextualizationsList = () => {
    const contextualizations = {...this.state.contextualizations};
    // in main
    let used = getUsedAssets(this.state.mainEditorState, contextualizations);
    // in notes
    Object.keys(this.state.notes)
    .forEach(noteId => {
      const noteEditor = this.state.notes[noteId].editorState;
      used = used.concat(getUsedAssets(noteEditor, contextualizations))
    });
    const unusedAssets = Object.keys(contextualizations).filter(id => used.indexOf(id) === -1);
    unusedAssets.forEach(id => {
      delete contextualizations[id];
    });
    this.setState({
      contextualizations
    });
  }

  addNote = () => {
    const id = generateId();
    // add related entity in main editor
    const mainEditorState = insertNoteInEditor(this.state.mainEditorState, id);
    // add note
    let notes = {
      ...this.state.notes,
      [id]: {
        id,
        editorState: EditorState.createEmpty()
      }
    };
    notes = updateNotesFromEditor(mainEditorState, notes);
    console.log('added note');
    this.setState({
      readOnly: {
        ...this.state.readOnly,
        'main': true,
        [id]: false
      }
    });
    setTimeout(() => {
        this.setState({
        notes,
        mainEditorState,
        readOnly: {
          ...this.state.readOnly,
          'main': true,
          [id]: false
        }
      });
      this.editor.focus(id);
    }, 100);
    // this.setState({
    //   notes,
    //   mainEditorState,
    //   readOnly: {
    //     ...this.state.readOnly,
    //     'main': true,
    //     [id]: false
    //   }
    // });

    // setTimeout(() => {
    //   this.editor.focus(id);
    // }, 1);
  }

  deleteNote = id => {
    // remove related entity in main editor
    deleteNoteFromEditor(this.state.mainEditorState, id, mainEditorState => {
      // remove note
      const notes = this.state.notes;
      delete notes[id];
      this.setState({
        mainEditorState,
        notes,
        readOnly: {
          ...this.state.readOnly,
          main: false
        }
      });
    });
    this.editor.focus('main');
  }

  addTextAtCurrentSelection = (text) => {
    const contentId = this.state.assetRequestContentId;
    const editorState = contentId === 'main' ? this.state.mainEditorState : this.state.notes[contentId].editorState;

    const newContentState = Modifier.insertText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      text,
    );
    if (contentId === 'main') {
      this.setState({
        mainEditorState: EditorState.push(
          this.state.mainEditorState,
          newContentState,
          'insert-text'
        )
      });
    } else {
      this.setState({
        notes: {
          ...this.state.notes,
          [contentId]: {
            ...this.state.notes[contentId],
            editorState: EditorState.push(
              this.state.notes[contentId].editorState,
              newContentState,
              'insert-text'
            )
          }
        }
      });
    }
  }

  render = () => {
    const {
      onEditorChange,
      onAssetRequest,

      onAssetClick,
      onAssetMouseOver,
      onAssetMouseOut,
      onAssetRequestCancel,
      onAssetChoice,

      onNotePointerMouseOver,
      onNotePointerMouseOut,
      onNotePointerMouseClick,

      insertContextualization,
      updateContextualizerPages,
      updateResourceTitle,
      onDataChange,
      deleteContextualization,
      refreshContextualizationsList,
      addNote,
      deleteNote,
      addTextAtCurrentSelection,
      state
    } = this;

    const {
      mainEditorState,
      clipboard,
      notes,
      inlineAssetComponents,
      blockAssetComponents,
      contextualizations,
      contextualizers,
      assetRequest,
      assetRequestContentId,
      resources,
      readOnly,
    } = state;

    const onResourceTitleChange = e => {
      updateResourceTitle(e.target.value);
    }

    const onContextualizerPagesChange = e => {
      updateContextualizerPages(e.target.value);
    }
    const refreshUpstreamContextualizationsList = e => {
      refreshContextualizationsList();
    }

    const startDrag = (e) => {
       e.dataTransfer.dropEffect = 'copy';
       e.dataTransfer.setData('text', 'TEST');
       this.setState({
        readOnly: {}
       });
    };

    const onDrop = (contentId, payload, selection) => {
      const editorState = contentId === 'main' ? this.state.mainEditorState : this.state.notes[contentId].editorState;
      this.insertContextualization(contentId, EditorState.acceptSelection(editorState, selection));
    };

    const onClick = (event, contentId = 'main') => {
      // console.log('on click', this.state.readOnly[contentId]);
      if (this.state.readOnly[contentId]) {
        // console.log('set readonly to false for', contentId);
        this.setState({
          readOnly: {
            ...this.state.readOnly,
            [contentId]: false
          }
        });
        setTimeout(() => {
          this.editor.focus(contentId);
        }, 1);
      }
    }

    const onBlur = (event, contentId = 'main') => {
      this.setState({
        readOnly: {
          ...this.state.readOnly,
          [contentId]: true
        }
      });
    };

    // console.log(Object.keys(contextualizers));

    const assets = Object.keys(contextualizations)
    .reduce((ass, id) => {
      const contextualization = contextualizations[id];
      const contextualizer = contextualizers[contextualization.contextualizerId]
      return {
        ...ass,
        [id]: {
          ...contextualization,
          resource: resources[contextualization.resourceId],
          contextualizer: contextualizer,
          type: contextualizer ? contextualizer.type : INLINE_ASSET
        }
      }
    }, {});

    const assetChoiceProps = {
      options: ['asset 1', 'asset 2', 'asset 3'],
      addPlainText: (text) => {
        addTextAtCurrentSelection(text);
        onAssetRequestCancel();
      }
    };
    let assetRequestPosition;
    if (assetRequest) {
      if (assetRequestContentId === 'main') {
        assetRequestPosition = mainEditorState.getSelection();
      } else if(assetRequestContentId && notes[assetRequestContentId]) {
        assetRequestPosition = notes[assetRequestContentId].editorState.getSelection();
      }
    }

    const bindRef = editor => {
      this.editor = editor;
    }

    const onScroll = e => {
      if (this.editor && !this.state.readOnly['main']) {
        this.editor.mainEditor.updateSelection();
      }
      if (this.editor.notes) {
        Object.keys(this.editor.notes)
        .filter(noteId => !this.state.readOnly[noteId])
        .map(noteId => this.editor.notes[noteId].editor.updateSelection());
      }
   }

    return (
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'fixed',
            padding: '1rem',
            left: 0,
            top: 0,
            width: '10%',
            height: '100%',
            zIndex: 3,
            overflow: 'auto'
          }}
        >
          {assetRequest && <div>
          <button onClick={() => insertContextualization()}>Insert contextualization</button>
            </div>}
          <div
            draggable={true} 
            onDragStart={startDrag}
            style={{
              border: '1px solid black',
              background: 'white'
            }}
          >
            Draggable resource
          </div>
          {
            Object.keys(contextualizations)
            .map(key => {
              const onClick = () => deleteContextualization(key);
              return (
                <div key={key}>
                  <button
                    onClick={onClick}
                  >
                    Delete contextualization {key}
                  </button>
                </div>
              );
            })
          }
          <div>
          {Object.keys(contextualizations).length > 0 && <div>
            <button onClick={refreshUpstreamContextualizationsList}>Refresh upstream contextualizations list</button>
          </div>}
            Change the contextualizer page :
            <input
              value={Object.keys(contextualizers).length ? contextualizers[Object.keys(contextualizers)[0]].pages: ''}
              onChange={onContextualizerPagesChange}
            >
            </input>
          </div>
          <div>
            Change the contextualizer title :
            <input
              value={Object.keys(resources).length ? resources[Object.keys(resources)[0]].title: 0}
              onChange={onResourceTitleChange}
            >
            </input>
          </div>
        </div>
          
        <div
          onScroll={onScroll}
          style={{
            position: 'relative',
            top: '0',
            left: '20%',
            height: '100%',
            width: '80%',
            overflow: 'auto'
          }}>
          <Editor 
            mainEditorState={mainEditorState}
            notes={notes}
            assets={assets}

            clipboard={clipboard}

            ref={bindRef}

            readOnly={readOnly}

            contextualizations={contextualizations}
            contextualizers={contextualizers}
            resources={resources}
                        
            onEditorChange={onEditorChange}

            onDrop={onDrop}
            onClick={onClick}
            onBlur={onBlur}

            onAssetClick={onAssetClick}
            onAssetMouseOver={onAssetMouseOver}
            onAssetMouseOut={onAssetMouseOut}
            onAssetRequest={onAssetRequest}
            onAssetChange={onDataChange}
            onAssetRequestCancel={onAssetRequestCancel}
            onAssetChoice={onAssetChoice}

            onNoteAdd={addNote}
            onNoteDelete={deleteNote}

            onNotePointerMouseOver={onNotePointerMouseOver}
            onNotePointerMouseOut={onNotePointerMouseOut}
            onNotePointerMouseClick={onNotePointerMouseClick}

            assetRequestPosition={assetRequestPosition}
            assetChoiceProps={assetChoiceProps}
            
            inlineAssetComponents={inlineAssetComponents}
            blockAssetComponents={blockAssetComponents}
            AssetChoiceComponent={ExampleBlockAssetChoice}
            
            allowNotesInsertion={true}
          />
        </div>
      </div>
    );
  }
}