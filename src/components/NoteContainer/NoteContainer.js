import React, {Component} from 'react';

import './NoteContainer.scss';

import BasicEditor from '../BasicEditor/BasicEditor';

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
      assetRequestPosition,
      addTextAtCurrentSelection,
      
      onEditorChange,
      onAssetRequest,
      onAssetRequestCancel,
      onAssetChoice,
      onAssetChange,
      onClickDelete,
      onDrop,
      onBlur,
      onEditorClick,

      onAssetClick,
      onAssetMouseOver,
      onAssetMouseOut,
      inlineAssetComponents,
      blockAssetComponents,
      AssetChoiceComponent,
      
      assetChoiceProps,

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
          <BasicEditor 
            editorState={note.editorState}
            assets={assets}
            readOnly={readOnly}
            ref={bindRef}
            onClick={onClick}
            onDrop={onDrop}
            onBlur={onBlur}
            addTextAtCurrentSelection={addTextAtCurrentSelection}

            assetRequestPosition={assetRequestPosition}
            onAssetRequestCancel={onAssetRequestCancel}
            AssetChoiceComponent={AssetChoiceComponent}
            assetChoiceProps={assetChoiceProps}


            onEditorChange={onEditorChange}
            onAssetRequest={onAssetRequest}
            onAssetChange={onAssetChange}
            onAssetChoice={onAssetChoice}

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
