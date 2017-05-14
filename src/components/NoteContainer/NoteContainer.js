import React, {Component} from 'react';

import './NoteContainer.scss';

import ContentEditor from '../ContentEditor/ContentEditor';

class NoteContainer extends Component {
  constructor(props) {
    super(props);
  }

  focus = () => {
    this.editor.focus();
  }

  render = () => {
    const {
      note,
      assets,
      
      onEditorChange,
      onAssetRequest,
      onAssetChange,
      onClickDelete,
      onDrop,
      onEditorClick,

      onAssetClick,
      onAssetMouseOver,
      onAssetMouseOut,
      inlineAssetComponents,
      blockAssetComponents,
      readOnly,
      editorStyle
    } = this.props;

    const bindRef= editor => {
      this.editor = editor;
    }

    const onClick = e => {
      e.stopPropagation();
      onEditorClick(e);
    }

    const onHeaderClick = e => {
      e.stopPropagation();
      onEditorClick(e);
    }

    return (
      <section 
        className="scholar-draft-NoteContainer"
      >
        <div className="note-header" onClick={onHeaderClick}>
          <button onClick={onClickDelete}>x</button>
          <h3>Note {note.order}</h3>
        </div>
        <div className="note-body">
          <ContentEditor 
            editorState={note.editorState}
            assets={assets}
            readOnly={readOnly}
            ref={bindRef}
            onClick={onClick}
            
            onEditorChange={onEditorChange}
            onAssetRequest={onAssetRequest}
            onAssetChange={onAssetChange}
            onDrop={onDrop}

            onAssetClick={onAssetClick}
            onAssetMouseOver={onAssetMouseOver}
            onAssetMouseOut={onAssetMouseOut}
            
            inlineAssetComponents={inlineAssetComponents}
            blockAssetComponents={blockAssetComponents}
            allowNotesInsertion={false}
            editorStyle={editorStyle}
          />
        </div>
      </section>
    );
  }
}

export default NoteContainer;
