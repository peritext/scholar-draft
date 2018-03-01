/**
 * This module exports a react component wrapping a editable note representation
 * @module scholar-draft/NoteContainer
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './NoteContainer.scss';

import BasicEditor from '../BasicEditor/BasicEditor';

class NoteContainer extends Component {

  static propTypes= {
    note: PropTypes.object,
    assets: PropTypes.object,
    assetRequestPosition: PropTypes.object,
    assetRequestContentId: PropTypes.string,
    contentId: PropTypes.string,
    isActive: PropTypes.bool,

    renderingMode: PropTypes.string,


    addTextAtCurrentSelection: PropTypes.func,
    onEditorChange: PropTypes.func,
    onClickScrollToNotePointer: PropTypes.func,
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
    inlineEntities: PropTypes.array,
    iconMap: PropTypes.object,
    
    assetChoiceProps: PropTypes.object,
    clipboard: PropTypes.object,
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
      contentId,
      isActive,
      renderingMode,
      
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
      onClickScrollToNotePointer,
      onAssetMouseOver,
      onAssetMouseOut,
      inlineAssetComponents,
      blockAssetComponents,
      AssetChoiceComponent,
      inlineEntities = [],
      iconMap,
      
      assetChoiceProps,
      assetRequestContentId,

      clipboard,

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

    const onClickScrollToNotePointerHandler = (event) => {
      event.stopPropagation();
      onClickScrollToNotePointer(note.id);
    };
    return note ? (
      <section 
        className="scholar-draft-NoteContainer"
        id={`note-container-${note.id}`}
      >
        <div className="note-header" onClick={onHeaderClick}>
          <button onClick={onClickDelete}>x</button>
          <h3>Note {note.order}</h3>
          <button onClick={onClickScrollToNotePointerHandler}>↑</button>
        </div>
        <div className="note-body">
          <BasicEditor 
            editorState={note.editorState || note.contents}
            contentId={contentId}
            assets={assets}
            ref={bindRef}
            onClick={onClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onBlur={onBlur}
            addTextAtCurrentSelection={addTextAtCurrentSelection}
            clipboard={clipboard}

            renderingMode={renderingMode}

            isActive={isActive}

            assetRequestPosition={assetRequestPosition}
            onAssetRequestCancel={onAssetRequestCancel}
            isRequestingAssets={assetRequestContentId === contentId}

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
            inlineEntities={inlineEntities}
            iconMap={iconMap}
            allowNotesInsertion={false}
            editorStyle={editorStyle}
          />
        </div>
      </section>
    ) : null;
  }
}

export default NoteContainer;
