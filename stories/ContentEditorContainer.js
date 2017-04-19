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

import ContentEditor from '../src/ContentEditor';
import {
  getContextualizationsToDeleteFromEditor,
  insertContextualizationInEditor,
  deleteContextualizationFromEditor
} from '../src/utils';

const BlockContainer = (props) => {
  const {
    children,
    blockProps: {
      data,
      resource,
      resourceId,
      contextualizerId,
      contextualizer,
      contextualization,
      onContextualizationMouseOver,
      onContextualizationMouseOut,
      onDataChange,
      onInputFocus,
      onInputBlur
    },
  } = props;


  const onResourceTitleChange = e => {
    const title = e.target.value;
    onDataChange('resources', resourceId, {
      ...resource,
      title
    })
  };

  const onContextualizerPageChange = e => {
    const pages = e.target.value;
    onDataChange('contextualizers', contextualizerId, {
      ...contextualizer,
      pages
    })
  }

  const onMouseOver = e => {
    if (typeof onContextualizationMouseOver === 'function') {
      onContextualizationMouseOver(data.contextualization.id, data.contextualization, e);
    }
  }

  const onMouseOut = e => {
    if (typeof onContextualizationMouseOut === 'function') {
      onContextualizationMouseOut(data.contextualization.id, data.contextualization, e);
    }
  }


  const exampleRendering = type => {
    switch(type) {
      case 'citation':
      default:
        return (
          <span><i>
            <input
              value={resource.title}
              onChange={onResourceTitleChange}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
            />
          </i>. <i>pp. <input
              value={contextualizer.pages}
              onChange={onContextualizerPageChange}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
            /></i>. 
          {
            resource.authors.map(author => author.firstName + ' ' + author.lastName).join(', ')
          }</span>
        );
    }
  }
  return (
    <div 
      className="citation-block"
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <p>
        {exampleRendering(contextualizer.type)}
      </p>
      <p>{children}</p>
    </div>
  );
};

const inlineContextualizationComponents = {

};

const blockContextualizationComponents = {
  blockContextualization: BlockContainer
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
    // setTimeout(() => {
    // let toDelete = getContextualizationsToDeleteFromEditor(editorState, ['inlineContextualization', 'blockContextualization'], contextualizations);
    // let newContextualizations = contextualizations;
    // if (toDelete.length) {
      // console.log('to delete', toDelete);
      // newContextualizations = this.deleteContextualizations(toDelete);
      // this.setState({
      //   contextualizations: newContextualizations
      // })
    // }
    // });
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

  insertContextualization = () => {
    const {
      editorState,
      contextualizationRequestType,
      contextualizationRequestSelection,
      resources,
      contextualizers,
      contextualizations
    } = this.state;

    const id = generateId();
    const contextualization = {
      id,
      resourceId: Object.keys(resources)[0],
      contextualizerId: Object.keys(contextualizers)[0],
    }
    const newEditorState = insertContextualizationInEditor(editorState, contextualizationRequestType, contextualization, contextualizationRequestSelection);
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

    const onResourceTitleChange = e => {
      updateResourceTitle(e.target.value);
    }

    const onContextualizerPagesChange = e => {
      updateContextualizerPages(e.target.value);
    }
    return (
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          padding: '10rem'
        }}
      >
        <div
          style={{
            position: 'fixed',
            left: '1rem',
            top: '1rem'
          }}
        >
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
          
        {contextualizationRequest && <div style={{
          position: 'fixed',
          bottom: '1rem',
          left: '1rem'
        }}>
          <button onClick={insertContextualization}>Insert contextualization</button>
        </div>}
        <ContentEditor 
          editorState={editorState}
          onEditorChange={onEditorChange}
          onContextualizationRequest={onContextualizationRequest}

          contextualizations={contextualizations}
          contextualizers={contextualizers}
          resources={resources}

          inlineContextualizationComponents={inlineContextualizationComponents}
          blockContextualizationComponents={blockContextualizationComponents}

          allowNotesInsertion={true}
          onNoteAdd={() => console.log('on note add')}
          onContextualizationRequest={onContextualizationRequest}

          onDataChange={onDataChange}
          lastInsertionType={lastInsertionType} 
          
          onContextualizationClick={onContextualizationClick}
          onContextualizationMouseOver={onContextualizationMouseOver}
          onContextualizationMouseOut={onContextualizationMouseOut}
          editorStyles={{
            position: 'relative',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    );
  }
}