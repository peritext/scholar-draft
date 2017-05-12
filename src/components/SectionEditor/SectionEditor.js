import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ContentEditor from '../ContentEditor/ContentEditor';
import NoteContainer from '../NoteContainer/NoteContainer';

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
      assets,
      lastInsertionType,
      
      onEditorChange,
      onNoteAdd,
      onDataChange,
      onAssetRequest,
      onAssetClick,
      onAssetMouseOver,
      onAssetMouseOut,
      onNotePointerMouseOver,
      onNotePointerMouseOut,
      onNotePointerMouseClick,
      onDrop,
      
      inlineAssetComponents,
      blockAssetComponents,
      editorStyles,
    } = this.props;

    const renderNoteEditor = (noteId, order) => {
      const onThisNoteEditorChange = editor => onEditorChange('note', noteId, editor);
      const onNoteAssetRequest = (assetRequestType, selection) => {
        onAssetRequest('note', noteId, assetRequestType, selection);
      };
      const onClickDelete = () => {
        this.props.onNoteDelete(noteId);
      };
      const onNoteDrop = (payload, selection) => {
        onDrop(noteId, payload, selection);
      };
      const note = notes[noteId];
      return (
        <NoteContainer
          key={noteId}
          note={note}
          assets={assets}
          lastInsertionType={lastInsertionType}

          onEditorChange={onThisNoteEditorChange}
          onAssetRequest={onNoteAssetRequest}
          onDataChange={onDataChange}
          onDrop={onNoteDrop}
          onClickDelete={onClickDelete}

          onAssetClick={onAssetClick}
          onAssetMouseOver={onAssetMouseOver}
          onAssetMouseOut={onAssetMouseOut}
          inlineAssetComponents={inlineAssetComponents}
          blockAssetComponents={blockAssetComponents}
          editorStyle={editorStyles.noteEditor}
        />
      );
    };

    const onMainEditorChange = editor => onEditorChange('main', undefined, editor);
    const onMainAssetRequest = (assetRequestType, selection) => {
      onAssetRequest('main', undefined, assetRequestType, selection);
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
              } return -1;
            })
            .map(renderNoteEditor)
          }
        </aside>
        <section className="main-container-editor">
          <ContentEditor 
            editorState={mainEditorState}
            notes={notes}
            assets={assets}
            lastInsertionType={lastInsertionType} 
            
            onEditorChange={onMainEditorChange}
            onDrop={onMainEditorDrop}
            onAssetRequest={onMainAssetRequest}
            onNoteAdd={onNoteAdd}
            onDataChange={onDataChange}

            onAssetClick={onAssetClick}
            onAssetMouseOver={onAssetMouseOver}
            onAssetMouseOut={onAssetMouseOut}

            onNotePointerMouseOver={onNotePointerMouseOver}
            onNotePointerMouseOut={onNotePointerMouseOut}
            onNotePointerMouseClick={onNotePointerMouseClick}
            
            inlineAssetComponents={inlineAssetComponents}
            blockAssetComponents={blockAssetComponents}
            allowNotesInsertion
            editorStyle={editorStyles.mainEditor}
          />
        </section>
      </div>
    );
  }
}
