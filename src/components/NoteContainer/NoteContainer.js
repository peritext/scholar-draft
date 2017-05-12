import React from 'react';

import './NoteContainer.scss';

import ContentEditor from '../ContentEditor/ContentEditor';

const NoteContainer = ({
  note,
  contextualizations,
  contextualizers,
  resources,
  lastInsertionType,
  onEditorChange,
  onContextualizationRequest,
  onDataChange,
  onClickDelete,
  onDrop,

  onContextualizationClick,
  onContextualizationMouseOver,
  onContextualizationMouseOut,
  inlineContextualizationComponents,
  blockContextualizationComponents,
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
        contextualizations={contextualizations}
        contextualizers={contextualizers}
        resources={resources}
        lastInsertionType={lastInsertionType} 
        
        onEditorChange={onEditorChange}
        onContextualizationRequest={onContextualizationRequest}
        onDataChange={onDataChange}
        onDrop={onDrop}

        onContextualizationClick={onContextualizationClick}
        onContextualizationMouseOver={onContextualizationMouseOver}
        onContextualizationMouseOut={onContextualizationMouseOut}
        
        inlineContextualizationComponents={inlineContextualizationComponents}
        blockContextualizationComponents={blockContextualizationComponents}
        allowNotesInsertion={false}
        editorStyle={editorStyle}
      />
    </div>
  </section>
);

export default NoteContainer;
