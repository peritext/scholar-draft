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
  BLOCK_CONTEXTUALIZATION
} = constants;

const {
  getContextualizationsToDeleteFromEditor,
  insertContextualizationInEditor,
  deleteContextualizationFromEditor,
  getUnusedContextualizations 
} = utils;

import BlockContainer from './ExampleContextualizationBlock';
import InlinePointer from './ExampleInlinePointer';

const inlineContextualizationComponents = {
  citation: InlinePointer
};

const blockContextualizationComponents = {
  citation: BlockContainer
};

export default class ContentEditorContainer extends Component {
  
  state = {
    // mock related
    contextualizationRequest: false,
    contextualizationRequestType: undefined,
    // all these should be handled by upstream logic in real applications
    editorState: undefined,
    inlineContextualizationComponents,
    blockContextualizationComponents,
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

  onContextualizationRequest = (contextualizationRequestType, selection) => {
    this.setState({
      contextualizationRequestType,
      contextualizationRequest: true,
      contextualizationRequestSelection: selection
    });
  }

  /*
   * MOCK-RELATED
   */

  onContextualizationMouseClick = (contextualizationId, contextualizationData, event) => {
    console.info('on contextualization mouse click', contextualizationId, contextualizationData, event);
  }

  onContextualizationMouseOver = (contextualizationId, contextualizationData, event) => {
    console.info('on contextualization mouse over', contextualizationId, contextualizationData, event);
  }

  onContextualizationMouseOut = (contextualizationId, contextualizationData, event) => {
    console.info('on contextualization mouse out', contextualizationId, contextualizationData, event);
  }

  insertContextualization = (inputEditorState) => {
    const {
      // editorState,
      contextualizationRequestType,
      contextualizationRequestSelection,
      resources,
      contextualizers,
      contextualizations
    } = this.state;

    const editorState = inputEditorState || this.state.editorState;

    const id = generateId();
    const contextualization = {
      id,
      resourceId: Object.keys(resources)[0],
      contextualizerId: Object.keys(contextualizers)[0],
      type: contextualizers[Object.keys(contextualizers)[0]].type,
    }
    const newEditorState = insertContextualizationInEditor(editorState, contextualization);
    this.setState({
      lastInsertionType: this.state.contextualizationRequestType,
      contextualizationRequest: false,
      contextualizationRequestType: undefined,
      contextualizationRequestSelection: undefined,
      contextualizations: {
        ...contextualizations,
        [id]: contextualization
      },
      editorState: newEditorState,
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
    deleteContextualizationFromEditor(this.state.editorState, ['inlineContextualization', 'blockContextualization'], id, newEditorState => {
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
    const unused = getUnusedContextualizations(this.state.editorState, this.state.contextualizations);
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
      onContextualizationRequest,
      onContextualizationClick,
      onContextualizationMouseOver,
      onContextualizationMouseOut,
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
      inlineContextualizationComponents,
      blockContextualizationComponents,
      contextualizations,
      contextualizers,
      contextualizationRequest,
      resources,
      lastInsertionType
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
   }
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
          <div
            draggable={true} 
            onDragStart={startDrag}
            style={{
              border: '1px solid black',
              padding: '1em'
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
          {contextualizationRequest && <div>
          <button onClick={() => insertContextualization()}>Insert contextualization</button>
            </div>}
        </div>
          
        <div
          style={{
            position: 'fixed',
            top: '10%',
            left: '10%',
            height: '80%',
            width: '90%',
            overflow: 'auto'
          }}>
          <ContentEditor 
            ref={bindEditorRef}
            editorState={editorState}
            contextualizations={contextualizations}
            contextualizers={contextualizers}
            resources={resources}
            lastInsertionType={lastInsertionType} 
            
            onEditorChange={onEditorChange}
            onContextualizationRequest={onContextualizationRequest}
            onDataChange={onDataChange}

            onContextualizationClick={onContextualizationClick}
            onContextualizationMouseOver={onContextualizationMouseOver}
            onContextualizationMouseOut={onContextualizationMouseOut}

            onDrop={onDrop}
            
            inlineContextualizationComponents={inlineContextualizationComponents}
            blockContextualizationComponents={blockContextualizationComponents}
            allowNotesInsertion={false}
            editorStyle={{
              position: 'relative',
              left: 0,
              top: 0,
              width: '50%',
              height: '100%',
              padding:'3em 25% 3em 25%',
            }}
          />
        </div>
      </div>
    );
  }
}