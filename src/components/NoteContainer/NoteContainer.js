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
    customContext: PropTypes.object,

    messages: PropTypes.object,

    renderingMode: PropTypes.string,

    inlineButtons: PropTypes.array,


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
    AssetButtonComponent: PropTypes.func,
    NoteButtonComponent: PropTypes.func,
    NoteLayout: PropTypes.func,
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
      messages,
      customContext,
      
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
      AssetButtonComponent,
      NoteButtonComponent,
      inlineEntities = [],
      iconMap,
      inlineButtons,
      
      assetChoiceProps,
      assetRequestContentId,

      clipboard,

      editorStyle,

      NoteLayout
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

    const onDelete = (event) => {
      event.stopPropagation();
      onClickDelete(event);
    };

    const onClickScrollToNotePointerHandler = (event) => {
      event.stopPropagation();
      onClickScrollToNotePointer(note.id);
    };
    if (note) {
      const Layout = NoteLayout ?
        ({
          children
        }) => (
          <NoteLayout
            note={note}
            onHeaderClick={onHeaderClick}
            onDelete={onDelete}
            onClickToRetroLink={onClickScrollToNotePointerHandler}
            id={`note-container-${note.id}`}
          >
            {children}
          </NoteLayout>
        )
        :
        ({
          children,
        }) => (
          <section 
            className="scholar-draft-NoteContainer"
            id={`note-container-${note.id}`}
          >
            <div className="note-header" onClick={onHeaderClick}>
              <button onClick={onDelete}>x</button>
              <h3>Note {note.order}</h3>
              <button onClick={onClickScrollToNotePointerHandler}>↑</button>
            </div>
            <div className="note-body">
              {children}
            </div>
          </section>
        );
      return (
        <Layout>
          <BasicEditor 
            editorState={note.editorState}
            contentId={contentId}
            assets={assets}
            ref={bindRef}
            onClick={onClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onBlur={onBlur}
            addTextAtCurrentSelection={addTextAtCurrentSelection}
            clipboard={clipboard}
            customContext={customContext}

            messages={messages}

            renderingMode={renderingMode}

            isActive={isActive}

            assetRequestPosition={assetRequestPosition}
            onAssetRequestCancel={onAssetRequestCancel}
            isRequestingAssets={assetRequestContentId === contentId}

            AssetButtonComponent={AssetButtonComponent}
            NoteButtonComponent={NoteButtonComponent}
            AssetChoiceComponent={AssetChoiceComponent}
            assetChoiceProps={assetChoiceProps}


            onEditorChange={onEditorChange}
            onAssetRequest={onAssetRequest}
            onAssetChange={onAssetChange}
            onAssetChoice={onAssetChoice}

            onAssetClick={onAssetClick}
            onAssetMouseOver={onAssetMouseOver}
            onAssetMouseOut={onAssetMouseOut}
            
            inlineButtons={inlineButtons}
            inlineAssetComponents={inlineAssetComponents}
            blockAssetComponents={blockAssetComponents}
            inlineEntities={inlineEntities}
            iconMap={iconMap}
            allowNotesInsertion={false}
            editorStyle={editorStyle}
          />
        </Layout>
      );
    }
    return null;
  }
}

export default NoteContainer;
