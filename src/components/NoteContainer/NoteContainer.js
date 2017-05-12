import React from 'react';

import './NoteContainer.scss';

import ContentEditor from '../ContentEditor/ContentEditor';

const NoteContainer = ({
  note,
  assets,
  
  lastInsertionType,
  onEditorChange,
  onAssetRequest,
  onDataChange,
  onClickDelete,
  onDrop,

  onAssetClick,
  onAssetMouseOver,
  onAssetMouseOut,
  inlineAssetComponents,
  blockAssetComponents,
  editorStyle
}) => (
  <section 
    className="peritext-draft-NoteContainer"
  >
    <div className="note-header">
      <button onClick={onClickDelete}>x</button>
      <h3>Note {note.order}</h3>
    </div>
    <div className="note-body">
      <ContentEditor 
        editorState={note.editorState}
        assets={assets}
        lastInsertionType={lastInsertionType} 
        
        onEditorChange={onEditorChange}
        onAssetRequest={onAssetRequest}
        onDataChange={onDataChange}
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

export default NoteContainer;
