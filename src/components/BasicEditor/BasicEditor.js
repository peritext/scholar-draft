import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { debounce } from 'lodash';

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

import adjustBlockDepth from '../../modifiers/adjustBlockDepth';
import handleBlockType from '../../modifiers/handleBlockType';
import handleInlineStyle from '../../modifiers/handleInlineStyle';
import handleNewCodeBlock from '../../modifiers/handleNewCodeBlock';
import insertEmptyBlock from '../../modifiers/insertEmptyBlock';
// import handleLink from '../../modifiers/handleLink';
// import handleImage from '../../modifiers/handleImage';
import leaveList from '../../modifiers/leaveList';
import insertText from '../../modifiers/insertText';
// import createLinkDecorator from './decorators/link';
// import createImageDecorator from './decorators/image';
// import { 
//   // addText, 
//   addEmptyBlock 
// } from '../../utils';


import {
  INLINE_ASSET,
  NOTE_POINTER
} from '../../constants';

import SideToolbar from '../SideToolbar/SideToolbar';
import InlineToolbar from '../InlineToolbar/InlineToolbar';

import InlineAssetContainer from '../InlineAssetContainer/InlineAssetContainer';
import BlockAssetContainer from '../BlockAssetContainer/BlockAssetContainer';
import QuoteContainer from '../QuoteContainer/QuoteContainer';
import NotePointer from '../NotePointer/NotePointer';

import defaultIconMap from '../../icons/defaultIconMap';

import './BasicEditor.scss';


const { hasCommandModifier } = KeyBindingUtil;


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

const getSelectionRange = () => {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  return selection.getRangeAt(0);
};

const isParentOf = (inputEle, maybeParent) => {
  let ele = inputEle;
  while (ele.parentNode != null && ele.parentNode != document.body) { /* eslint eqeqeq:0 */
    if (ele.parentNode === maybeParent) return true;
    ele = ele.parentNode;
  }
  return false;
};

const popoverSpacing = 50;


function checkCharacterForState(editorState, character) {
  let newEditorState = handleBlockType(editorState, character);
  // this is commented because links and images should be handled upstream as resources
  // if (editorState === newEditorState) {
  //   newEditorState = handleImage(editorState, character);
  // }
  // if (editorState === newEditorState) {
  //   newEditorState = handleLink(editorState, character);
  // }
  if (editorState === newEditorState) {
    newEditorState = handleInlineStyle(editorState, character);
  }
  return newEditorState;
}

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


export default class BasicEditor extends Component {

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
    onNotePointerMouseClick: PropTypes.func,
    onNotePointerMouseOver: PropTypes.func,
    onNotePointerMouseOut: PropTypes.func,
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


  static defaultProps = {
    blockAssetComponents: {},
  };

  constructor(props) {
    super(props);
    // this.onChange = debounce(this.onChange, 200);
    this.debouncedUpdateSelection = debounce(this.updateSelection, 100);
    this.forceRenderDebounced = debounce(this.forceRender, 200);

    this.feedUndoStack = debounce(this.feedUndoStack, 1000);
  }


  state = {
    editorState: EditorState.createEmpty(),
    undoStack: [],
    redoStack: []
  };

  componentWillReceiveProps = (nextProps) => {
    // console.log('receiving asset request position', nextProps.assetRequestPosition);
    // console.log('readonlies', this.props.readOnly, nextProps.readOnly);
    if (!this.props.readOnly && nextProps.readOnly) {
      this.inlineToolbar.toolbar.style.display = 'none';
      if (!nextProps.assetRequestPosition) {
        this.sideControl.toolbar.style.display = 'none';
      }
      // console.log('hide side control', this.sideControl.toolbar.style.display);
    }
    if (this.state.readOnly !== nextProps.readOnly) {
      this.setState({
        readOnly: nextProps.readOnly
      });
      setTimeout(() => this.updateSelection());
    }
    if (this.state.editorState !== nextProps.editorState) {
      this.setState({
        editorState: nextProps.editorState || EditorState.createEmpty(this.createDecorator())
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      // !nextProps.readOnly ||
      this.state.editorState !== nextProps.editorState ||
      this.state.assets !== nextProps.assets
    ) {
      return true;
    }
  }

  componentDidUpdate(prevProps) {
    this.debouncedUpdateSelection();
    // force render of inline and atomic block elements
    const {
      // forceRenderDebounced,
      forceRender
    } = this;

    if (
      this.props.editorState !== prevProps.editorState 
      || prevProps.assets !== this.props.assets
      || prevProps.readOnly !== this.props.readOnly
      || prevProps.notes !== this.props.notes
    ) {
      forceRender(this.props);
    }

    if (
      this.props.editorState !== prevProps.editorState && 
      this.editor
    ) {
      this.editor.focus();
    }
  }

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

  onAssetFocus = (event) => {
    event.stopPropagation();
    this.setState({
      readOnly: true
    });
  }

  onInputBlur = (event) => {
    event.stopPropagation();
    this.setState({
      readOnly: false
    });
  }

  onBlur = (event) => {
    if (this.inlineToolbar) {
      this.inlineToolbar.toolbar.display = 'none';
    }
    if (this.sideControl) {
      this.sideControl.toolbar.display = 'none';
    }

    this.setState({
      readOnly: true
    });

    const { onBlur } = this.props;
    if (onBlur) {
      onBlur(event);
    }
  };

  onChange = (editorState) => {
    if (typeof this.props.onEditorChange === 'function' && !this.props.readOnly) {
      this.props.onEditorChange(editorState);
    }
  }

  feedUndoStack = (editorState) => {
    const {
      undoStack
    } = this.state;
    // max length for undo stack
    const newUndoStack = undoStack.length > 50 ? undoStack.slice(undoStack.length - 50) : undoStack;
    this.setState({
      undoStack: [
        ...newUndoStack,
        editorState
      ]
    });
  }

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
      this.onChange(newUndoStack[newUndoStack.length - 1]);
    }
  }

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

