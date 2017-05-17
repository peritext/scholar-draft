import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BasicEditor from '../BasicEditor/BasicEditor';
import NoteContainer from '../NoteContainer/NoteContainer';

import './Editor.scss';

export default class SectionEditor extends Component {
  static PropTypes = {
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

    this.notes = {};
  }

  focus = (contentId) => {
    if (contentId === 'main' && this.mainEditor) {
      this.mainEditor.focus();
    } else if (this.notes[contentId]) {
      this.notes[contentId].editor.focus();
    }
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
      keyBindingFn,

      editorStyles,
      readOnly = {},
    } = this.props;

    const bindMainEditor = editor => {
      this.mainEditor = editor;
    }

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
      const bindNote = note => {
        this.notes[noteId] = note;
      }
      const onNoteBlur = e => {
        onBlur(e, noteId);
      }

      return (
        <NoteContainer
          key={noteId}
          note={note}
          assets={assets}

          ref={bindNote}

          assetRequestPosition={assetRequestPosition}
          assetChoiceProps={assetChoiceProps}

          readOnly={readOnly[noteId]}

          onEditorClick={onNoteEditorClick}
          onBlur={onNoteBlur}

          onEditorChange={onThisNoteEditorChange}

          onAssetRequest={onNoteAssetRequest}
          onAssetRequestCancel={onAssetRequestCancel}
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
          keyBindingFn={keyBindingFn}

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
    const onMainBlur = e => {
      onBlur(e, 'main');
    }
    return (
      <div className={editorClass}>
        <section className="main-container-editor">
          <BasicEditor 
            editorState={mainEditorState}
            notes={notes}
            assets={assets}
            ref={bindMainEditor}

            assetRequestPosition={assetRequestPosition}
            assetChoiceProps={assetChoiceProps}

            readOnly={readOnly.main}

            onClick={onMainEditorClick}
            onBlur={onMainBlur}
            
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
