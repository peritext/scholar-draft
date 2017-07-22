/**
 * This module exports a component representing a single draft editor
 * with related interface and decorators.
 * Asset components must be provided through props
 * @module scholar-draft/BasicEditor
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { v4 as generateId } from 'uuid';

import { debounce } from 'lodash';

// draft-js EditorState decorators utils
import SimpleDecorator from 'draft-js-simpledecorator';
import MultiDecorator from 'draft-js-multidecorators';

import {
  EditorState,
  KeyBindingUtil,
  getDefaultKeyBinding,
  RichUtils,
  Modifier,
  Editor
} from 'draft-js';

// modifiers helping to modify editorState
import adjustBlockDepth from '../../modifiers/adjustBlockDepth';
import handleBlockType from '../../modifiers/handleBlockType';
import handleInlineStyle from '../../modifiers/handleInlineStyle';
import handleNewCodeBlock from '../../modifiers/handleNewCodeBlock';
import insertEmptyBlock from '../../modifiers/insertEmptyBlock';
import leaveList from '../../modifiers/leaveList';
import insertText from '../../modifiers/insertText';

// constant entities type names
import {
  INLINE_ASSET,
  NOTE_POINTER
} from '../../constants';

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

/**
 * Gets the block element corresponding to a given range of selection
 * @param {object} range - the input range to look in
 * @return {object} node
 */
const getSelectedBlockElement = (range) => {
  let node = range.startContainer;
  do {
    if (
      node.getAttribute && 
      (
        node.getAttribute('data-block') == 'true' ||
        node.getAttribute('data-contents') == 'true'
      )
    ) { 
      return node; 
    }
    node = node.parentNode;
  } while (node != null);
  return null;
};

/**
 * Gets the current window's selection range (start and end)
 * @return {object} selection range
 */
const getSelectionRange = () => {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  return selection.getRangeAt(0);
};

/**
 * Checks if a DOM element is parent of another one
 * @param {inputEle} DOMEl - the presumed child
 * @param {inputEle} DOMEl - the presumed parent
 * @return {boolean} isParent - whether yes or no
 */
const isParentOf = (inputEle, maybeParent) => {
  let ele = inputEle;
  while (ele.parentNode != null && ele.parentNode != document.body) { /* eslint eqeqeq:0 */
    if (ele.parentNode === maybeParent) return true;
    ele = ele.parentNode;
  }
  return false;
};

// todo : store that somewhere else
const popoverSpacing = 50;

/**
 * Handles a character's style
 * @param {ImmutableRecord} editorState - the input editor state
 * @param {ImmutableRecord} character - the character to check
 * @return {ImmutableRecord} newEditorState - the new editor state
 */
function checkCharacterForState(editorState, character) {
  let newEditorState = handleBlockType(editorState, character);
  if (editorState === newEditorState) {
    newEditorState = handleInlineStyle(editorState, character);
  }
  return newEditorState;
}

// todo : this function is a perf bottleneck
/**
 * Resolves return key hit
 * @param {ImmutableRecord} editorState - the input editor state
 * @param {object} ev - the original key event
 * @return {ImmutableRecord} newEditorState - the new editor state
 */
function checkReturnForState(editorState, ev) {
  let newEditorState = editorState;
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const currentBlock = contentState.getBlockForKey(key);
  const type = currentBlock.getType();
  const text = currentBlock.getText();
  if (/-list-item$/.test(type) && text === '') {
    newEditorState = leaveList(editorState);
  }
  if (newEditorState === editorState &&
    (ev.ctrlKey || ev.shiftKey || ev.metaKey || ev.altKey || /^header-/.test(type))) {
    newEditorState = insertEmptyBlock(editorState);
  }
  if (newEditorState === editorState && type === 'code-block') {
    newEditorState = insertText(editorState, '\n');
  }
  if (newEditorState === editorState) {
    newEditorState = handleNewCodeBlock(editorState);
  }

  return newEditorState;
}

