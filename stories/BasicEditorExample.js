import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { OrderedMap, Map } from 'immutable';

import {
  EditorState,
  ContentState,
  ContentBlock,
  Modifier,
  Entity,
  AtomicBlockUtils
} from 'draft-js';

import {
  getSelectedBlocksList
} from 'draftjs-utils';

import {
  v4 as generateId
} from 'uuid';

import {
  BasicEditor,
  constants,
  utils,
} from '../src';

const {
  BLOCK_ASSET
} = constants;

const {
  getAssetsToDeleteFromEditor,
  insertAssetInEditor,
  deleteAssetFromEditor,
  getUnusedAssets,
  insertFragment,
  BlockMapBuilder,
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

export default class BasicEditorExample extends Component {
  
  state = {
    // mock related
    contextualizationRequest: false,
    contextualizationRequestType: undefined,
    // all these should be handled by upstream logic in real applications
    editorState: EditorState.createEmpty(),
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
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      editorState,
      contextualizations
    } = this.state;
    if (!editorState) {
      return;
    }
  }

  constructor(props) {
    super(props);
  }

  onEditorChange = (editorState) => {
    this.setState({
        editorState
    });
  }

  onAssetRequest = (selection) => {
    console.log('on asset request', selection);
    this.setState({
      contextualizationRequest: true,
      contextualizationRequestSelection: selection,
      readOnly: true
    });
  }

  onAssetRequestCancel = () => {
    this.setState({
      contextualizationRequest: undefined,
      contextualizationRequestSelection: undefined,
      readOnly: false
    });
    setTimeout(() => {
      this.editor.focus();
    }, 1);
  }

  onAssetChoice = (e) => {
    console.log('on asset choice', e);
    this.insertContextualization();
  }

  addTextAtCurrentSelection = text => {
    const newContentState = Modifier.insertText(
      this.state.editorState.getCurrentContent(),
      this.state.editorState.getSelection(),
      text,
    );
    this.setState({
      editorState: EditorState.push(
        this.state.editorState,
        newContentState,
        'insert-text'
      )
    })
  }

  componentDidMount() {
    document.addEventListener('copy', this.onCopy);
    document.addEventListener('cut', this.onCopy);
    document.addEventListener('paste', this.onPaste);
  }

  componentWillUnmount() {
    document.removeEventListener('copy', this.onCopy);
    document.removeEventListener('cut', this.onCopy);
    document.removeEventListener('paste', this.onPaste);
  }

  // loading data into the clipboard
  onCopy = e => {
    let clipboard = null;
    const currentContent = this.state.editorState.getCurrentContent();
    const selectedBlocksList = getSelectedBlocksList(this.state.editorState);
    // must do --> we store entities data as js object to reinject them at parsing
    const copiedEntities = [];
    // for mocks purposes
    const copiedContextualizers = [];
    const copiedContextualizations = [];

    clipboard = this.editor.editor.getClipboard();

    selectedBlocksList.forEach(contentBlock => {
      const block = contentBlock.toJS();
      const entitiesIds = block.characterList.filter(char => char.entity).map(char => char.entity);
      entitiesIds.forEach(entityKey => {
        const entity = currentContent.getEntity(entityKey);
        copiedEntities.push({
          key: entityKey,
          entity: entity.toJS()
        });
        // mock
        const assetId = entity.data.asset.id;
        const contextualization = this.state.contextualizations[assetId];
        copiedContextualizations.push({...contextualization});
        copiedContextualizers.push({
          ...this.state.contextualizers[contextualization.contextualizerId],
          id: contextualization.contextualizerId
        });
      });
      return true;
    });
    const copiedData = {
      copiedEntities,
      copiedContextualizations,
      copiedContextualizers
    };
    e.clipboardData.setData('data', JSON.stringify(copiedData));
    e.clipboardData.setData('text/plain', '$$$internal-clipboard');
    e.preventDefault();
    this.setState({
      clipboard,
      copiedData
    });
  }

  onPaste = e => {
    if (e.clipboardData.getData('text/plain') !== '$$$internal-clipboard') {
      this.setState({
        clipboard: null,
        copiedData: null
      });
      return;
    }
    const copiedData = this.state.copiedData; // e.clipboardData.getData('data');
    const currentContent = this.state.editorState.getCurrentContent();
    let data;
    const stateMods = {
    };
    if (copiedData) {
      try{
        data = copiedData; // JSON.parse(copiedData);
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
        let newContentState = currentContent;
        if (data.copiedEntities) {
          data.copiedEntities.forEach(entity => {
            newContentState = newContentState.createEntity(entity.entity);
            // storing old entity key
            // entity.oldKey = entity.key;
            // storing new entity key
            entity.key  = newContentState.getLastCreatedEntityKey();
          });
        }
        stateMods.editorState = EditorState.push(
          this.state.editorState,
          newContentState,
          'add-entity'
        );
      } catch(e) {
      }
    }
    const clipboard = this.state.clipboard;
    if (clipboard) {
      e.preventDefault();
      const editorState = stateMods.editorState || this.state.editorState;
      stateMods.editorState = insertFragment(editorState, clipboard);
    }
    if (Object.keys(stateMods).length) {
      this.setState(stateMods);
    }
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

  insertContextualization = (inputEditorState) => {
    const {
      // editorState,
      contextualizationRequestSelection,
      resources,
      contextualizers,
      contextualizations
    } = this.state;

    const editorState = inputEditorState || this.state.editorState;
    const selection = contextualizationRequestSelection || editorState.getSelection();
    const id = generateId();
    const contextualization = {
      id,
      resourceId: Object.keys(resources)[0],
      contextualizerId: Object.keys(contextualizers)[0],
    }
    const newEditorState = insertAssetInEditor(editorState, {id: contextualization.id});
    this.setState({
      contextualizationRequest: false,
      contextualizationRequestSelection: undefined,
      contextualizations: {
        ...contextualizations,
        [id]: contextualization
      },
      editorState: newEditorState,
      readOnly: true
    });
    setTimeout(() => {
      this.setState({
        readOnly: false
      });
      this.editor.focus();
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

  deleteContextualization = id => {
    deleteAssetFromEditor(this.state.editorState, id, newEditorState => {
      const contextualizations = {...this.state.contextualizations};
      delete contextualizations[id];
      this.setState({
        editorState: newEditorState,
        contextualizations
      });
    });
  }

  /**
   * Deletes from state contextualizations not used inside the editor
   */
  refreshContextualizationsList = () => {
    const unused = getUnusedAssets(this.state.editorState, this.state.contextualizations);
    const contextualizations = {...this.state.contextualizations};
    unused.forEach(id => {
      delete contextualizations[id];
    });
    this.setState({
      contextualizations
    });
  }

  render = () => {
    
    const {
      onEditorChange,
      onAssetRequest,
      onAssetRequestCancel,
      onAssetClick,
      onAssetChoice,
      onAssetMouseOver,
      onAssetMouseOut,
      addTextAtCurrentSelection,
      insertContextualization,
      updateContextualizerPages,
      updateResourceTitle,
      onDataChange,
      deleteContextualization,
      refreshContextualizationsList,
      state
    } = this;
    const {
      editorState,
      inlineAssetComponents,
      blockAssetComponents,
      contextualizations,
      contextualizers,
      resources,
      readOnly,
      contextualizationRequest,
      clipboard,
    } = state;

    const bindEditorRef = (editor) => {
      this.editor = editor;
    }

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
        readOnly: false
       });
    };

   const onDrop = (payload, selection) => {
    this.insertContextualization(EditorState.acceptSelection(this.state.editorState, selection));
   };

   const onBlur = (e, editorState) => {
    this.setState({
      readOnly: true
    });
   }

   const onClick = (e) => {
    if (this.state.readOnly) {
      this.setState({
        readOnly: false
      });
      this.editor.focus();
    }
   };

   const onScroll = e => {
    if (this.editor) {
      this.editor.updateSelection();
    }
   }

   const assets = Object.keys(contextualizations)
    .reduce((ass, id) => {
      const contextualization = contextualizations[id];
      return {
        ...ass,
        [id]: {
          ...contextualization,
          resource: resources[contextualization.resourceId],
          contextualizer: contextualizers[contextualization.contextualizerId],
          type: contextualizers[contextualization.contextualizerId].type
        }
      }
    }, {});

    const assetChoiceProps = {
      options: ['asset 1', 'asset 2', 'asset 3'],
      addPlainText: text => {
        addTextAtCurrentSelection(text);
        onAssetRequestCancel();
      }
    };
    const assetRequestPosition = contextualizationRequest && editorState.getSelection();

    return (
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        }}
        onWheel={onScroll}
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
          {contextualizationRequest && <div>
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
              value={Object.keys(resources).length ? resources[Object.keys(resources)[0]].title : ''}
              onChange={onResourceTitleChange}
            >
            </input>
          </div>
        </div>
          
        <div
          style={{
            position: 'relative',
            top: '0',
            left: '20%',
            height: '100%',
            width: '80%',
            paddingBottom: '2em',
            paddingTop: '2em'
          }}>
          <BasicEditor 
            ref={bindEditorRef}
            editorState={editorState}
            readOnly={readOnly}

            assets={assets}
            assetRequestPosition={assetRequestPosition}
            assetChoiceProps={assetChoiceProps}

            onEditorChange={onEditorChange}
            onAssetRequest={onAssetRequest}
            onAssetChange={onDataChange}
            onAssetRequestCancel={onAssetRequestCancel}
            onAssetChoice={onAssetChoice}

            onAssetClick={onAssetClick}
            onAssetMouseOver={onAssetMouseOver}
            onAssetMouseOut={onAssetMouseOut}


            onDrop={onDrop}
            onClick={onClick}
            onBlur={onBlur}
            clipboard={clipboard}
            
            inlineAssetComponents={inlineAssetComponents}
            blockAssetComponents={blockAssetComponents}
            AssetChoiceComponent={ExampleBlockAssetChoice}
            allowNotesInsertion={false}
          />
        </div>
      </div>
    );
  }
}