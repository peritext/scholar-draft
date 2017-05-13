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

      editorClass = 'scholar-draft-SectionEditor',
      
      onEditorChange,
      onNoteAdd,

      onAssetChange,
      onAssetRequest,
      onAssetRequestCancel,
      onAssetChoice,
      onAssetClick,
      onAssetMouseOver,
      onAssetMouseOut,

      onNotePointerMouseOver,
      onNotePointerMouseOut,
      onNotePointerMouseClick,
      onDrop,
      onClick,
      onBlur,

      assetRequestPosition,
      assetChoiceProps,
      
      inlineAssetComponents,
      blockAssetComponents,
      AssetChoiceComponent,

      editorStyles,
      readOnly,
    } = this.props;

    const renderNoteEditor = (noteId, order) => {
      const onThisNoteEditorChange = editor => onEditorChange('note', noteId, editor);
      const onNoteAssetRequest = (selection) => {
        onAssetRequest('note', noteId, selection);
      };
      const onClickDelete = () => {
        if (typeof this.props.onNoteDelete === 'function') {
          this.props.onNoteDelete(noteId);
        }
      };
      const onNoteDrop = (payload, selection) => {
        if (typeof this.props.onDrop === 'function') {
          onDrop(noteId, payload, selection);
        }
      };
      const note = notes[noteId];

      const onNoteEditorClick = (e) => {
        if (typeof onClick === 'function') {
          onClick(e, noteId);
        }
      };
      return (
        <NoteContainer
          key={noteId}
          note={note}
          assets={assets}

          assetRequestPosition={assetRequestPosition}
          assetChoiceProps={assetChoiceProps}

          readOnly={readOnly}

          onClick={onNoteEditorClick}
          onBlur={onBlur}

          onEditorChange={onThisNoteEditorChange}

          onAssetRequest={onNoteAssetRequest}
          onAssetChange={onAssetChange}
          onAssetRequestCancel={onAssetRequestCancel}
          onAssetChoice={onAssetChoice}

          onDrop={onNoteDrop}
          onClickDelete={onClickDelete}

          onAssetClick={onAssetClick}
          onAssetMouseOver={onAssetMouseOver}
          onAssetMouseOut={onAssetMouseOut}

          inlineAssetComponents={inlineAssetComponents}
          blockAssetComponents={blockAssetComponents}
          AssetChoiceComponent={AssetChoiceComponent}

          editorStyle={editorStyles && editorStyles.noteEditor}
        />
      );
    };

    const onMainEditorChange = editor => onEditorChange('main', undefined, editor);
    const onMainAssetRequest = (selection) => {
      onAssetRequest('main', undefined, selection);
    };

    const onMainEditorDrop = (payload, selection) => {
      if (typeof onDrop === 'function') {
        onDrop('main', payload, selection);
      }
    };

    const onMainEditorClick = (e) => {
      if (typeof onClick === 'function') {
        onClick(e, 'main');
      }
    };

    return (
      <div className={editorClass}>
        <section className="main-container-editor">
          <ContentEditor 
            editorState={mainEditorState}
            notes={notes}
            assets={assets}

            assetRequestPosition={assetRequestPosition}
            assetChoiceProps={assetChoiceProps}

            readOnly={readOnly}

            onClick={onMainEditorClick}
            onBlur={onBlur}
            
            onEditorChange={onMainEditorChange}
            onDrop={onMainEditorDrop}
            onAssetRequest={onMainAssetRequest}
            onAssetRequestCancel={onAssetRequestCancel}
            onAssetChoice={onAssetChoice}

            onNoteAdd={onNoteAdd}
            onAssetChange={onAssetChange}

            onAssetClick={onAssetClick}
            onAssetMouseOver={onAssetMouseOver}
            onAssetMouseOut={onAssetMouseOut}

            onNotePointerMouseOver={onNotePointerMouseOver}
            onNotePointerMouseOut={onNotePointerMouseOut}
            onNotePointerMouseClick={onNotePointerMouseClick}
            
            inlineAssetComponents={inlineAssetComponents}
            blockAssetComponents={blockAssetComponents}
            AssetChoiceComponent={AssetChoiceComponent}

            allowNotesInsertion
            editorStyle={editorStyles && editorStyles.mainEditor}
          />
        </section>
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
      </div>
    );
  }
}
