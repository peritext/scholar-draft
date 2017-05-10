import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ContentEditor from './ContentEditor';
import NoteContainer from './components/NoteContainer/NoteContainer';

import './SectionEditor.scss';

export default class SectionEditor extends Component {
  static PropTypes = {
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
  }

  render() {
    const {
      mainEditorState,
      notes,
      contextualizations,
      contextualizers,
      resources,
      lastInsertionType,
      
      onEditorChange,
      onNoteAdd,
      onDataChange,
      onContextualizationRequest,
      onContextualizationClick,
      onContextualizationMouseOver,
      onContextualizationMouseOut,
      onNotePointerMouseOver,
      onNotePointerMouseOut,
      onNotePointerMouseClick,
      onDrop,
      
      inlineContextualizationComponents,
      blockContextualizationComponents,
      editorStyles,
    } = this.props;

    const renderNoteEditor = (noteId, order) => {
      const onThisNoteEditorChange = editor => onEditorChange('note', noteId, editor);
      const onNoteContextualizationRequest = (contextualizationRequestType, selection) => {
        onContextualizationRequest('note', noteId, contextualizationRequestType, selection);
      };
      const onClickDelete = () => {
        this.props.onNoteDelete(noteId);
      }
      const onNoteDrop = (payload, selection) => {
        onDrop(noteId, payload, selection);
      };
      const note = notes[noteId];
      return (
        <NoteContainer
          key={noteId}
          note={note}
          contextualizations={contextualizations}
          contextualizers={contextualizers}
          resources={resources}
          lastInsertionType={lastInsertionType}

          onEditorChange={onThisNoteEditorChange}
          onContextualizationRequest={onNoteContextualizationRequest}
          onDataChange={onDataChange}
          onDrop={onNoteDrop}
          onClickDelete={onClickDelete}

          onContextualizationClick={onContextualizationClick}
          onContextualizationMouseOver={onContextualizationMouseOver}
          onContextualizationMouseOut={onContextualizationMouseOut}
          inlineContextualizationComponents={inlineContextualizationComponents}
          blockContextualizationComponents={blockContextualizationComponents}
          editorStyle={editorStyles.noteEditor}
        />
      );
    };

    const onMainEditorChange = editor => onEditorChange('main', undefined, editor);
    const onMainContextualizationRequest = (contextualizationRequestType, selection) => {
      onContextualizationRequest('main', undefined, contextualizationRequestType, selection);
    };

    const onMainEditorDrop = (payload, selection) => {
      onDrop('main', payload, selection);
    };
    return (
      <div className="SectionEditor">
        <aside className="notes-container">
          {
            Object.keys(notes || {})
            .sort((a, b) => {
              if (notes[a].order > notes[b].order) {
                return 1;
              } else return -1;
            })
            .map(renderNoteEditor)
          }
        </aside>
        <section className="main-container-editor">
          <ContentEditor 
            editorState={mainEditorState}
            notes={notes}
            contextualizations={contextualizations}
            contextualizers={contextualizers}
            resources={resources}
            lastInsertionType={lastInsertionType} 
            
            onEditorChange={onMainEditorChange}
            onDrop={onMainEditorDrop}
            onContextualizationRequest={onMainContextualizationRequest}
            onNoteAdd={onNoteAdd}
            onDataChange={onDataChange}

            onContextualizationClick={onContextualizationClick}
            onContextualizationMouseOver={onContextualizationMouseOver}
            onContextualizationMouseOut={onContextualizationMouseOut}

            onNotePointerMouseOver={onNotePointerMouseOver}
            onNotePointerMouseOut={onNotePointerMouseOut}
            onNotePointerMouseClick={onNotePointerMouseClick}
            
            inlineContextualizationComponents={inlineContextualizationComponents}
            blockContextualizationComponents={blockContextualizationComponents}
            allowNotesInsertion={true}
            editorStyle={editorStyles.mainEditor}
          />
        </section>
      </div>
    );
  }
}