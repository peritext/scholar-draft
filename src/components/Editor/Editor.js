/**
 * This module exports a component representing an editor with main editor and footnotes,
 * with related interface and decorators.
 * Asset components must be provided through props
 * @module scholar-draft/Editor
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Scrollbars } from 'react-custom-scrollbars';
import { easeCubic } from 'd3-ease';

import { EditorState } from 'draft-js';

// import { getOffsetRelativeToContainer, } from '../../utils';

import BasicEditor from '../BasicEditor/BasicEditor';
import DefaultNoteContainer from '../NoteContainer/NoteContainer';

import './Editor.scss';

const DefaultElementLayout = ( {
  children,
  style,
  className
} ) => ( 
  <div
    style={ style }
    className={ className }
  >{children}
  </div> 
);

DefaultElementLayout.propTypes = {
  children: PropTypes.oneOfType( [ PropTypes.array, PropTypes.element, PropTypes.func ] ),
  style: PropTypes.string,
  className: PropTypes.string
};

export default class Editor extends Component {

  static propTypes = {

    /**
     * EDITOR STATE
     */
    // draft-js immutable object representing the main editor state
    mainEditorState: PropTypes.object,
    // map of immutable objects representing the notes editor state
    notes: PropTypes.object,
    // array of ids for representing the order of notes
    notesOrder: PropTypes.array,
    assetRequestPosition: PropTypes.object,
    assetRequestContentId: PropTypes.string,
    assetChoiceProps: PropTypes.object,
    focusedEditorId: PropTypes.string,
    // custom context object that will be passed to downstream entity decoration components
    customContext: PropTypes.object,
    // list of objects possibly embeddable inside the editor
    assets: PropTypes.object,

    /**
     * CALLBACKS
     */
    onEditorChange: PropTypes.func,
    onNoteAdd: PropTypes.func,
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

    /**
     * CUSTOMIZATION
     */
    // (translated) messages to provide to the editor for displaying
    messages: PropTypes.shape( {
      addNote: PropTypes.string,
      summonAsset: PropTypes.string,
      cancel: PropTypes.string,
    } ),
    // custom class for the editor
    editorClass: PropTypes.string,
    // editor placeholder text
    editorPlaceholder: PropTypes.string,
    inlineAssetComponents: PropTypes.object,
    blockAssetComponents: PropTypes.object,
    AssetChoiceComponent: PropTypes.func,
    NotePointerComponent: PropTypes.func,
    AssetButtonComponent: PropTypes.func,
    NoteButtonComponent: PropTypes.func,
    NoteLayout: PropTypes.func,
    inlineEntities: PropTypes.array,
    iconMap: PropTypes.object,
    inlineButtons: PropTypes.array,
    NoteContainerComponent: PropTypes.func,
    ElementLayoutComponent: PropTypes.func,
    getAssetComponent: PropTypes.func,
    
    // rendering mode to provide to entity decoration components
    renderingMode: PropTypes.string,

    keyBindingFn: PropTypes.func,
    
    // custom inline styles
    editorStyles: PropTypes.object,
  }

  static childContextTypes = {
    getAssetComponent: PropTypes.func,
  }

  /**
   * component contructor
   * @param {object} props - initializing props
   */
  constructor( props ) {
    super( props );

    /*
     * this is used as a map of refs
     * to interact with note components
     */
    this.notes = {};
    this.state = {
      focusedEditorId: undefined
    };
  }

  getChildContext = () => ( {
    getAssetComponent: this.props.getAssetComponent,
  } )

  /**
   * Executes code on instance after the component is mounted
   */
  componentDidMount = () => {
    if ( this.props.focusedEditorId ) {
      this.updateFocusedEditorId( this.props.focusedEditorId );
    }
  }

  componentWillReceiveProps = ( nextProps ) => {
    if ( this.props.focusedEditorId !== nextProps.focusedEditorId ) {
      this.updateFocusedEditorId( nextProps.focusedEditorId );
    }
  }

  updateFocusedEditorId = ( focusedEditorId ) => {
    // dirty workaround for a firefox-specific bug - related to https://github.com/facebook/draft-js/issues/1812
    if ( navigator.userAgent.toLowerCase().includes( 'firefox' ) ) {
      this.setState( { focusedEditorId: undefined } );
      setTimeout( () => {
        this.setState( { focusedEditorId } );
        if ( focusedEditorId === 'main' && this.editor ) {
          this.editor.focus();
        }
        else if ( focusedEditorId && this.notes[focusedEditorId] ) {
          this.notes[focusedEditorId].editor.focus();
        }
      }, 1 );
    }
    else {
      this.setState( {
        focusedEditorId,
      } );
    }
  }

  /**
   * Programmatically modifies the scroll state of the component
   * so that it transitions to a specific point in the page
   * @param {number} top - the position to scroll to in pixels
   */
  scrollTop( initialTop ) {
    const scrollbars = this.globalScrollbar;
    const scrollTop = scrollbars.getScrollTop();
    const scrollHeight = scrollbars.getScrollHeight();
    let top = initialTop > scrollHeight ? scrollHeight : initialTop;
    top = top < 0 ? 0 : top;

    const ANIMATION_DURATION = 1000;
    const ANIMATION_STEPS = 10;
    const animationTick = 1 / ANIMATION_STEPS;

    const diff = top - scrollTop;

    for ( let currentTime = 0; currentTime <= 1; currentTime += animationTick ) {
      const to = easeCubic( currentTime );
      setTimeout( () => {
        this.globalScrollbar.scrollTop( scrollTop + ( diff * to ) );
      }, ANIMATION_DURATION * currentTime );
    }
  }

  /**
   * manages imperative focus on one of the editors
   * @param {string} contentId - 'main' or note uuid
   * @param {ImmutableRecord} selection - the selection to focus on
   */
  focus = ( contentId, selection ) => {
    if ( contentId === 'main' && this.mainEditor ) {
      if ( selection ) {
        this.mainEditor.setState( {
          readOnly: false,
          editorState: EditorState.acceptSelection(
            this.mainEditor.state.editorState,
            selection
          )
        } );
      }
      setTimeout( () => this.mainEditor.focus() );
    }
    else if ( this.notes[contentId] ) {
      setTimeout( () => this.notes[contentId].editor.focus() );
      if ( selection ) {
        this.notes[contentId].editor.setState( {
          readOnly: false,
          editorState: EditorState.acceptSelection(
            this.notes[contentId].editor.state.editorState,
            selection
          )
        } );
      }
    }
  }

  /**
   * Provides upstream-usable empty editor factory method with proper decorator
   * @return {ImmutableRecord} editorState - output editor state
   */
  generateEmptyEditor = () => {
    if ( this.mainEditor ) {
      return this.mainEditor.generateEmptyEditor();
    }
    return null;
  }

  /**
   * Scrolls to a specific note
   * @param {string} noteId
   */
  scrollToNote = ( thatNoteId ) => {
    const notePointer = document.getElementById( `note-container-${thatNoteId}` );
    const scrollTo = notePointer && notePointer.offsetTop;
    if ( scrollTo ) {
      this.scrollTop( scrollTo );
    }
  }

  /**
   * Scrolls to a specific note pointer
   * @param {string} noteId
   */
  scrollToNotePointer = ( thatNoteId ) => {
    const notePointer = document.getElementById( `note-pointer-${thatNoteId}` );
    const scrollTo = notePointer && notePointer.offsetTop;
    if ( scrollTo ) {
      this.scrollTop( scrollTo );
    }
  }

  /**
   * Renders a note editor component for a specific note
   * @param {string} noteId - uuid of the note to render
   * @param {number} order - order to attribute to it
   * @return {ReactMarkup} noteComponent - the note component
   */
  renderNoteEditor = ( noteId, order ) => {

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
      // focusedEditorId,
      NoteContainerComponent,
      AssetButtonComponent,
      NoteButtonComponent,
      inlineButtons,

      renderingMode,

      NoteLayout,

    } = this.props;
    const {
      focusedEditorId
    } = this.state;

    let containerDimensions;
    if ( this.editor ) {
      containerDimensions = this.editor.getBoundingClientRect();
    }

    const onThisNoteEditorChange = ( editor ) => onEditorChange( noteId, editor );
    const onNoteAssetRequest = ( selection ) => {
      onAssetRequest( noteId, selection );
    };
    const onClickDelete = () => {
      if ( typeof onNoteDelete === 'function' ) {
        this.props.onNoteDelete( noteId );
      }
    };
    const onNoteDrop = ( payload, selection ) => {
      if ( typeof onDrop === 'function' ) {
        onDrop( noteId, payload, selection );
      }
    };
    const onNoteDragOver = ( event ) => {
      if ( typeof onDragOver === 'function' ) {
        onDragOver( noteId, event );
      }
    };
    const note = notes[noteId];

    const onNoteEditorClick = ( event ) => {
      if ( typeof onClick === 'function' ) {
        onClick( event, noteId );
      }
    };
    const bindNote = ( thatNote ) => {
      this.notes[noteId] = thatNote;
    };
    const onNoteBlur = ( event ) => {
      onBlur( event, noteId );
    };

    const onClickScrollToNotePointer = ( thatNoteId ) => {
      const notePointer = document.getElementById( `note-pointer-${thatNoteId}` );
      const scrollTo = notePointer && notePointer.parentNode.offsetTop;
      if ( scrollTo ) {
        this.scrollTop( scrollTo );
      }
    };

    const NoteContainer = NoteContainerComponent || DefaultNoteContainer;
    return (
      <NoteContainer
        key={ noteId }
        note={ note }
        notes={ notes }
        assets={ assets }
        customContext={ customContext }
        editorPlaceholder={ editorPlaceholder }

        ref={ bindNote }

        messages={ messages }

        contentId={ noteId }

        assetRequestPosition={ assetRequestPosition }
        assetRequestContentId={ assetRequestContentId }
        assetChoiceProps={ assetChoiceProps }

        isActive={ noteId === focusedEditorId }

        onEditorClick={ onNoteEditorClick }
        onBlur={ onNoteBlur }

        renderingMode={ renderingMode }

        onEditorChange={ onThisNoteEditorChange }

        onClickScrollToNotePointer={ onClickScrollToNotePointer }

        onAssetRequest={ onNoteAssetRequest }
        onAssetRequestCancel={ onAssetRequestCancel }
        onAssetChange={ onAssetChange }
        onAssetChoice={ onAssetChoice }
        handlePastedText={ handlePastedText }

        onDrop={ onNoteDrop }
        onDragOver={ onNoteDragOver }
        onClickDelete={ onClickDelete }

        onAssetClick={ onAssetClick }
        onAssetMouseOver={ onAssetMouseOver }
        onAssetMouseOut={ onAssetMouseOut }

        containerDimensions={ containerDimensions }
        inlineButtons={ inlineButtons }
        inlineAssetComponents={ inlineAssetComponents }
        blockAssetComponents={ blockAssetComponents }
        AssetChoiceComponent={ AssetChoiceComponent }
        inlineEntities={ inlineEntities }
        iconMap={ iconMap }
        keyBindingFn={ keyBindingFn }
        NoteLayout={ NoteLayout }
        AssetButtonComponent={ AssetButtonComponent }
        NoteButtonComponent={ NoteButtonComponent }

        editorStyle={ editorStyles && editorStyles.noteEditor }
      />
    );
  }

  /**
   * Renders the component
   * @return {ReactMarkup} component - the output component
   */
  render = () => {
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
      AssetButtonComponent,
      NoteButtonComponent,
      ElementLayoutComponent,
      inlineEntities = [],
      iconMap,

      editorStyles,
      // focusedEditorId,

      renderingMode,

      // keyBindingFn,
    } = this.props;
    const {
      focusedEditorId,
    } = this.state;

    const ElementLayout = ElementLayoutComponent || DefaultElementLayout;

    /**
     * bindings
     */

    const bindMainEditor = ( editor ) => {
      this.mainEditor = editor;
    };

    /**
     * callbacks
     */
    const onMainEditorChange = ( editor ) => {
      onEditorChange( 'main', editor );
    };
    const onMainAssetRequest = ( selection ) => {
      onAssetRequest( 'main', selection );
    };
    const onMainEditorDrop = ( payload, selection ) => {
      if ( typeof onDrop === 'function' ) {
        onDrop( 'main', payload, selection );
      }
    };

    const onMainDragOver = ( event ) => {
      if ( typeof onDragOver === 'function' ) {
        onDragOver( 'main', event );
      }
    };

    const onMainEditorClick = ( event ) => {
      if ( typeof onClick === 'function' ) {
        onClick( event, 'main' );
      }
    };
    const onMainBlur = ( event ) => {
      onBlur( event, 'main' );
    };

    const onNotePointerMouseClickHandler = ( event ) => {
      const noteContainer = document.getElementById( `note-container-${event}` );
      if ( noteContainer ) {
        const { offsetTop } = noteContainer;
        this.scrollTop( offsetTop );
      }
      if ( typeof onNotePointerMouseClick === 'function' ) {
        onNotePointerMouseClick( event, 'main' );
      }
    };

    const bindGlobalScrollbarRef = ( scrollbar ) => {
      this.globalScrollbar = scrollbar;
    };

    const activeNotes = notesOrder || Object.keys( notes || {} )
      .sort( ( first, second ) => {
        if ( notes[first].order > notes[second].order ) {
          return 1;
        } return -1;
      } );

    const bindEditorRef = ( editor ) => {
      this.editor = editor;
    };

    let containerDimensions;
    if ( this.editor ) {
      containerDimensions = this.editor.getBoundingClientRect();
    }

    const handleScrollUpdate = this.onScrollUpdate;

    return (
      <div
        ref={ bindEditorRef }
        className={ editorClass }
      >
        <Scrollbars
          ref={ bindGlobalScrollbarRef }
          className={ 'custom-scrollbars' }
          autoHide
          onUpdate={ handleScrollUpdate }
          universal
        >
          <ElementLayout className={ 'main-container-editor' }>
            <BasicEditor
              editorState={ mainEditorState }
              assets={ assets }
              ref={ bindMainEditor }
              customContext={ customContext }

              messages={ messages }

              editorPlaceholder={ editorPlaceholder }

              notes={ notes }

              contentId={ 'main' }

              assetRequestPosition={ assetRequestPosition }
              isRequestingAssets={ assetRequestContentId === 'main' }
              assetChoiceProps={ assetChoiceProps }

              isActive={ focusedEditorId === 'main' }

              onClick={ onMainEditorClick }
              onBlur={ onMainBlur }

              renderingMode={ renderingMode }
              handlePastedText={ handlePastedText }

              onEditorChange={ onMainEditorChange }
              onDragOver={ onMainDragOver }
              onDrop={ onMainEditorDrop }
              onAssetRequest={ onMainAssetRequest }
              onAssetRequestCancel={ onAssetRequestCancel }
              onAssetChoice={ onAssetChoice }

              onNoteAdd={ onNoteAdd }
              onAssetChange={ onAssetChange }

              onAssetClick={ onAssetClick }
              onAssetMouseOver={ onAssetMouseOver }
              onAssetMouseOut={ onAssetMouseOut }
              onAssetBlur={ onAssetBlur }

              onNotePointerMouseOver={ onNotePointerMouseOver }
              onNotePointerMouseOut={ onNotePointerMouseOut }
              onNotePointerMouseClick={ onNotePointerMouseClickHandler }

              inlineButtons={ inlineButtons }
              inlineAssetComponents={ inlineAssetComponents }
              blockAssetComponents={ blockAssetComponents }
              AssetChoiceComponent={ AssetChoiceComponent }
              NotePointerComponent={ NotePointerComponent }
              AssetButtonComponent={ AssetButtonComponent }
              NoteButtonComponent={ NoteButtonComponent }
              inlineEntities={ inlineEntities }
              iconMap={ iconMap }

              containerDimensions={ containerDimensions }

              allowNotesInsertion
              editorStyle={ editorStyles && editorStyles.mainEditor }
            />
          </ElementLayout>
          <ElementLayout className={ 'notes-container' }>
            {
              activeNotes
                .map( this.renderNoteEditor )
            }
          </ElementLayout>
        </Scrollbars>
      </div>
    );
  }
}