/**
 * This class allows to produce event emitters
 * that will be used to dispatch assets changes 
 * and notes changes through context
 */
export class Emitter {
  assetsListeners = new Map()
  notesListeners = new Map()

  subscribeToAssets = (listener) => {
    const id = generateId();
    this.assetsListeners.set(id, listener);
    return () => this.assetsListeners.delete(id);
  }

  subscribeToNotes = (listener) => {
    const id = generateId();
    this.notesListeners.set(id, listener);
    return () => this.notesListeners.delete(id);
  }

  dispatchAssets = (assets) => {
    this.assetsListeners.forEach((listener) => {
      listener(assets);
    });
  }
  dispatchNotes= (notes) => {
    this.notesListeners.forEach((listener) => {
      listener(notes);
    });
  }
}

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
    blockAssetComponents: PropTypes.object,
    assetRequestPosition: PropTypes.object,
    contentId: PropTypes.string,
    messages: PropTypes.object,
    isActive: PropTypes.bool,
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
    onAssetChoice: PropTypes.func,
    onAssetChange: PropTypes.func,
    onAssetRequestCancel: PropTypes.func,
    onNotePointerMouseOver: PropTypes.func,
    onNotePointerMouseOut: PropTypes.func,
    onNotePointerMouseClick: PropTypes.func,
    /*
     * Parametrization props
     */
    editorClass: PropTypes.string,
    editorStyle: PropTypes.object,
    allowNotesInsertion: PropTypes.bool,
    allowInlineAsset: PropTypes.bool,
    allowBlockAsset: PropTypes.bool,
    AssetChoiceComponent: PropTypes.func,
    assetChoiceProps: PropTypes.object,
    keyBindingFn: PropTypes.func,
    inlineButtons: PropTypes.object,
    NotePointerComponent: PropTypes.object,

    placeholder: PropTypes.string,

    iconMap: PropTypes.object,
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
    this.feedUndoStack = debounce(this.feedUndoStack, 1000);
    // it is needed to bind this function right away for being able
    // to initialize the state
    this.generateEmptyEditor = this.generateEmptyEditor.bind(this);

    this.state = {
      // editor state is initialized with a decorated editorState (notes + assets + ...)
      editorState: this.generateEmptyEditor(),
      // editor states undo and redo stacks
      undoStack: [],
      redoStack: [],
      // toolbars styles are represented as css-in-js
      styles: {
        inlineToolbar: {

        },
        sideToolbar: {

        }
      },
      readOnly: true
    };
    // the emitter allows to let custom components know when assets are changed
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

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        readOnly: false
      });
      this.forceRender(this.props);
    });
  }

  componentWillReceiveProps = (nextProps) => {
    // hiding the toolbars when editor is set to inactive
    if (this.props.isActive && !nextProps.isActive) {
      this.setState({
        styles: {
          sideToolbar: {
            display: 'none'
          },
          inlineToolbar: {
            display: 'none',
          }
        },
      });
      // locking the draft-editor if asset choice component is not open
      if (!nextProps.assetRequestPosition) {
        this.setState({
          readOnly: true
        });
      }
    }
    // updating locally stored editorState when the one given by props
    // has changed
    if (this.props.editorState !== nextProps.editorState) {
      this.setState({
        editorState: nextProps.editorState || this.generateEmptyEditor()
      });
    }

    // trigger changes when assets are changed
    if (this.props.assets !== nextProps.assets) {
      // dispatch new assets through context's emitter
      this.emitter.dispatchAssets(nextProps.assets);
      // update state-stored assets
      this.setState({ assets: nextProps.assets });
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
        // setTimeout(() => this.forceRender(nextProps), 500);
      }
    }
    // trigger changes when notes are changed
    if (this.props.notes !== nextProps.notes) {
      // dispatch new notes through context's emitter
      this.emitter.dispatchNotes(nextProps.notes);
      // update state-stored assets
      this.setState({ notes: nextProps.notes });
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
        this.forceRender(nextProps);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
    // if (
    //   this.state.readOnly !== nextState.readOnly ||
    //   this.state.editorState !== nextProps.editorState ||
    //   this.state.assets !== nextProps.assets
    // ) {
    //   return true;
    // }
    // return false;
  }

  componentDidUpdate(prevProps) {
    this.debouncedUpdateSelection();
    if (
      this.props.editorState !== prevProps.editorState && 
      this.editor &&
      !this.state.readOnly && this.props.isActive
    ) {
      this.editor.focus();
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
   * Fires onEditorChange callback if provided 
   * @param {ImmutableRecord} editorState - the new editor state
   */
  onChange = (editorState, feedUndoStack = true) => {
    if (feedUndoStack === true) {
      this.feedUndoStack(editorState);
    }
    if (typeof this.props.onEditorChange === 'function'/* && !this.props.readOnly*/) {
      this.props.onEditorChange(editorState);
    }
  }

  /**
   * Stores previous editor states in an undo stack
   * @param {ImmutableRecord} editorState - the input editor state
   */
  feedUndoStack = (editorState) => {
    const {
      undoStack
    } = this.state;
    // max length for undo stack
    // todo: store that in props or in a variable
    const newUndoStack = undoStack.length > 50 ? undoStack.slice(undoStack.length - 50) : undoStack;
    this.setState({
      undoStack: [
        ...newUndoStack,
        editorState
      ]
    });
  }

  /**
   * Manages relevant state changes and callbacks when undo is called
   */
  undo = () => {
    const {
      undoStack,
      redoStack
    } = this.state;
    const newUndoStack = [...undoStack];
    if (undoStack.length > 1) {
      const last = newUndoStack.pop();
      this.setState({
        redoStack: [
          ...redoStack,
          last
        ],
        undoStack: newUndoStack
      });
      this.onChange(newUndoStack[newUndoStack.length - 1], false);
      // draft-js won't notice the change of editorState
      // so we have to force it to re-render after having received
      // the new editorStaten
      setTimeout(() => this.forceRender(this.props));
    }
  }

  /**
   * Manages relevant state changes and callbacks when redo is called
   */
  redo = () => {
    const {
      undoStack,
      redoStack
    } = this.state;
    const newRedoStack = [...redoStack];
    if (redoStack.length) {
      const last = newRedoStack.pop();
      this.setState({
        undoStack: [
          ...undoStack,
          last
        ],
        redoStack: newRedoStack
      });
      this.onChange(last);
    }
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
    const editorState = props.editorState || this.generateEmptyEditor();
    const content = editorState.getCurrentContent();
    const newEditorState = EditorState.createWithContent(content, this.createDecorator());
    let selectedEditorState = EditorState.acceptSelection(
      newEditorState, 
      editorState.getSelection()
    );
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
      const id = data.data.asset.id;
      const asset = this.props.assets[id];
      if (!asset) {
        return;
      }
      const { blockAssetComponents } = this.props;
      const AssetComponent = blockAssetComponents[asset.type] || <div />;

      if (asset) {
        return {/* eslint consistent-return:0 */
          component: BlockAssetContainer,
          editable: false,
          props: {
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
        // `^`
      case 229:
        return 'add-note';
        // `z`
      case 90:
        return 'editor-undo';
        // `y`
      case 89:
        return 'editor-redo';

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
    if (character === '@') {
      this.props.onAssetRequest();
      return 'handled';
    }
    if (character !== ' ') {
      return 'not-handled';
    }
    const editorState = this.props.editorState;
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
    const editorState = this.props.editorState;
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
    const editorState = this.props.editorState;
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
    setTimeout(() => {
      this.feedUndoStack(this.state.editorState);
    }, 1);

    if (this.props.clipboard) {
      this.editor.setClipboard(null);
      return true;
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
          inlineAssetComponents: components
        } = this.props;

        const entityKey = contentBlock.getEntityAt(start);
        const data = contentState.getEntity(entityKey).toJS();
        const id = data.data.asset.id;
        const asset = assets[id];
        const AssetComponent = asset && components[asset.type] ? 
          components[asset.type] 
          : () => (<div />);

        let props = {};
        if (id) {
          props = {
            assetId: id,
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
    ]);
  }

  /**
   * updates the positions of toolbars relatively to current draft selection
   */
  updateSelection = () => {
    if (!this.props.isActive) {
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
      || !isParentOf(selectionRange.commonAncestorContainer, editorEle.refs.editor)
    ) { 
      return; 
    }

    const {
      assetRequestPosition
    } = this.props;

    const sideToolbarEle = this.sideToolbar.toolbar;

    if (!sideToolbarEle) {
      return;
    }
    const rangeBounds = selectionRange.getBoundingClientRect();

    const selectedBlock = getSelectedBlockElement(selectionRange);
    if (selectedBlock) {
      const blockBounds = selectedBlock.getBoundingClientRect();
      const editorBounds = this.state.editorBounds;
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
        styles.inlineToolbar.position = 'fixed';
        styles.inlineToolbar.display = 'block';
        let startNode = selectionRange.startContainer;
        while (startNode.nodeType === 3) {
          startNode = startNode.parentNode;
        }
        const popTop = rangeBounds.top - popoverSpacing;
        left = rangeBounds.left;
        styles.inlineToolbar.left = left;
        styles.inlineToolbar.top = popTop;
      } else {
        styles.inlineToolbar.display = 'none';
      }
    } else {
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

    const stateMods = {};

    const editorNode = this.editor && this.editor.refs.editor;
    stateMods.editorBounds = editorNode.getBoundingClientRect();

    if (Object.keys(stateMods).length) {
      this.setState(stateMods);
    }

    setTimeout(() => {
      if (!this.state.readOnly) {
        editorNode.focus();
      }
    }, 1);

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

      placeholder = 'write your text',

      allowNotesInsertion = false,
      allowInlineAsset = true,
      allowBlockAsset = true,

      messages = {
        tooltips: {
          addNote: 'add a note (shortcut: "cmd + ^")',
          addAsset: 'add an asset (shortcut: "@")',
          cancel: 'cancel',
        }
      },

      onAssetRequest: onAssetRequestUpstream,
      assetRequestPosition,
      onAssetRequestCancel,
      onAssetChoice,

      editorStyle,

      onClick,

      AssetChoiceComponent,
      assetChoiceProps,

      isActive,

      ...otherProps
    } = this.props;

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
      if (typeof onClick === 'function') {
        onClick(event);
      }
      if (this.state.readOnly) {
        this.setState({
          readOnly: false
        });
      }
      this.focus(event);
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
      this.setState({
        readOnly: false
      });
    };

    // unlocking draft-js editor when asset is choosen
    const onOnAssetChoice = (asset) => {
      onAssetChoice(asset);
      this.setState({
        readOnly: false
      });
    };

    /**
     * component bindings and final props definitions
     */

    const realEditorState = editorState || this.generateEmptyEditor();
    
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
    
    return (
      <div 
        className={editorClass + (readOnly ? '' : ' active')}
        onClick={onMainClick}
        style={editorStyle}

        onDragOver={_handleDragOver}
      >
        <InlineToolbar
          ref={bindInlineToolbar}
          editorState={realEditorState}
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
          iconMap={iconMap}

          messages={messages}

          contentId={contentId}

          onNoteAdd={onNoteAdd}
        />
        <Editor
          blockRendererFn={_blockRenderer}
          spellCheck
          readOnly={isActive ? readOnly : true}
          placeholder={placeholder}

          keyBindingFn={keyBindingFn}

          handlePastedText={_handlePastedText}
          handleKeyCommand={_handleKeyCommand}
          handleBeforeInput={_handleBeforeInput}
          handleReturn={_handleReturn}
          onTab={_onTab}

          editorState={stateEditorState}

          handleDrop={_handleDrop}

          onChange={onChange}
          ref={bindEditorRef}
          onBlur={this.onBlur}

          {...otherProps}
        />
      </div>
    );
  }
}
