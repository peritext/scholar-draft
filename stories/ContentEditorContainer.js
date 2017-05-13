import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  EditorState,
  Modifier,
  Entity,
  AtomicBlockUtils
} from 'draft-js';

import {
  v4 as generateId
} from 'uuid';

import {
  ContentEditor,
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
  getUnusedAssets 
} = utils;

import ExampleBlockCitation from './ExampleBlockCitation';
import ExampleInlineCitation from './ExampleInlineCitation';

const inlineAssetComponents = {
  citation: ExampleInlineCitation
};

const blockAssetComponents = {
  citation: ExampleBlockCitation
};

export default class ContentEditorContainer extends Component {
  
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
    this.setState({
      contextualizationRequest: true,
      contextualizationRequestSelection: selection
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
      onAssetClick,
      onAssetMouseOver,
      onAssetMouseOut,
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
    return (
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
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
              value={contextualizers[Object.keys(contextualizers)[0]].pages}
              onChange={onContextualizerPagesChange}
            >
            </input>
          </div>
          <div>
            Change the contextualizer title :
            <input
              value={resources[Object.keys(resources)[0]].title}
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
            width: '80%'
          }}>
          <ContentEditor 
            ref={bindEditorRef}
            editorState={editorState}
            assets={assets}
            readOnly={readOnly}

            onEditorChange={onEditorChange}
            onAssetRequest={onAssetRequest}
            onAssetChange={onDataChange}

            onAssetClick={onAssetClick}
            onAssetMouseOver={onAssetMouseOver}
            onAssetMouseOut={onAssetMouseOut}

            onDrop={onDrop}
            onClick={onClick}
            onBlur={onBlur}
            
            inlineAssetComponents={inlineAssetComponents}
            blockAssetComponents={blockAssetComponents}
            allowNotesInsertion={false}
          />
        </div>
      </div>
    );
  }
}