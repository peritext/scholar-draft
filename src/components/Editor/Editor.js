/**
 * This module exports a component representing an editor with main editor and footnotes,
 * with related interface and decorators.
 * Asset components must be provided through props
 * @module scholar-draft/Editor
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Scrollbars } from 'react-custom-scrollbars';
import {
  SpringSystem,
  MathUtil
} from 'rebound';

import { EditorState } from 'draft-js';


// import { getOffsetRelativeToContainer, } from '../../utils';


import BasicEditor from '../BasicEditor/BasicEditor';
import DefaultNoteContainer from '../NoteContainer/NoteContainer';


import './Editor.scss';

const DefaultElementLayout = ({
  children,
  style,
  className
}) => (<div style={style} className={className}>{children}</div>);

DefaultElementLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element, PropTypes.func]),
  style: PropTypes.string,
  className: PropTypes.string
};

export default class Editor extends Component {

  static propTypes = {
    mainEditorState: PropTypes.object,
    notes: PropTypes.object,
    notesOrder: PropTypes.array,

    messages: PropTypes.shape({
      addNote: PropTypes.string,
      summonAsset: PropTypes.string,
      cancel: PropTypes.string,
    }),
    customContext: PropTypes.object,

    // className: PropTypes.string,

    assets: PropTypes.object,

    editorClass: PropTypes.string,

    onEditorChange: PropTypes.func,
    onNoteAdd: PropTypes.func,
    editorPlaceholder: PropTypes.string,

    onAssetChange: PropTypes.func,
    onAssetRequest: PropTypes.func,
    onAssetRequestCancel: PropTypes.func,
    onAssetChoice: PropTypes.func,
    onAssetClick: PropTypes.func,
    onAssetMouseOver: PropTypes.func,
    onAssetMouseOut: PropTypes.func,
    onAssetBlur: PropTypes.func,
    handlePastedText: PropTypes.func,

    onNotePointerMouseOver: PropTypes.func,
    onNotePointerMouseOut: PropTypes.func,
    onNotePointerMouseClick: PropTypes.func,
    onNoteDelete: PropTypes.func,
    onDrop: PropTypes.func,
    onDragOver: PropTypes.func,
    onClick: PropTypes.func,
    onBlur: PropTypes.func,

    assetRequestPosition: PropTypes.object,
    assetRequestContentId: PropTypes.string,
    assetChoiceProps: PropTypes.object,

    inlineAssetComponents: PropTypes.object,
    blockAssetComponents: PropTypes.object,
    AssetChoiceComponent: PropTypes.func,
    NotePointerComponent: PropTypes.func,
    BibliographyComponent: PropTypes.func,
    AssetButtonComponent: PropTypes.func,
    NoteButtonComponent: PropTypes.func,
    NoteLayout: PropTypes.func,
    inlineEntities: PropTypes.array,
    iconMap: PropTypes.object,
    inlineButtons: PropTypes.array,

    renderingMode: PropTypes.string,

    keyBindingFn: PropTypes.func,

    editorStyles: PropTypes.object,
    clipboard: PropTypes.object,
    focusedEditorId: PropTypes.string,
    NoteContainerComponent: PropTypes.func,
    ElementLayoutComponent: PropTypes.func,
  }

  /**
   * component contructor
   * @param {object} props - initializing props
   */
  constructor(props) {
    super(props);
    // this is used as a map of refs
    // to interact with note components
    this.notes = {};
  }

  /**
   * Executes code on instance after the component is mounted
   */
  componentDidMount = () => {
    // we use a spring system to handle automatic scrolls
    // (e.g. note pointer clicked or click in the table of contents)
    this.springSystem = new SpringSystem();
    this.spring = this.springSystem.createSpring();
    this.spring.addListener({
      onSpringUpdate: this.handleSpringUpdate
    });
  }

  componentWillReceiveProps = (nextProps) => {
    // if (this.props.focusedEditorId !== nextProps.focusedEditorId && nextProps.focusedEditorId) {
    //   setTimeout(() => {
    //     const { anchorNode } = getSelection();
    //     if (anchorNode) {
    //       const offset = getOffsetRelativeToContainer(
    //        anchorNode, this.props.className || 'scholar-draft-Editor');
    //       if (offset.offsetY && !isNaN(offset.offsetY)) { /* eslint no-restricted-globals : 0  */
    //         const scrollTo = offset.offsetY;// - (this.globalScrollbar.getClientHeight() / 2);
    //         this.scrollTop(scrollTo);
    //       }
    //     }
    //     // this.scrollTop(rect.top);
    //   }, 300);
    // }
  }

  /**
   * Handles the scrolling process using the spring system
   * @param {object} spring - the spring system instance
   */
  handleSpringUpdate = (spring) => {
    const val = spring.getCurrentValue();
    if (val !== undefined && this.globalScrollbar) {
      this.globalScrollbar.scrollTop(val);
    }
  }

  /**
   * Programmatically modifies the scroll state of the component
   * so that it transitions to a specific point in the page
   * @param {number} top - the position to scroll to in pixels
   */
  scrollTop(top) {
    // this.globalScrollbar.scrollTop(top);
    const scrollbars = this.globalScrollbar;
    const scrollTop = scrollbars.getScrollTop();
    const scrollHeight = scrollbars.getScrollHeight();
    const val = MathUtil.mapValueInRange(top, 0, scrollHeight, 0, scrollHeight);
    this.spring.setCurrentValue(scrollTop).setAtRest();
    this.spring.setEndValue(val);
  }


  /**
   * manages imperative focus on one of the editors
   * @param {string} contentId - 'main' or note uuid
   * @param {ImmutableRecord} selection - the selection to focus on
   */
  focus = (contentId, selection) => {
    if (contentId === 'main' && this.mainEditor) {
      if (selection) {
        this.mainEditor.setState({
          readOnly: false,
          editorState: EditorState.acceptSelection(
            this.mainEditor.state.editorState,
            selection
          )
        });
      }
      setTimeout(() => this.mainEditor.focus());
    } else if (this.notes[contentId]) {
      setTimeout(() => this.notes[contentId].editor.focus());
      if (selection) {
        this.notes[contentId].editor.setState({
          readOnly: false,
          editorState: EditorState.acceptSelection(
            this.notes[contentId].editor.state.editorState,
            selection
          )
        });
      }
    }
  }

  /**
   * Provides upstream-usable empty editor factory method with proper decorator
   * @return {ImmutableRecord} editorState - output editor state
   */
  generateEmptyEditor = () => {
    if (this.mainEditor) {
      return this.mainEditor.generateEmptyEditor();
    }
    return null;
  }

  /**
   * Renders a note editor component for a specific note
   * @param {string} noteId - uuid of the note to render
   * @param {number} order - order to attribute to it
   * @return {ReactMarkup} noteComponent - the note component
   */
  renderNoteEditor = (noteId, order) => {

    const {
      notes,
      assets,
      customContext,
      editorPlaceholder,

      messages,

      onEditorChange,

      onAssetChange,
      onAssetRequest,
      onAssetRequestCancel,
      onAssetChoice,
      onAssetClick,
      onAssetMouseOver,
      onAssetMouseOut,
      handlePastedText,

      onNoteDelete,
      onDrop,
      onDragOver,
      onClick,
      onBlur,

      assetRequestPosition,
      assetRequestContentId,
      assetChoiceProps,

      inlineAssetComponents,
      blockAssetComponents,
      AssetChoiceComponent,
      inlineEntities,
      iconMap,

      keyBindingFn,

      editorStyles,
      clipboard,
      focusedEditorId,
      NoteContainerComponent,
      AssetButtonComponent,
      NoteButtonComponent,
      inlineButtons,

      renderingMode,

      NoteLayout,

    } = this.props;

    let containerDimensions;
    if (this.editor) {
      containerDimensions = this.editor.getBoundingClientRect();
    }

    const onThisNoteEditorChange = editor => onEditorChange(noteId, editor);
    const onNoteAssetRequest = (selection) => {
      onAssetRequest(noteId, selection);
    };
    const onClickDelete = () => {
      if (typeof onNoteDelete === 'function') {
        this.props.onNoteDelete(noteId);
      }
    };
    const onNoteDrop = (payload, selection) => {
      if (typeof onDrop === 'function') {
        onDrop(noteId, payload, selection);
      }
    };
    const onNoteDragOver = (event) => {
      if (typeof onDragOver === 'function') {
        onDragOver(noteId, event);
      }
    };
    const note = notes[noteId];

    const onNoteEditorClick = (event) => {
      if (typeof onClick === 'function') {
        onClick(event, noteId);
      }
    };
    const bindNote = (thatNote) => {
      this.notes[noteId] = thatNote;
    };
    const onNoteBlur = (event) => {
      onBlur(event, noteId);
    };

    const onClickScrollToNotePointer = (thatNoteId) => {
      const notePointer = document.getElementById(`note-pointer-${thatNoteId}`);
      const scrollTo = notePointer && notePointer.offsetTop;
      if (scrollTo) {
        this.scrollTop(scrollTo);
      }
    };


    const NoteContainer = NoteContainerComponent || DefaultNoteContainer;
    return (
      <NoteContainer
        key={noteId}
        note={note}
        notes={notes}
        assets={assets}
        customContext={customContext}
        editorPlaceholder={editorPlaceholder}

        ref={bindNote}

        messages={messages}

        contentId={noteId}

        assetRequestPosition={assetRequestPosition}
        assetRequestContentId={assetRequestContentId}
        assetChoiceProps={assetChoiceProps}

        isActive={noteId === focusedEditorId}

        onEditorClick={onNoteEditorClick}
        onBlur={onNoteBlur}

        renderingMode={renderingMode}

        onEditorChange={onThisNoteEditorChange}

        onClickScrollToNotePointer={onClickScrollToNotePointer}

        onAssetRequest={onNoteAssetRequest}
        onAssetRequestCancel={onAssetRequestCancel}
        onAssetChange={onAssetChange}
        onAssetChoice={onAssetChoice}
        handlePastedText={handlePastedText}

        clipboard={clipboard}

        onDrop={onNoteDrop}
        onDragOver={onNoteDragOver}
        onClickDelete={onClickDelete}

        onAssetClick={onAssetClick}
        onAssetMouseOver={onAssetMouseOver}
        onAssetMouseOut={onAssetMouseOut}

        containerDimensions={containerDimensions}
        inlineButtons={inlineButtons}
        inlineAssetComponents={inlineAssetComponents}
        blockAssetComponents={blockAssetComponents}
        AssetChoiceComponent={AssetChoiceComponent}
        inlineEntities={inlineEntities}
        iconMap={iconMap}
        keyBindingFn={keyBindingFn}
        NoteLayout={NoteLayout}
        AssetButtonComponent={AssetButtonComponent}
        NoteButtonComponent={NoteButtonComponent}

        editorStyle={editorStyles && editorStyles.noteEditor}
      />
    );
  }

  /**
   * Renders the component
   * @return {ReactMarkup} component - the output component
   */
  render() {
    const {
      mainEditorState,
      notes,
      notesOrder,
      assets,
      customContext,
      editorPlaceholder,

      messages,

      editorClass = 'scholar-draft-Editor',

      onEditorChange,
      onNoteAdd,

      onAssetChange,
      onAssetRequest,
      onAssetRequestCancel,
      onAssetChoice,
      onAssetClick,
      onAssetMouseOver,
      onAssetMouseOut,
      onAssetBlur,
      handlePastedText,

      onNotePointerMouseOver,
      onNotePointerMouseOut,
      onNotePointerMouseClick,
      onDrop,
      onDragOver,
      onClick,
      onBlur,

      assetRequestPosition,
      assetRequestContentId,
      assetChoiceProps,

      inlineButtons,
      inlineAssetComponents,
      blockAssetComponents,
      AssetChoiceComponent,
      NotePointerComponent,
      BibliographyComponent,
      AssetButtonComponent,
      NoteButtonComponent,
      ElementLayoutComponent,
      inlineEntities = [],
      iconMap,

      editorStyles,
      clipboard,
      focusedEditorId,

      renderingMode,

      // keyBindingFn,
    } = this.props;

    const ElementLayout = ElementLayoutComponent || DefaultElementLayout;

    /**
     * bindings
     */

    const bindMainEditor = (editor) => {
      this.mainEditor = editor;
    };

    /**
     * callbacks
     */
    const onMainEditorChange = (editor) => {
      onEditorChange('main', editor);
    };
    const onMainAssetRequest = (selection) => {
      onAssetRequest('main', selection);
    };
    const onMainEditorDrop = (payload, selection) => {
      if (typeof onDrop === 'function') {
        onDrop('main', payload, selection);
      }
    };

    const onMainDragOver = (event) => {
      if (typeof onDragOver === 'function') {
        onDragOver('main', event);
      }
    };

    const onMainEditorClick = (event) => {
      if (typeof onClick === 'function') {
        onClick(event, 'main');
      }
    };
    const onMainBlur = (event) => {
      onBlur(event, 'main');
    };

    const onNotePointerMouseClickHandler = (event) => {
      const noteContainer = document.getElementById(`note-container-${event}`);
      if (noteContainer) {
        const { offsetTop } = noteContainer;
        this.scrollTop(offsetTop);
      }
      if (typeof onNotePointerMouseClick === 'function') {
        onNotePointerMouseClick(event, 'main');
      }
    };

    const bindGlobalScrollbarRef = (scrollbar) => {
      this.globalScrollbar = scrollbar;
    };

    const activeNotes = notesOrder || Object.keys(notes || {})
      .sort((first, second) => {
        if (notes[first].order > notes[second].order) {
          return 1;
        } return -1;
      });

    const bindEditorRef = (editor) => {
      this.editor = editor;
    };

    let containerDimensions;
    if (this.editor) {
      containerDimensions = this.editor.getBoundingClientRect();
    }
    return (
      <div ref={bindEditorRef} className={editorClass}>
        <Scrollbars
          ref={bindGlobalScrollbarRef}
          className="custom-scrollbars"
          autoHide
          onUpdate={this.onScrollUpdate}
          universal
        >
          <ElementLayout className="main-container-editor">
            <BasicEditor
              editorState={mainEditorState}
              assets={assets}
              ref={bindMainEditor}
              customContext={customContext}

              messages={messages}

              editorPlaceholder={editorPlaceholder}

              notes={notes}

              contentId="main"

              assetRequestPosition={assetRequestPosition}
              isRequestingAssets={assetRequestContentId === 'main'}
              assetChoiceProps={assetChoiceProps}

              isActive={focusedEditorId === 'main'}

              onClick={onMainEditorClick}
              onBlur={onMainBlur}

              renderingMode={renderingMode}
              handlePastedText={handlePastedText}

              onEditorChange={onMainEditorChange}
              onDragOver={onMainDragOver}
              onDrop={onMainEditorDrop}
              onAssetRequest={onMainAssetRequest}
              onAssetRequestCancel={onAssetRequestCancel}
              onAssetChoice={onAssetChoice}

              onNoteAdd={onNoteAdd}
              onAssetChange={onAssetChange}

              onAssetClick={onAssetClick}
              onAssetMouseOver={onAssetMouseOver}
              onAssetMouseOut={onAssetMouseOut}
              onAssetBlur={onAssetBlur}

              onNotePointerMouseOver={onNotePointerMouseOver}
              onNotePointerMouseOut={onNotePointerMouseOut}
              onNotePointerMouseClick={onNotePointerMouseClickHandler}

              inlineButtons={inlineButtons}
              inlineAssetComponents={inlineAssetComponents}
              blockAssetComponents={blockAssetComponents}
              AssetChoiceComponent={AssetChoiceComponent}
              NotePointerComponent={NotePointerComponent}
              AssetButtonComponent={AssetButtonComponent}
              NoteButtonComponent={NoteButtonComponent}
              inlineEntities={inlineEntities}
              iconMap={iconMap}

              containerDimensions={containerDimensions}

              clipboard={clipboard}

              allowNotesInsertion
              editorStyle={editorStyles && editorStyles.mainEditor}
            />
          </ElementLayout>
          <ElementLayout className="notes-container">
            {
              activeNotes
                .map(this.renderNoteEditor)
            }
          </ElementLayout>
          {
            BibliographyComponent
            &&
              <ElementLayout className="bibliography-container">
                <BibliographyComponent />
              </ElementLayout>
          }
        </Scrollbars>
      </div>
    );
  }
}
