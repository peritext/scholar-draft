import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './NoteContainer.scss';

import BasicEditor from '../BasicEditor/BasicEditor';

class NoteContainer extends Component {

  static propTypes= {
    note: PropTypes.object,
    assets: PropTypes.object,
    notes: PropTypes.object,
    assetRequestPosition: PropTypes.object,


    addTextAtCurrentSelection: PropTypes.func,
    onEditorChange: PropTypes.func,
    onAssetRequest: PropTypes.func,
    onAssetRequestCancel: PropTypes.func,
    onAssetChoice: PropTypes.func,
    onAssetChange: PropTypes.func,
    onClickDelete: PropTypes.func,
    onDrop: PropTypes.func,
    onDragOver: PropTypes.func,
    onBlur: PropTypes.func,
    onEditorClick: PropTypes.func,
    onAssetClick: PropTypes.func,
    onAssetMouseOver: PropTypes.func,
    onAssetMouseOut: PropTypes.func,

    inlineAssetComponents: PropTypes.object,
    blockAssetComponents: PropTypes.object,
    AssetChoiceComponent: PropTypes.func,
    editorStyle: PropTypes.object,
    iconMap: PropTypes.object,
    
    assetChoiceProps: PropTypes.object,
    clipboard: PropTypes.object,


    readOnly: PropTypes.bool,
  }

  focus = () => {
    this.editor.focus();
  }

  render = () => {
    const {
      note,
      assets,
      notes,
      assetRequestPosition,
      addTextAtCurrentSelection,
      
      onEditorChange,
      onAssetRequest,
      onAssetRequestCancel,
      onAssetChoice,
      onAssetChange,
      onClickDelete,
      onDrop,
      onDragOver,
      onBlur,
      onEditorClick,

      onAssetClick,
      onAssetMouseOver,
      onAssetMouseOut,
      inlineAssetComponents,
      blockAssetComponents,
      AssetChoiceComponent,
      iconMap,
      
      assetChoiceProps,

      clipboard,

      readOnly,
      editorStyle
    } = this.props;

    const bindRef = (editor) => {
      this.editor = editor;
    };

    const onClick = (event) => {
      event.stopPropagation();
      onEditorClick(event);
    };

    const onHeaderClick = (event) => {
      event.stopPropagation();
      onEditorClick(event);
    };

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
            notes={notes}
            readOnly={readOnly}
            ref={bindRef}
            onClick={onClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onBlur={onBlur}
            addTextAtCurrentSelection={addTextAtCurrentSelection}
            clipboard={clipboard}

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
            iconMap={iconMap}
            allowNotesInsertion={false}
            editorStyle={editorStyle}
          />
        </div>
      </section>
    );
  }
}

export default NoteContainer;