  forceRender = (props) => {
    const editorState = props.editorState || this.generateEmptyEditor();
    const content = editorState.getCurrentContent();

    const newEditorState = EditorState.createWithContent(content, this.createDecorator());

    const inlineStyle = this.state.editorState.getCurrentInlineStyle();
    let selectedEditorState = EditorState.acceptSelection(
      newEditorState, 
      editorState.getSelection()
    );
    selectedEditorState = EditorState.setInlineStyleOverride(selectedEditorState, inlineStyle);

    this.feedUndoStack(this.state.editorState);
    this.setState({ 
      editorState: selectedEditorState,
    });
  }


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
      const {
        onAssetChange: onChange,
        onAssetMouseOver: onMouseOver,
        onAssetMouseOut: onMouseOut,
        iconMap
      } = this.props;

      const {
        onAssetFocus: onFocus,
        onInputBlur: onBlur
      } = this;
      if (asset) {
        return {/* eslint consistent-return:0 */
          component: BlockAssetContainer,
          editable: false,
          props: {
            assetId: id,
            asset,
            onFocus,
            onBlur,
            onChange,
            onMouseOver,
            onMouseOut,
            AssetComponent,
            iconMap
          },
        };
      }
    }
  }

  defaultKeyBindingFn = (event) => {
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

  _handleBeforeInput = (character, props) => {
    // todo : make that feature more subtle
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

  _onTab = (ev) => {
    const editorState = this.props.editorState;
    const newEditorState = adjustBlockDepth(editorState, ev);
    if (newEditorState !== editorState) {
      this.onChange(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  }
  _handleReturn = (ev) => {
    const editorState = this.props.editorState;
    const newEditorState = checkReturnForState(editorState, ev);
    if (editorState !== newEditorState) {
      this.onChange(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  }

  _handleDrop = (sel, dataTransfer, isInternal) => {
    const payload = dataTransfer.data.getData('text');
    // Set timeout to allow cursor/selection to move to drop location
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
      this.onChange(EditorState.createWithContent(newContentState));
      if (typeof this.props.onDrop === 'function') {
        this.props.onDrop(payload, selection);
      }
    }, 1);
    return false;
  }

  _handleDragOver = (event) => {
    event.preventDefault();
    if (typeof this.props.onDragOver === 'function') {
      this.props.onDragOver(event);
    }
    return false;
  }

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

  findInlineAsset = (contentBlock, callback, inputContentState) => {
    let contentState = inputContentState;
    if (!this.props.editorState) {
      callback(null);
    }
    if (contentState === undefined) {
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
          onAssetMouseOver: onMouseOver,
          onAssetMouseOut: onMouseOut,
          onAssetChange,
          inlineAssetComponents: components
        } = this.props;

        const {
          onAssetFocus: onFocus,
          onInputBlur: onBlur
        } = this;
        const entityKey = contentBlock.getEntityAt(start);
        const data = this.state.editorState.getCurrentContent().getEntity(entityKey).toJS();
        const id = data.data.asset.id;
        const asset = assets[id];
        let props = {};
        if (asset) {
          props = {
            assetId: id,
            asset,
            onMouseOver,
            onMouseOut,
            components,
            onChange: onAssetChange,
            onFocus,
            onBlur
          };
        }
        callback(start, end, props);
      }
    );
  }

  findNotePointers = (contentBlock, callback, inputContentState) => {
    let contentState = inputContentState;
    if (contentState === undefined) {
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
        const data = this.state.editorState.getCurrentContent().getEntity(entityKey).toJS();
        const noteId = data.data.noteId;
        const onMouseOver = (event) => {
          if (typeof this.props.onNotePointerMouseOver === 'function') {
            this.props.onNotePointerMouseOver(noteId, event);
          }
        };
        const onMouseOut = (event) => {
          if (typeof this.props.onNotePointerMouseOut === 'function') {
            this.props.onNotePointerMouseOut(noteId, event);
          }
        };
        const onMouseClick = (event) => {
          if (typeof this.props.onNotePointerMouseClick === 'function') {
            this.props.onNotePointerMouseClick(noteId, event);
          }
        };
        const note = this.props.notes && this.props.notes[noteId];
        const props = {
          ...data.data,
          note,
          onMouseOver,
          onMouseOut,
          onMouseClick
        };
        callback(start, end, props);
      }
    );
  }

  findQuotes = (contentBlock, callback, contentState) => {
    const QUOTE_REGEX = /("[^"]+")/gi;
    this.findWithRegex(QUOTE_REGEX, contentBlock, callback);
  }

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
      new SimpleDecorator(this.findNotePointers, ActiveNotePointer),
      new SimpleDecorator(this.findQuotes, QuoteContainer),
    ]);
  }

  // todo: clean this function from all unnecessary things
  updateSelection = () => {
    let left;
    let sideControlTop;

    const selectionRange = getSelectionRange();
    
    const editorEle = this.editor;

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

    const inlineToolbarEle = this.inlineToolbar.toolbar;
    const sideControlEle = this.sideControl.toolbar;
    const rangeBounds = selectionRange.getBoundingClientRect();

    const selectedBlock = getSelectedBlockElement(selectionRange);
    if (selectedBlock) {
      const blockBounds = selectedBlock.getBoundingClientRect();
      const editorBounds = this.state.editorBounds;
      if (!editorBounds) return;
      sideControlTop = rangeBounds.top || blockBounds.top;
      sideControlEle.style.top = `${sideControlTop}px`;
      // position at begining of the line if no asset requested or block asset requested
      // else position after selection
      const controlWidth = sideControlEle.offsetWidth || 50;
      left = assetRequestPosition ? 
        (rangeBounds.right || editorBounds.left) + controlWidth 
        : editorBounds.left - controlWidth;
      sideControlEle.style.left = `${left}px`;
      sideControlEle.style.display = 'block';

      if (!selectionRange.collapsed) {
        // The control needs to be visible so that we can get it's width
        inlineToolbarEle.style.position = 'fixed';
        inlineToolbarEle.style.display = 'block';

        // popoverControlVisible = true;

        // popoverControlLeft = 0;
        let startNode = selectionRange.startContainer;
        while (startNode.nodeType === 3) {
          startNode = startNode.parentNode;
        }
        const popTop = rangeBounds.top /* - editorBounds.top + displaceY */ - popoverSpacing;
        left = rangeBounds.left;
        inlineToolbarEle.style.left = `${left}px`;
        inlineToolbarEle.style.top = `${popTop}px`;
      } else {
        inlineToolbarEle.style.display = 'none';
      }
    } else {
      sideControlEle.style.display = 'none';
      inlineToolbarEle.style.display = 'none';
    }
  }

  focus = (event) => {
    if (this.props.readOnly) return;

    const stateMods = {};
    if (!this.props.readOnly && this.state.readOnly) {
      stateMods.readOnly = true;
    }

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

  render = () => {
    const {
      editorState = EditorState.createEmpty(this.createDecorator()),
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

      // blockAssetComponents,
      // inlineButtons,

      onAssetRequest: onAssetRequestUpstream,
      assetRequestPosition,
      onAssetRequestCancel,
      onAssetChoice,

      editorStyle,

      onClick,

      AssetChoiceComponent,
      assetChoiceProps,

      ...otherProps
    } = this.props;

    const {
      readOnly,
      editorState: stateEditorState
    } = this.state;

    const {
      _handleKeyCommand,
      _handleBeforeInput,
      onChange,
      _blockRenderer,
      _handleReturn,
      _onTab,
      _handleDrop,
      _handleDragOver,
      _handlePastedText,
      onNoteAdd,
      defaultKeyBindingFn
    } = this;

    const realEditorState = editorState || this.generateEmptyEditor();
    
    const bindEditorRef = (editor) => {
      this.editor = editor;
    };
    const bindSideToolbarRef = (sideControl) => {
      this.sideControl = sideControl;
    };

    const bindInlineToolbar = (inlineToolbar) => {
      this.inlineToolbar = inlineToolbar;
    };


    const onAssetRequest = (selection) => {
      if (typeof onAssetRequestUpstream === 'function') {
        onAssetRequestUpstream(selection);
      }
    };

    const onMainClick = (event) => {
      if (typeof onClick === 'function') {
        onClick(event);
      }
      this.focus(event);
    };

    const keyBindingFn = typeof this.props.keyBindingFn === 'function' ? this.props.keyBindingFn : defaultKeyBindingFn;
    const iconMap = this.props.iconMap ? this.props.iconMap : defaultIconMap;
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
        />
        <SideToolbar
          ref={bindSideToolbarRef}

          allowAssets={{
            inline: allowInlineAsset,
            block: allowBlockAsset
          }}
          allowNotesInsertion={allowNotesInsertion}

          onAssetRequest={onAssetRequest}
          onAssetRequestCancel={onAssetRequestCancel}
          onAssetChoice={onAssetChoice}
          assetRequestPosition={assetRequestPosition}
          assetChoiceProps={assetChoiceProps}

          AssetChoiceComponent={AssetChoiceComponent}
          iconMap={iconMap}

          messages={messages}

          contentId={contentId}

          onNoteAdd={onNoteAdd}
        />
        <Editor
          blockRendererFn={_blockRenderer}
          spellCheck
          readOnly={readOnly}
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
