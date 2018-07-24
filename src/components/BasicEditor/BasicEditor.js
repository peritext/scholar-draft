/**
 * This module exports a component representing a single draft editor
 * with related interface and decorators.
 * Asset components must be provided through props
 * @module scholar-draft/BasicEditor
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { debounce } from 'lodash';

// draft-js EditorState decorators utils
import SimpleDecorator from 'draft-js-simpledecorator';
import MultiDecorator from 'draft-js-multidecorators';

import {
  EditorState,
  KeyBindingUtil,
  getDefaultKeyBinding,
  RichUtils,
  SelectionState,
  Modifier,
  Editor
} from 'draft-js';

import adjustBlockDepth from '../../modifiers/adjustBlockDepth';


// constant entities type names
import {
  INLINE_ASSET,
  NOTE_POINTER,
  SCHOLAR_DRAFT_CLIPBOARD_CODE
} from '../../constants';

import {
  getSelectedBlockElement,
  getSelectionRange,
  isParentOf,
  checkCharacterForState,
  checkReturnForState,
  getEventTextRange,
  Emitter
} from '../../utils';

// subcomponents
import SideToolbar from '../SideToolbar/SideToolbar';
import InlineToolbar from '../InlineToolbar/InlineToolbar';
import InlineAssetContainer from '../InlineAssetContainer/InlineAssetContainer';
import BlockAssetContainer from '../BlockAssetContainer/BlockAssetContainer';
import QuoteContainer from '../QuoteContainer/QuoteContainer';
import NotePointer from '../NotePointer/NotePointer';

// default icon map (exposes a map of img components - overriden by props-provided icon map)
import defaultIconMap from '../../icons/defaultIconMap';

import './BasicEditor.scss';

const { hasCommandModifier } = KeyBindingUtil;

// todo : store that somewhere else
const popoverSpacing = 50;

export default class BasicEditor extends Component {

  /**
   * Component class's properties accepted types
   */
  static propTypes = {
    /*
     * State-related props
     */
    editorState: PropTypes.object,
    readOnly: PropTypes.bool,
    assets: PropTypes.object,
    notes: PropTypes.object,
    clipboard: PropTypes.object,
    inlineAssetComponents: PropTypes.object,
    customContext: PropTypes.object,
    blockAssetComponents: PropTypes.object,
    assetRequestPosition: PropTypes.object,
    contentId: PropTypes.string,
    isActive: PropTypes.bool,
    isRequestingAssets: PropTypes.bool,
    /*
     * Method props
     */
    onEditorChange: PropTypes.func,
    onNotesOrderChange: PropTypes.func,
    onAssetRequest: PropTypes.func,
    onNoteAdd: PropTypes.func,
    onAssetClick: PropTypes.func,
    onAssetMouseOver: PropTypes.func,
    onAssetMouseOut: PropTypes.func,
    onDrop: PropTypes.func,
    onDragOver: PropTypes.func,
    onClick: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onAssetChoice: PropTypes.func,
    onAssetChange: PropTypes.func,
    onAssetRequestCancel: PropTypes.func,
    onNotePointerMouseOver: PropTypes.func,
    onNotePointerMouseOut: PropTypes.func,
    onNotePointerMouseClick: PropTypes.func,
    handlePastedText: PropTypes.func,
    /*
     * Parametrization props
     */
    editorClass: PropTypes.string,
    editorPlaceholder: PropTypes.string,
    editorStyle: PropTypes.object,
    allowNotesInsertion: PropTypes.bool,
    allowInlineAsset: PropTypes.bool,
    allowBlockAsset: PropTypes.bool,
    AssetChoiceComponent: PropTypes.func,
    AssetButtonComponent: PropTypes.func,
    NoteButtonComponent: PropTypes.func,
    assetChoiceProps: PropTypes.object,
    keyBindingFn: PropTypes.func,
    inlineButtons: PropTypes.array,
    NotePointerComponent: PropTypes.func,
    BibliographyComponent: PropTypes.func,
    inlineEntities: PropTypes.array,
    messages: PropTypes.object,

    renderingMode: PropTypes.string,

    iconMap: PropTypes.object,

    styles: PropTypes.object,
  }

  /**
   * Component class's default properties
   */
  static defaultProps = {
    blockAssetComponents: {},
  };

  /**
   * Component class's context properties types
   */
  static childContextTypes = {
    emitter: PropTypes.object,
    assets: PropTypes.object,
    notes: PropTypes.object,
    assetChoiceProps: PropTypes.object,
    onAssetMouseOver: PropTypes.func,
    onAssetMouseOut: PropTypes.func,
    onAssetChange: PropTypes.func,
    onAssetFocus: PropTypes.func,
    onAssetBlur: PropTypes.func,

    onNotePointerMouseOver: PropTypes.func,
    onNotePointerMouseOut: PropTypes.func,
    onNotePointerMouseClick: PropTypes.func,

    messages: PropTypes.object,


    onFocus: PropTypes.func,

    iconMap: PropTypes.object
  }

  /**
   * Component class's constructor
   * @param {object} props - props received at initialization
   */
  constructor(props) {
    super(props);
    // selection positionning is debounced to improve performance
    this.debouncedUpdateSelection = debounce(this.updateSelection, 100);
    // undo stack is debounced to improve performance
    // this.feedUndoStack = debounce(this.feedUndoStack, 1000);
    // it is needed to bind this function right away for being able
    // to initialize the state
    this.generateEmptyEditor = this.generateEmptyEditor.bind(this);

    this.state = {
      // editor state is initialized with a decorated editorState (notes + assets + ...)
      editorState: this.generateEmptyEditor(),
      // editor states undo and redo stacks
      // undoStack: [],
      // redoStack: [],
      // toolbars styles are represented as css-in-js
      styles: {
        inlineToolbar: {

        },
        sideToolbar: {

        }
      },
      readOnly: true
    };
    // the emitter allows to let custom components know when data is changed
    this.emitter = new Emitter();
  }

  /**
   * Binds component's data to its context
   */
  getChildContext = () => ({
    emitter: this.emitter,
    assets: this.props.assets,
    assetChoiceProps: this.props.assetChoiceProps,
    iconMap: this.props.iconMap,
    messages: this.props.messages,

    onAssetMouseOver: this.props.onAssetMouseOver,
    onAssetMouseOut: this.props.onAssetMouseOut,
    onAssetChange: this.props.onAssetChange,
    onAssetFocus: this.onAssetFocus,
    onAssetBlur: this.onAssetBlur,

    onNotePointerMouseOver: this.props.onNotePointerMouseOver,
    onNotePointerMouseOut: this.props.onNotePointerMouseOut,
    onNotePointerMouseClick: this.props.onNotePointerMouseClick,
    notes: this.props.notes,
  })

  /**
   * Component livecycle hooks
   */

  componentDidMount = () => {
    this.setState({
      readOnly: false,
      editorState: this.props.editorState ? EditorState.createWithContent(
        this.props.editorState.getCurrentContent(), 
        this.createDecorator()
      ) : this.generateEmptyEditor()
    });
  }

  componentWillReceiveProps = (nextProps, nextState) => {
    // console.time(`editor ${this.props.contentId}`);
    
    let stateMods = {};

    if (this.props.isRequestingAssets && !nextProps.isRequestingAssets) {
      // console.log('hiding', this.props.contentId);
      stateMods = {
        ...stateMods,
        styles: {
          sideToolbar: {
            display: 'none'
          },
          inlineToolbar: {
            display: 'none',
          }
        },
      };
    }
    // hiding the toolbars when editor is set to inactive
    if (
      (this.props.isActive && !nextProps.isActive && !nextProps.assetRequestPosition) 
    ) {
      // locking the draft-editor if asset choice component is not open
      // console.log('hding 2', this.props.contentId);
      stateMods = {
        ...stateMods,
        readOnly: true,
        styles: {
          sideToolbar: {
            display: 'none'
          },
          inlineToolbar: {
            display: 'none',
          }
        },
      };
      this.debouncedUpdateSelection.cancel();
    } else if (!this.props.isActive && nextProps.isActive && !this.props.assetRequestPosition) {
      const selection = this.state.editorState.getSelection();
      stateMods = {
        ...stateMods,
        readOnly: false,
        // editorState: nextProps.editorState ? EditorState.createWithContent(
        //   nextProps.editorState.getCurrentContent(), 
        //   this.createDecorator()
        // ) : this.generateEmptyEditor(),
        // editorState: EditorState.acceptSelection(nextProps.editorState, selection),
      };

      if (this.state.lastClickCoordinates) {
        const {
          // clientX, 
          // clientY, 
          el, 
          pageX, 
          pageY
        } = this.state.lastClickCoordinates;

        stateMods.lastClickCoordinates = undefined;

        const { offset } = getEventTextRange(pageX, pageY);
        let element = el;
        let parent = element.parentNode;

        // calculating the block-relative text offset of the selection
        let startOffset = offset;

        while (parent && !(parent.hasAttribute('data-block') && parent.attributes['data-offset-key']) && parent.tagName !== 'BODY') {
          let previousSibling = element.previousSibling;
          while (previousSibling) {
            // not counting inline assets contents and note pointers
            if (
              previousSibling.className && previousSibling.className.indexOf('scholar-draft-InlineAssetContainer') === -1
            ) {
              startOffset += previousSibling.textContent.length;
            }
            previousSibling = previousSibling.previousSibling;
          }
          element = parent;
          parent = element.parentNode;
        }
        if (parent && parent.attributes['data-offset-key']) {
          let blockId = parent.attributes['data-offset-key'].value;
          blockId = blockId && blockId.split('-')[0];

          const newSelection = new SelectionState({
            ...selection.toJS(),
            anchorKey: blockId,
            focusKey: blockId,
            anchorOffset: startOffset,
            focusOffset: startOffset,
          });
          const selectedEditorState = EditorState.acceptSelection(
            this.state.editorState, 
            newSelection
          );
          stateMods = {
            ...stateMods,
            editorState: selectedEditorState || this.generateEmptyEditor()
          };

          setTimeout(() => {
            this.onChange(selectedEditorState, false);
            this.forceRender({ ...this.props, editorState: selectedEditorState });
          });
        }
      } else {
        stateMods.editorState = nextProps.editorState ? EditorState.createWithContent(
          nextProps.editorState.getCurrentContent(), 
          this.createDecorator()
        ) : this.generateEmptyEditor();
        console.log('force render default');
        setTimeout(() => this.forceRender(this.props));
      }
      
    // updating locally stored editorState when the one given by props
    // has changed
    } else if (this.props.editorState !== nextProps.editorState) {
      // console.log('storing new editor state with selection', 
      // nextProps.editorState && nextProps.editorState.getSelection().getStartOffset())
      stateMods = {
        ...stateMods,
        editorState: nextProps.editorState || this.generateEmptyEditor()
      };
    }

    // updating rendering mode
    if (this.props.customContext !== nextProps.customContext) {
      this.emitter.dispatchCustomContext(nextProps.customContext);
    }


    // updating rendering mode
    if (this.props.renderingMode !== nextProps.renderingMode) {
      this.emitter.dispatchRenderingMode(nextProps.renderingMode);
    }

    // trigger changes when assets are changed
    if (this.props.assets !== nextProps.assets) {
      // dispatch new assets through context's emitter
      this.emitter.dispatchAssets(nextProps.assets);
      // update state-stored assets
      // this.setState({ assets: nextProps.assets });/* eslint react/no-unused-state : 0 */
      // if the number of assets is changed it means
      // new entities might be present in the editor.
      // As, for optimizations reasons, draft-js editor does not update
      // its entity map in this case (did not exactly understand why)
      // it has to be forced to re-render itself
      if (
        !this.props.assets || !nextProps.assets ||
        Object.keys(this.props.assets).length !== Object.keys(nextProps.assets).length
      ) {
        // re-rendering after a timeout.
        // not doing that causes the draft editor not to update
        // before a new modification is applied to it
        // this is weird but it works
        setTimeout(() => this.forceRender(nextProps));
      }
    }
    // trigger changes when notes are changed
    if (this.props.notes !== nextProps.notes) {
      // dispatch new notes through context's emitter
      this.emitter.dispatchNotes(nextProps.notes);
      // update state-stored notes
      stateMods = { 
        ...stateMods,
        notes: nextProps.notes
      };/* eslint react/no-unused-state : 0 */
      // if the number of notes is changed it means
      // new entities might be present in the editor.
      // As, for optimizations reasons, draft-js editor does not update
      // its entity map in this case (did not exactly understand why)
      // it has to be forced to re-render itself
      if (
        !this.props.notes || !nextProps.notes ||
        Object.keys(this.props.notes).length !== Object.keys(nextProps.notes).length
      ) {
        // re-rendering after a timeout.
        // not doing that causes the draft editor not to update
        // before a new modification is applied to it
        setTimeout(() => this.forceRender(nextProps));
      }
    }
    // trigger changes when notes are changed
    if (this.props.assetChoiceProps !== nextProps.assetChoiceProps) {
      // dispatch new notes through context's emitter
      this.emitter.dispatchAssetChoiceProps(nextProps.assetChoiceProps);
    }
    // apply state changes
    if (Object.keys(stateMods).length > 0) {
      // console.log('update', nextProps.contentId);
      this.setState(stateMods);
    }
    // console.timeEnd(`editor ${this.props.contentId} receives props`);

  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (
      this.state.readOnly !== nextState.readOnly ||
      this.props.isActive !== nextProps.isActive ||
      this.state.styles !== nextState.styles ||
      this.state.editorState !== nextProps.editorState ||
      this.props.editorState !== nextProps.editorState ||
      this.props.assetRequestPosition !== nextProps.assetRequestPosition ||
      this.props.AssetButtonComponent !== nextProps.AssetButtonComponent
    ) {
      return true;
    }
    return false;
  }

  componentWillUpdate = () => {
    // console.time(`rendering ${this.props.contentId}`)
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (!this.state.readOnly) {
      this.updateSelection();
    }
    // console.timeEnd(`rendering ${this.props.contentId}`)
    if (
      /* (
      this.props.editorState !== prevProps.editorState && 
      this.editor &&
      !this.state.readOnly && 
      // this.props.isActive &&
      prevState.readOnly
      )
      ||
      */
      (prevState.readOnly && !this.state.readOnly)
    ) {
      // draft triggers an unwanted onChange event when focusing
      this.setState({
        isFocusing: true
      });
      setTimeout(() => {
        if (this && this.editor) {
          this.editor.focus();
          setTimeout(() => 
            this.setState({
              isFocusing: false
            }));
        }
      });
    } 
  }

  /**
   * Handles note addition in a secured and appropriate way
   */
  onNoteAdd = () => {
    if (typeof this.props.onNoteAdd === 'function') {
      this.props.onNoteAdd();
    }
    if (typeof this.props.onEditorChange === 'function') {
      setTimeout(() => {
        this.props.onEditorChange(this.props.editorState);        
      }, 1);
    }
  }

  /**
   * Locks draft js editor when an asset is focused
   * @param {object} event - the input event
   */
  onAssetFocus = (event) => {
    event.stopPropagation();
    this.setState({
      readOnly: true
    });
  }

  /**
   * Unlocks draft js editor when an asset is unfocused
   * @param {object} event - the input event
   */
  onAssetBlur = (event) => {
    event.stopPropagation();
    this.setState({
      readOnly: false
    });
  }

  /**
   * Locks draft js editor and hides the toolbars when editor is blured
   * @param {object} event - the input event
   */
  onBlur = (event) => {
    this.setState({
      readOnly: true,
      styles: {
        inlineToolbar: {
          display: 'none'
        },
        sideToolbar: {
          display: 'none'
        }
      }
    });

    // calls onBlur callbacks if provided
    const { onBlur } = this.props;
    if (typeof onBlur === 'function') {
      onBlur(event);
    }
  };

  /**
   * Locks draft js editor and hides the toolbars when editor is blured
   * @param {object} event - the input event
   */
  onFocus = (event) => {
    event.stopPropagation();

    // calls onBlur callbacks if provided
    const { onFocus } = this.props;

    if (typeof onFocus === 'function') {
      onFocus(event);
    }
  };

  /**
   * Fires onEditorChange callback if provided 
   * @param {ImmutableRecord} editorState - the new editor state
   */
  onChange = (editorState) => {
  // onChange = (editorState, feedUndoStack = true) => {
    // console.log(this.props.contentId, 
    // ' on change', editorState.getSelection().getStartOffset(), 
    // 'is focusing', this.state.isFocusing)
    if (
      typeof this.props.onEditorChange === 'function' && 
      !this.state.readOnly && 
      !this.state.isFocusing
    ) {
      // if (feedUndoStack === true) {
      //   this.feedUndoStack(editorState);
      // }
      this.props.onEditorChange(editorState);
    }
  }

  componentWillUnmout = () => {
    this.debouncedUpdateSelection.cancel();
  }

  /**
   * Stores previous editor states in an undo stack
   * @param {ImmutableRecord} editorState - the input editor state
   */
  // feedUndoStack = (editorState) => {
  //   const {
  //     undoStack
  //   } = this.state;
  //   // max length for undo stack
  //   // todo: store that in props or in a variable
  //   const newUndoStack = undoStack.length > 50 ? 
  //      undoStack.slice(undoStack.length - 50) : undoStack;
  //   this.setState({
  //     undoStack: [
  //       ...newUndoStack,
  //       editorState
  //     ]
  //   });
  // }

  /**
   * Manages relevant state changes and callbacks when undo is called
   */
  undo = () => {
    // const {
    //   undoStack,
    //   redoStack
    // } = this.state;
    // const newUndoStack = [...undoStack];
    // if (undoStack.length > 1) {
    //   const last = newUndoStack.pop();
    //   this.setState({
    //     redoStack: [
    //       ...redoStack,
    //       last
    //     ],
    //     undoStack: newUndoStack
    //   });
    //   this.onChange(newUndoStack[newUndoStack.length - 1], false);
    //   // draft-js won't notice the change of editorState
    //   // so we have to force it to re-render after having received
    //   // the new editorStaten
    //   setTimeout(() => this.forceRender(this.props));
    // }
    this.onChange(EditorState.undo(this.props.editorState), false);
    // draft-js won't notice the change of editorState
    // so we have to force it to re-render after having received
    // the new editorState
    setTimeout(() => this.forceRender(this.props));

  }

  /**
   * Manages relevant state changes and callbacks when redo is called
   */
  redo = () => {
    // const {
    //   undoStack,
    //   redoStack
    // } = this.state;
    // const newRedoStack = [...redoStack];
    // if (redoStack.length) {
    //   const last = newRedoStack.pop();
    //   this.setState({
    //     undoStack: [
    //       ...undoStack,
    //       last
    //     ],
    //     redoStack: newRedoStack
    //   });
    //   this.onChange(last);
    // }
    this.onChange(EditorState.redo(this.props.editorState), false);
    setTimeout(() => this.forceRender(this.props));
  }

  /**
   * tricks draftJs editor component by forcing it to re-render
   * without changing anything to its state.
   * To do so editor state is recreated with a different selection's reference, which makes
   * a new editorState object and related js reference, therefore forcing the component
   * to render in the render() method
   * @params {object} props - the component's props to manipulate
   */
  forceRender = (props) => {
    const editorState = props.editorState || this.state.editorState || this.generateEmptyEditor();
    const prevSelection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const newEditorState = EditorState.createWithContent(content, this.createDecorator());
    let selectedEditorState;
    // we try to overcome the following error in firefox : https://bugzilla.mozilla.org/show_bug.cgi?id=921444
    // which is related to this draft code part : https://github.com/facebook/draft-js/blob/8de2db9e9e99dea7f4db69f3d8e542df7e60cdda/src/component/selection/setDraftEditorSelection.js#L257
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > 0) {
      selectedEditorState = EditorState.acceptSelection(
        newEditorState, 
        prevSelection
      );
    } else {
      selectedEditorState = EditorState.forceSelection(
        newEditorState, 
        prevSelection
      );
    }
    const inlineStyle = this.state.editorState.getCurrentInlineStyle();
    selectedEditorState = EditorState.setInlineStyleOverride(selectedEditorState, inlineStyle);
    this.setState({ 
      editorState: selectedEditorState,
    });
      
  }

  /**
   * Custom draft-js renderer handling atomic blocks with library's BlockAssetContainer component
   * and user-provided assets components
   * @param {ImmutableRecord} contentBlock - the content block to render
   */
  _blockRenderer = (contentBlock) => {
    const type = contentBlock.getType();
    
    if (type === 'atomic') {
      const entityKey = contentBlock.getEntityAt(0);
      const contentState = this.state.editorState.getCurrentContent();
      let data;
      try {
        data = contentState.getEntity(entityKey).toJS();
      } catch (error) {
        return undefined;
      }
      const id = data && data.data && data.data.asset && data.data.asset.id;
      const asset = this.props.assets[id];
      if (!asset) {
        return;
      }
      const { blockAssetComponents, renderingMode } = this.props;
      const AssetComponent = blockAssetComponents[asset.type] || <div />;

      if (asset) {
        return {/* eslint consistent-return:0 */
          component: BlockAssetContainer,
          editable: false,
          props: {
            renderingMode,
            assetId: id,
            AssetComponent,
          },
        };
      }
    }
  }

  /**
   * Binds custom key commands to editorState commands
   * @param {object} event - the key event
   * @return {string} operation - the command to perform
   */
  _defaultKeyBindingFn = (event) => {
    if (event && hasCommandModifier(event)) {
      switch (event.keyCode) {
      // `m`
      case 77:
        return 'add-note';
        // `z`
      case 90:
        return 'editor-undo';
        // `y`
      case 89:
        return 'editor-redo';
        // `l`
      case 76:
        return 'summon-asset';

      default:
        break;
      }
    }
    return getDefaultKeyBinding(event);
  }

  /**
   * Handles component's custom command
   * @param {string} command - the command input to change the editor state
   * @param {string} handled - whether the command has been handled or not
   */
  _handleKeyCommand = (command) => {
    if (command === 'add-note' && this.props.allowNotesInsertion && typeof this.props.onNoteAdd === 'function') {
      this.onNoteAdd();
      return 'handled';
    } else if (command === 'editor-undo') {
      this.undo();
    } else if (command === 'editor-redo') {
      this.redo();
    } else if (command === 'summon-asset') {
      this.props.onAssetRequest();
    // this is a workaround for a corner case
    // when an inline entity containing html contents is placed at the end of block
    // draft-js seems to be confused concerning the selection offset
    // when hitting backspace in that solution
    // @todo see in future versions of draft-js if the problem is solved
    } else if (command === 'backspace') {
      const editorState = this.props.editorState;
      const selection = this.props.editorState.getSelection();
      const contentState = editorState.getCurrentContent();
      if (selection.isCollapsed()) {
        const selectedBlockKey = selection.getStartKey();
        const selectionOffset = selection.getStartOffset();
        const selectedBlock = contentState.getBlockForKey(selectedBlockKey);
        const selectedBlockLength = selectedBlock.getLength();
        // check of the selection offset returned by draft
        // is greater than selected block length (which should be impossible)
        if (selectionOffset > selectedBlockLength) {
          // remove entity mention from the last character of the real block
          const cleaningSelection = selection.merge({
            anchorOffset: selectedBlockLength - 1,
            focusOffset: selectedBlockLength
          });
          const newContentState = Modifier.applyEntity(
            contentState,
            cleaningSelection,
            null
          );
          const updatedEditorState = EditorState.push(editorState, newContentState, 'remove-entity');
          // update selection
          const newEditorState = EditorState.forceSelection(
            updatedEditorState,
            cleaningSelection.merge({
              focusOffset: selectedBlockLength - 1
            })
          );
          this.onChange(newEditorState);
          return 'handled';
        }
      }

    }
    const { editorState } = this.props;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  /**
   * Draft-js event hook triggered before every key event
   * @param {string} character - the character input through the key event
   */
  _handleBeforeInput = (character) => {
    // todo : make that feature more subtle and customizable through props
    // if (character === '@') {
    //   this.props.onAssetRequest();
    //   return 'handled';
    // }
    if (character !== ' ') {
      return 'not-handled';
    }
    const { editorState } = this.props;
    const newEditorState = checkCharacterForState(editorState, character);
    if (editorState !== newEditorState) {
      this.onChange(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  }

  /**
   * Handles tab hit
   * @param {obj} ev - the key event
   * @param {string} handled - whether the command has been handled or not
   */
  _onTab = (ev) => {
    const { editorState } = this.props;
    const newEditorState = adjustBlockDepth(editorState, ev);
    if (newEditorState !== editorState) {
      this.onChange(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  }
  /**
   * Handles return hit
   * @param {obj} ev - the key event
   * @param {string} handled - whether the command has been handled or not
   */
  _handleReturn = (ev) => {
    const { editorState } = this.props;
    const newEditorState = checkReturnForState(editorState, ev);
    if (editorState !== newEditorState) {
      this.onChange(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  }
  /**
   * Handles drop on component
   * @param {ImmutableRecord} sel - the selection on which the drop is set
   * @param {object} dataTransfer - the js dataTransfer object storing data about the drop
   * @param {boolean} isInternal - whether the drop is draft-to-draft or exterior-to-draft
   */
  _handleDrop = (sel, dataTransfer, isInternal) => {
    const payload = dataTransfer.data.getData('text');
    // Set timeout to allow cursor/selection to move to drop location before calling back onDrop
    setTimeout(() => {
      const selection = this.props.editorState.getSelection();
      let anchorOffset = selection.getEndOffset() - payload.length;
      anchorOffset = anchorOffset < 0 ? 0 : anchorOffset;
      const payloadSel = selection.merge({
        anchorOffset
      });

      const newContentState = Modifier.replaceText(
        this.props.editorState.getCurrentContent(),
        payloadSel,
        ' '
      );
      const newEditorState = EditorState.createWithContent(newContentState, this.createDecorator());
      this.onChange(newEditorState);
      if (typeof this.props.onDrop === 'function') {
        this.props.onDrop(payload, selection);
        setTimeout(() => {
          this.forceRender(this.props);
        });
      }
    }, 1);
    return false;
  }

  /**
   * Handles when a dragged object is dragged over the component
   * @param {obj} ev - the key event
   * @param {bool} handled - whether is handled
   */
  _handleDragOver = (event) => {
    if (this.state.readOnly) {
      this.setState({
        readOnly: false
      });
    }
    event.preventDefault();
    if (typeof this.props.onDragOver === 'function') {
      this.props.onDragOver(event);
    }
    return false;
  }

  /**
   * Handles paste command
   * @param {string} text - the text representation of pasted content
   * @param {string} html - the html representation of pasted content
   */
  _handlePastedText = (text, html) => {
    if (typeof this.props.handlePastedText === 'function') {
      return this.props.handlePastedText(text, html);
    }
    return false;
  }
  /**
   * Draft.js strategy for finding inline assets and loading them with relevant props
   * @param {ImmutableRecord} contentBlock - the content block in which entities are searched
   * @param {function} callback - callback with arguments (startRange, endRange, props to pass)
   * @param {ImmutableRecord} inputContentState - the content state to parse
   */
  findInlineAsset = (contentBlock, callback, inputContentState) => {
    let contentState = inputContentState;
    if (contentState === undefined) {
      if (!this.props.editorState) {
        return callback(null);
      }
      contentState = this.props.editorState.getCurrentContent();
    }
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === INLINE_ASSET
        );
      },
      (start, end) => {
        const {
          assets,
          renderingMode,
          inlineAssetComponents: components
        } = this.props;

        const entityKey = contentBlock.getEntityAt(start);
        const data = contentState.getEntity(entityKey).toJS();
        const id = data && data.data && data.data.asset && data.data.asset.id;
        const asset = assets[id];
        const AssetComponent = asset && components[asset.type] ? 
          components[asset.type] 
          : () => (<span />);

        let props = {};
        if (id) {
          props = {
            assetId: id,
            renderingMode,
            AssetComponent,
          };
        }
        callback(start, end, props);
      }
    );
  }
  /**
   * Draft.js strategy for finding inline note pointers and loading them with relevant props
   * @param {ImmutableRecord} contentBlock - the content block in which entities are searched
   * @param {function} callback - callback with arguments (startRange, endRange, props to pass)
   * @param {ImmutableRecord} inputContentState - the content state to parse
   */
  findNotePointer = (contentBlock, callback, inputContentState) => {
    let contentState = inputContentState;
    if (contentState === undefined) {
      if (!this.props.editorState) {
        return callback(null);
      }
      contentState = this.props.editorState.getCurrentContent();
    }
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === NOTE_POINTER
        );
      },
      (start, end) => {
        const entityKey = contentBlock.getEntityAt(start);
        const data = contentState.getEntity(entityKey).toJS();

        const props = {
          ...data.data,
        };
        callback(start, end, props);
      }
    );
  }
  /**
   * Draft.js strategy for finding quotes statements
   * @param {ImmutableRecord} contentBlock - the content block in which entities are searched
   * @param {function} callback - callback with arguments (startRange, endRange, props to pass)
   * @param {ImmutableRecord} inputContentState - the content state to parse
   */
  // todo: improve with all lang./typography 
  // quotes configurations (french quotes, english quotes, ...)
  findQuotes = (contentBlock, callback, contentState) => {
    const QUOTE_REGEX = /("[^"]+")/gi;
    this.findWithRegex(QUOTE_REGEX, contentBlock, callback);
  }

  /**
   * Util for Draft.js strategies building
   */
  findWithRegex = (regex, contentBlock, callback) => {
    const text = contentBlock.getText();
    let matchArr;
    let start;
    while ((matchArr = regex.exec(text)) !== null) {
      start = matchArr.index;
      callback(start, start + matchArr[0].length);
    }
  }


  generateEmptyEditor = () => EditorState.createEmpty(this.createDecorator())

  createDecorator = () => {
    const ActiveNotePointer = this.props.NotePointerComponent || NotePointer;
    return new MultiDecorator([
      new SimpleDecorator(this.findInlineAsset, InlineAssetContainer),
      new SimpleDecorator(this.findNotePointer, ActiveNotePointer),
      new SimpleDecorator(this.findQuotes, QuoteContainer),
      ...(this.props.inlineEntities || []).map(entity =>
        new SimpleDecorator(entity.strategy, entity.component))
    ]);
  }

  /**
   * updates the positions of toolbars relatively to current draft selection
   */
  updateSelection = () => {
    if (!(this.props.isRequestingAssets || this.props.isActive) && this.state.styles.sideToolbar.display !== 'none') {
      this.setState({
        styles: {
          sideToolbar: { display: 'none' },
          inlineToolbar: { display: 'none' }
        }
      });
      return;
    }
    let left;
    let sideToolbarTop;

    const selectionRange = getSelectionRange();
    
    const editorEle = this.editor;

    const styles = {
      sideToolbar: {
        ...this.state.styles.sideToolbar
      },
      inlineToolbar: {
        ...this.state.styles.inlineToolbar
      },
    };

    if (!selectionRange) return;

    if (
      !editorEle 
      || !isParentOf(selectionRange.commonAncestorContainer, editorEle.editor)
    ) { 
      return; 
    }

    const {
      assetRequestPosition
    } = this.props;


    const sideToolbarEle = this.sideToolbar.toolbar;
    const inlineToolbarEle = this.inlineToolbar.toolbar;


    if (!sideToolbarEle) {
      return;
    }

    const rangeBounds = selectionRange.getBoundingClientRect();

    const selectedBlock = getSelectedBlockElement(selectionRange);
    if (selectedBlock && this.props.isActive) {
      const blockBounds = selectedBlock.getBoundingClientRect();
      const editorNode = this.editor && this.editor.editor;
      const editorBounds = editorNode.getBoundingClientRect();
      // const { editorBounds } = this.state;
      if (!editorBounds) return;
      sideToolbarTop = rangeBounds.top || blockBounds.top;
      styles.sideToolbar.top = sideToolbarTop; // `${sideToolbarTop}px`;
      // position at begining of the line if no asset requested or block asset requested
      // else position after selection
      const controlWidth = sideToolbarEle.offsetWidth || 50;
      left = assetRequestPosition ? 
        (rangeBounds.right || editorBounds.left) + controlWidth 
        : editorBounds.left - controlWidth;
      styles.sideToolbar.left = left;
      styles.sideToolbar.display = 'block';

      if (!selectionRange.collapsed) {
        const inlineToolbarWidth = inlineToolbarEle.offsetWidth || 200;

        styles.inlineToolbar.position = 'fixed';
        styles.inlineToolbar.display = 'block';
        let startNode = selectionRange.startContainer;
        while (startNode.nodeType === 3) {
          startNode = startNode.parentNode;
        }
        const popTop = rangeBounds.top - popoverSpacing;
        left = rangeBounds.left - (inlineToolbarWidth / 2);/* eslint prefer-destructuring:0 */
        // prevent inline toolbar collapse
        // left = left + inlineToolbarWidth / 2  > 
        // editorBounds.right ? editorBounds.right - inlineToolbarWidth : left;
        if (left + (inlineToolbarWidth * 1.2) < editorBounds.right) {
          styles.inlineToolbar.left = left;
          styles.inlineToolbar.right = 'unset';
        } else {
          styles.inlineToolbar.right = 0;
          styles.inlineToolbar.left = 'unset';
        }
        styles.inlineToolbar.top = popTop;
      } else {
        styles.inlineToolbar.display = 'none';
      }
    } else if (!this.props.isRequestingAssets) {
      styles.sideToolbar.display = 'none';
      styles.inlineToolbar.display = 'none';
    }


    if (JSON.stringify(styles) !== JSON.stringify(this.state.styles)) {
      this.setState({
        styles
      });
    }    
  }

  /*
   * Triggers component focus
   * @param {event} object - the input event
   */
  focus = (event) => {

    setTimeout(() => {
      if (!this.state.readOnly) {
        console.log('focusing on editor');
        this.editor.focus();
      }
    });

  };

  /**
   * Renders the component
   * @return {ReactMarkup} component - the component as react markup
   */
  render = () => {
    // props
    const {
      editorState = this.generateEmptyEditor(),
      editorClass = 'scholar-draft-BasicEditor',

      contentId,

      editorPlaceholder = 'write your text',

      allowNotesInsertion = false,
      allowInlineAsset = true,
      allowBlockAsset = true,

      onAssetRequest: onAssetRequestUpstream,
      assetRequestPosition,
      // isRequestingAssets,

      onAssetRequestCancel,
      onAssetChoice,

      editorStyle,

      onClick,

      AssetChoiceComponent,
      assetChoiceProps,

      AssetButtonComponent,
      NoteButtonComponent,

      BibliographyComponent,

      isActive,

      inlineButtons,

      ...otherProps
    } = this.props;

    const messages = {
      addNote: 
          this.props.messages && 
          this.props.messages.addNote ? 
            this.props.messages.addNote : 
            'add a note (shortcut: "cmd + m")',
      summonAsset: 
          this.props.messages && 
          this.props.messages.summonAsset ? 
            this.props.messages.summonAsset :
            'add an asset (shortcut: "@")',
      cancel: 
          this.props.messages 
          && this.props.messages.cancel ? 
            this.props.messages.cancel 
            : 'cancel',
    };

    // internal state
    const {
      // dedicated to draft editor focus management
      readOnly,
      // needed for conserving editor selection state in specific situations
      editorState: stateEditorState,
      // inner styles used for toolbars
      styles,
    } = this.state;

    // class functions
    const {
      _handleKeyCommand,
      _handleBeforeInput,
      _blockRenderer,
      _handleReturn,
      _onTab,
      _handleDrop,
      _handleDragOver,
      _handlePastedText,
      onChange,
      onNoteAdd,
      _defaultKeyBindingFn,
    } = this;

    // console.time(`preparing rendering ${contentId}`)


    /**
     * Functions handling draft editor locking/unlocking
     * and callbacks related to inline asset choices with asset choice component
     */

    // locking draft-js editor when asset choice component is summoned
    const onAssetRequest = (selection) => {
      if (typeof onAssetRequestUpstream === 'function') {
        onAssetRequestUpstream(selection);
        this.setState({
          readOnly: true
        });
      }
    };

    // unlocking draft-js editor when clicked
    const onMainClick = (event) => {
      event.stopPropagation();
      const stateMods = {};
      if (typeof onClick === 'function') {
        onClick(event);
      }
      if (this.state.readOnly) {
        const coordinates = {
          clientX: event.clientX, 
          clientY: event.clientY, 
          el: event.target,
          pageX: event.pageX,
          pageY: event.pageY,
        };
        stateMods.lastClickCoordinates = coordinates;
      }
      if (this.props.isActive && this.state.readOnly) {
        stateMods.readOnly = false;
      }
      if (Object.keys(stateMods).length > 0) {
        this.setState(stateMods);
      }
      // this.focus(event);
    };

    // locking draft-js editor when user interacts with asset-choice component
    const onAssetChoiceFocus = () => {
      this.setState({
        readOnly: true
      });
    };

    // unlocking draft-js editor when asset choice is abandonned
    const onOnAssetRequestCancel = () => {
      onAssetRequestCancel();


      this.forceRender(this.props);

      this.setState({
        readOnly: false
      });
    };

    // unlocking draft-js editor when asset is choosen
    const onOnAssetChoice = (asset) => {
      onAssetChoice(asset);
      // this.setState({
      //   readOnly: false
      // });
    };

    /**
     * component bindings and final props definitions
     */

    const realEditorState = editorState 
      || this.generateEmptyEditor(); /* eslint no-unused-vars : 0 */
    
    const bindEditorRef = (editor) => {
      this.editor = editor;
    };
    const bindSideToolbarRef = (sideToolbar) => {
      this.sideToolbar = sideToolbar;
    };

    const bindInlineToolbar = (inlineToolbar) => {
      this.inlineToolbar = inlineToolbar;
    };

    // key binding can be provided through props
    const keyBindingFn = typeof this.props.keyBindingFn === 'function' ? this.props.keyBindingFn : _defaultKeyBindingFn;
    // props-provided iconMap can be merged with defaultIconMap for displaying custom icons
    const iconMap = this.props.iconMap ? 
      {
        ...defaultIconMap,
        ...this.props.iconMap
      } : defaultIconMap;

    // console.timeEnd(`preparing rendering ${contentId}`)
    // console.log(this.props.contentId, 
    // 'render with selection', stateEditorState.getSelection().getStartOffset());
    return (
      <div 
        className={editorClass + (readOnly ? '' : ' active')}
        onClick={onMainClick}
        style={editorStyle}

        onDragOver={_handleDragOver}
      >
        <InlineToolbar
          ref={bindInlineToolbar}
          buttons={inlineButtons}
          editorState={stateEditorState}
          updateEditorState={onChange}
          iconMap={iconMap}
          style={styles.inlineToolbar}
        />
        <SideToolbar
          ref={bindSideToolbarRef}

          allowAssets={{
            inline: allowInlineAsset,
            block: allowBlockAsset
          }}
          allowNotesInsertion={allowNotesInsertion}

          style={styles.sideToolbar}

          onAssetRequest={onAssetRequest}
          onAssetRequestCancel={onOnAssetRequestCancel}
          onAssetChoice={onOnAssetChoice}
          assetRequestPosition={assetRequestPosition}
          assetChoiceProps={assetChoiceProps}
          onAssetChoiceFocus={onAssetChoiceFocus}

          AssetChoiceComponent={AssetChoiceComponent}
          AssetButtonComponent={AssetButtonComponent}
          NoteButtonComponent={NoteButtonComponent}
          iconMap={iconMap}

          messages={messages}

          contentId={contentId}

          onNoteAdd={onNoteAdd}
        />
        <Editor
          editorState={stateEditorState}
          onChange={onChange}

          blockRendererFn={_blockRenderer}
          spellCheck
          readOnly={isActive ? readOnly : true}
          placeholder={editorPlaceholder}

          keyBindingFn={keyBindingFn}

          handlePastedText={_handlePastedText}
          handleKeyCommand={_handleKeyCommand}
          handleBeforeInput={_handleBeforeInput}
          handleReturn={_handleReturn}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onTab={_onTab}


          handleDrop={_handleDrop}

          ref={bindEditorRef}

          {...otherProps}
        />
        { 
          BibliographyComponent && <BibliographyComponent /> 
        }
      </div>
    );
  }
}
