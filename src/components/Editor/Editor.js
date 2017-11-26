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

import {
  EditorState
} from 'draft-js';

import BasicEditor from '../BasicEditor/BasicEditor';
import DefaultNoteContainer from '../NoteContainer/NoteContainer';


import './Editor.scss';

export default class Editor extends Component {

  static propTypes = {
    mainEditorState: PropTypes.object,
    notes: PropTypes.object,
    assets: PropTypes.object,

    editorClass: PropTypes.string,
    
    onEditorChange: PropTypes.func,
    onNoteAdd: PropTypes.func,

    onAssetChange: PropTypes.func,
    onAssetRequest: PropTypes.func,
    onAssetRequestCancel: PropTypes.func,
    onAssetChoice: PropTypes.func,
    onAssetClick: PropTypes.func,
    onAssetMouseOver: PropTypes.func,
    onAssetMouseOut: PropTypes.func,

    onNotePointerMouseOver: PropTypes.func,
    onNotePointerMouseOut: PropTypes.func,
    onNotePointerMouseClick: PropTypes.func,
    onNoteDelete: PropTypes.func,
    onDrop: PropTypes.func,
    onDragOver: PropTypes.func,
    onClick: PropTypes.func,
    onBlur: PropTypes.func,

    assetRequestPosition: PropTypes.object,
    assetChoiceProps: PropTypes.object,
    
    inlineAssetComponents: PropTypes.object,
    blockAssetComponents: PropTypes.object,
    AssetChoiceComponent: PropTypes.func,
    NotePointerComponent: PropTypes.func,
    BibliographyComponent: PropTypes.func,
    inlineEntities: PropTypes.array,
    iconMap: PropTypes.object,

    keyBindingFn: PropTypes.func,

    editorStyles: PropTypes.object,
    clipboard: PropTypes.object,
    focusedEditorId: PropTypes.string,
    NoteContainerComponent: PropTypes.func,
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
      
      onEditorChange,

      onAssetChange,
      onAssetRequest,
      onAssetRequestCancel,
      onAssetChoice,
      onAssetClick,
      onAssetMouseOver,
      onAssetMouseOut,

      onNoteDelete,
      onDrop,
      onDragOver,
      onClick,
      onBlur,

      assetRequestPosition,
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
    } = this.props;
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

        ref={bindNote}

        contentId={noteId}

        assetRequestPosition={assetRequestPosition}
        assetChoiceProps={assetChoiceProps}

        isActive={noteId === focusedEditorId}

        onEditorClick={onNoteEditorClick}
        onBlur={onNoteBlur}

        onEditorChange={onThisNoteEditorChange}

        onClickScrollToNotePointer={onClickScrollToNotePointer}

        onAssetRequest={onNoteAssetRequest}
        onAssetRequestCancel={onAssetRequestCancel}
        onAssetChange={onAssetChange}
        onAssetChoice={onAssetChoice}

        clipboard={clipboard}

        onDrop={onNoteDrop}
        onDragOver={onNoteDragOver}
        onClickDelete={onClickDelete}

        onAssetClick={onAssetClick}
        onAssetMouseOver={onAssetMouseOver}
        onAssetMouseOut={onAssetMouseOut}

        inlineAssetComponents={inlineAssetComponents}
        blockAssetComponents={blockAssetComponents}
        AssetChoiceComponent={AssetChoiceComponent}
        inlineEntities={inlineEntities}
        iconMap={iconMap}
        keyBindingFn={keyBindingFn}

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
      assets,

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

      onNotePointerMouseOver,
      onNotePointerMouseOut,
      onNotePointerMouseClick,
      onDrop,
      onDragOver,
      onClick,
      onBlur,

      assetRequestPosition,
      assetChoiceProps,
      
      inlineAssetComponents,
      blockAssetComponents,
      AssetChoiceComponent,
      NotePointerComponent,
      BibliographyComponent,
      inlineEntities = [],
      iconMap,

      editorStyles,
      clipboard,
      focusedEditorId,

      // keyBindingFn,
    } = this.props;

    /**
     * bindings
     */

    const bindMainEditor = (editor) => {
      this.mainEditor = editor;
    };

    /**
     * callbacks
     */
    const onMainEditorChange = editor => onEditorChange('main', editor);
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
        const offsetTop = noteContainer.offsetTop;
        this.scrollTop(offsetTop);
      }
      if (typeof onNotePointerMouseClick === 'function') {
        onNotePointerMouseClick(event, 'main');
      }
    };

    const bindGlobalScrollbarRef = (scrollbar) => {
      this.globalScrollbar = scrollbar;
    };
    return (
      <div className={editorClass}>
        <Scrollbars
          ref={bindGlobalScrollbarRef}
          autoHide
          onUpdate={this.onScrollUpdate}
          universal
        >
          <section className="main-container-editor">
            <BasicEditor 
              editorState={mainEditorState}
              assets={assets}
              ref={bindMainEditor}

              notes={notes}

              contentId="main"

              assetRequestPosition={assetRequestPosition}
              assetChoiceProps={assetChoiceProps}

              isActive={focusedEditorId === 'main'}

              onClick={onMainEditorClick}
              onBlur={onMainBlur}
            
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

              onNotePointerMouseOver={onNotePointerMouseOver}
              onNotePointerMouseOut={onNotePointerMouseOut}
              onNotePointerMouseClick={onNotePointerMouseClickHandler}
            
              inlineAssetComponents={inlineAssetComponents}
              blockAssetComponents={blockAssetComponents}
              AssetChoiceComponent={AssetChoiceComponent}
              NotePointerComponent={NotePointerComponent}
              inlineEntities={inlineEntities}
              iconMap={iconMap}

              clipboard={clipboard}

              allowNotesInsertion
              editorStyle={editorStyles && editorStyles.mainEditor}
            />
          </section>
          <aside className="notes-container">
            {
            Object.keys(notes || {})
            .sort((first, second) => {
              if (notes[first].order > notes[second].order) {
                return 1;
              } return -1;
            })
            .map(this.renderNoteEditor)
          }
          </aside>
          {
          BibliographyComponent && <BibliographyComponent />
        }
        </Scrollbars>
      </div>
    );
  }
}
