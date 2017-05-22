import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Style from 'fbjs/lib/Style.js';

import { debounce } from 'lodash';

import { Map } from 'immutable';

import SimpleDecorator from 'draft-js-simpledecorator';
import MultiDecorator from 'draft-js-multidecorators';

import adjustBlockDepth from '../../modifiers/adjustBlockDepth';
import handleBlockType from '../../modifiers/handleBlockType';
import handleInlineStyle from '../../modifiers/handleInlineStyle';
import handleNewCodeBlock from '../../modifiers/handleNewCodeBlock';
import insertEmptyBlock from '../../modifiers/insertEmptyBlock';
import handleLink from '../../modifiers/handleLink';
import handleImage from '../../modifiers/handleImage';
import leaveList from '../../modifiers/leaveList';
import insertText from '../../modifiers/insertText';
// import createLinkDecorator from './decorators/link';
// import createImageDecorator from './decorators/image';
import { addText, addEmptyBlock } from '../../utils';

import {
  EditorState,
  CompositeDecorator,
  KeyBindingUtil,
  getDefaultKeyBinding,
  RichUtils,
  Modifier,
  Entity,
  Editor
} from 'draft-js';

import {
  insertFragment
} from '../../utils';



const {hasCommandModifier} = KeyBindingUtil;

import {
  INLINE_ASSET,
  NOTE_POINTER
} from '../../constants';

import SideControl from '../SideControl/SideControl';
import PopoverControl from '../PopoverControl/PopoverControl';

import InlineAssetContainer from '../InlineAssetContainer/InlineAssetContainer';
import BlockAssetContainer from '../BlockAssetContainer/BlockAssetContainer';
import NotePointer from '../NotePointer/NotePointer';

import './BasicEditor.scss';

const getSelectedBlockElement = (range) => {
  let node = range.startContainer;
  do {
    if (node.getAttribute && (node.getAttribute('data-block') == 'true' || node.getAttribute('data-contents') == 'true')) { 
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

const isParentOf = (ele, maybeParent) => {

  while (ele.parentNode != null && ele.parentNode != document.body) {
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
    assets: PropTypes.object,
    inlineAssetComponents: PropTypes.object,
    blockAssetComponents: PropTypes.object,
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
    /*
     * Parametrization props
     */
    editorClass: PropTypes.string,
    editorStyle: PropTypes.object,
    allowFootnotesInsertion: PropTypes.bool,
    allowInlineAssetInsertion: PropTypes.bool,
    allowBlockAssetInsertion: PropTypes.bool,
  }


  static defaultProps = {
    blockAssetComponents: {},
  };

  constructor(props) {
    super(props);
    // this.onChange = debounce(this.onChange, 200);
    this.updateSelection = debounce(this.updateSelection, 100);
    this.forceRenderDebounced = debounce(this.forceRender, 100);
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

  componentWillReceiveProps = (nextProps) => {
    // console.log('receiving asset request position', nextProps.assetRequestPosition);
    // console.log('readonlies', this.props.readOnly, nextProps.readOnly);
    if (!this.props.readOnly && nextProps.readOnly) {
      this.inlineToolbar.toolbar.style.display = 'none';
      this.sideControl.toolbar.style.display = 'none';
      // console.log('hide side control', this.sideControl.toolbar.style.display);
    }
    if (this.state.readOnly !== nextProps.readOnly) {
      this.setState({
        readOnly: nextProps.readOnly
      })
    }
    if (this.state.editorState !== nextProps.editorState) {
      this.setState({
        editorState: nextProps.editorState
      });
    }
  }

  focus = (e) => {
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

  updateSelection = () => {
    const selectionRangeIsCollapsed = null;
    const sideControlLeft = -92;
    let sideControlVisible = false;
    let sideControlTop = null;
    let popoverControlVisible = false;
    let popoverControlTop = null;
    let popoverControlLeft = null;


    const selectionRange = getSelectionRange();
    // console.log('selection range', selectionRange);
    
    const editorEle = this.editor;

    if (!selectionRange) return;

    if (!editorEle || !isParentOf(selectionRange.commonAncestorContainer, editorEle.refs.editor)) { return; }

    let assetRequestType;
    const {
      assetRequestPosition
    } = this.props;

    if (assetRequestPosition) {
      const currentContent = this.props.editorState.getCurrentContent();
      const positionBlockKey = assetRequestPosition.getAnchorKey();
      const positionBlock = currentContent.getBlockForKey(positionBlockKey);
      const isEmpty = positionBlock && positionBlock.toJS().text.length === 0;
      assetRequestType = isEmpty ? 'block' : 'inline';
    }

    const inlineToolbarEle = this.inlineToolbar.toolbar;
    const sideControlEle = this.sideControl.toolbar;
    const rangeBounds = selectionRange.getBoundingClientRect();

    const displaceY = this.editor.refs.editorContainer.parentNode.offsetTop;
    const selectedBlock = getSelectedBlockElement(selectionRange);
    const offsetTop = selectionRange.startContainer.parentNode.offsetTop || 0;
    const top = displaceY + offsetTop;
    // console.log('selected block', selectedBlock, selectionRange);
    if (selectedBlock) {
      const blockBounds = selectedBlock.getBoundingClientRect();
      sideControlVisible = true;
      // sideControlTop = this.state.selectedBlock.offsetTop
      const editorBounds = this.state.editorBounds;
      if (!editorBounds) return;
      // const top = displaceY + offsetTop;
      sideControlTop = rangeBounds.top || blockBounds.top;
      // sideControlTop = assetRequestType === 'inline' ? rangeBounds.top : blockBounds.top; // top;
      sideControlEle.style.top = `${sideControlTop}px`;
      // position at begining of the line if no asset requested or block asset requested
      // else position after selection
      const controlWidth = sideControlEle.offsetWidth || 50;
      const left = assetRequestType === 'inline' ? rangeBounds.right : editorBounds.left - controlWidth;
      // let left =  editorEle.refs.editorContainer.parentNode.offsetLeft - sideControlEle.offsetWidth; //  blockBounds.left - sideControlEle.offsetWidth - editorEle.refs.editorContainer.parentNode.offsetLeft;
      // left = assetRequestType === 'inline' ? left + rangeBounds.left : left;
      sideControlEle.style.left = `${left}px`;
      sideControlEle.style.display = 'block';

      if (!selectionRange.collapsed) {
        // The control needs to be visible so that we can get it's width
        inlineToolbarEle.style.position = 'fixed';
        inlineToolbarEle.style.display = 'block';
        const popoverWidth = inlineToolbarEle.clientWidth;

        popoverControlVisible = true;
        let rangeWidth = rangeBounds.right - rangeBounds.left,
          rangeHeight = rangeBounds.bottom - rangeBounds.top;
        popoverControlTop = top;

        popoverControlLeft = 0;
        let startNode = selectionRange.startContainer;
        while (startNode.nodeType === 3) {
          startNode = startNode.parentNode;
        }
        const height = rangeBounds.bottom - rangeBounds.top;
        const popTop = rangeBounds.top /* - editorBounds.top + displaceY */ - popoverSpacing;
        const left = rangeBounds.left;
        inlineToolbarEle.style.left = `${left}px`;
        inlineToolbarEle.style.top = `${popTop}px`;
      } else {
        inlineToolbarEle.style.display = 'none';
      }
    } else {
      sideControlEle.style.display = 'none';
      inlineToolbarEle.style.display = 'none';
    }
    // console.log('after update: ', sideControlEle.style.display);
  }

  findInlineAsset = (contentBlock, callback, contentState) => {
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
          resources,
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

  findNotePointers = (contentBlock, callback, contentState) => {
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
        const onMouseOver = (e) => {
          if (typeof this.props.onNotePointerMouseOver === 'function') {
            this.props.onNotePointerMouseOver(noteId, e);
          }
        };
        const onMouseOut = (e) => {
          if (typeof this.props.onNotePointerMouseOut === 'function') {
            this.props.onNotePointerMouseOut(noteId, e);
          }
        };
        const onMouseClick = (e) => {
          if (typeof this.props.onNotePointerMouseClick === 'function') {
            this.props.onNotePointerMouseClick(noteId, e);
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

  createDecorator = () => 
     new MultiDecorator([
       new SimpleDecorator(this.findInlineAsset, InlineAssetContainer),
       new SimpleDecorator(this.findNotePointers, NotePointer),
     ]);

  forceRender = (props) => {
    const editorState = props.editorState || this.generateEmptyEditor();
    const content = editorState.getCurrentContent();

    const newEditorState = EditorState.createWithContent(content, this.createDecorator());
    const selectedEditorState = EditorState.acceptSelection(newEditorState, editorState.getSelection());
    this.setState({ editorState: selectedEditorState });
  }


  generateEmptyEditor = () => 
    EditorState.createEmpty(this.createDecorator())

  state = {
    editorState: this.generateEmptyEditor()
  };


  onAssetFocus = (e) => {
    e.stopPropagation();
    this.setState({
      readOnly: true
    });
  }

  onInputBlur = (e) => {
    e.stopPropagation();
    this.setState({
      readOnly: false
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
      } catch (e) {
        return;
      }
      const id = data.data.asset.id;
      const asset = this.props.assets[id];
      if (!asset) {
        return;
      }
      const { blockAssetComponents } = this.props;
      const AssetComponent = blockAssetComponents[asset.type] || <div />;
      const {
        assets,
        onAssetChange: onChange,
        onAssetMouseOver: onMouseOver,
        onAssetMouseOut: onMouseOut
      } = this.props;

      const {
        onAssetFocus: onFocus,
        onInputBlur: onBlur
      } = this;
      if (asset) {
        return {
          component: BlockAssetContainer,
          editable: false,
          props: {
            asset,
            onFocus,
            onBlur,
            onChange,
            onMouseOver,
            onMouseOut,
            AssetComponent
          },
        };
      }
    }
  }

  onBlur = (e) => {

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
      onBlur(e);
    }
  };

  defaultKeyBindingFn = e => {
    // hasCommandModifier sometimes throws in a strange way
    // so wrap it in a try/catch
    // try {
      if (e && e.keyCode === 229 /* `^` key */ && hasCommandModifier(e)) {
        return 'add-note';
      }
    // } catch (e) {
      return getDefaultKeyBinding(e);
    // }
    // return getDefaultKeyBinding(e);
  }

  _handleKeyCommand = (command) => {
    if (command === 'add-note' && this.props.allowNotesInsertion && typeof this.props.onNoteAdd === 'function') {
      this.onNoteAdd();
      return 'handled';
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

  _handleDragOver = (e) => {
    e.preventDefault();
    return false;
  }

  onChange = (editorState) => {
    if (typeof this.props.onEditorChange === 'function' && !this.props.readOnly) {
      this.props.onEditorChange(editorState);
    }
  }

  _handlePastedText = (text, html) => {
    if (this.props.clipboard) {
      this.editor.setClipboard(null);
      return true;
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

  componentDidUpdate(prevProps) {
    this.updateSelection();
    // force render of inline and atomic block elements
    const {
      forceRenderDebounced,
      // forceRender
    } = this;

    if (
      this.props.editorState !== prevProps.editorState 
      || prevProps.assets !== this.props.assets
      || prevProps.readOnly !== this.props.readOnly
      || prevProps.notes !== this.props.notes
    ) {
      forceRenderDebounced(this.props);
    }

    if (
      this.props.editorState !== prevProps.editorState && 
      this.editor
    ) {
      this.editor.focus();
    }

  }

  render = () => {
    const {
      editorState = EditorState.createEmpty(this.createDecorator()),
      editorClass = 'scholar-draft-BasicEditor',

      placeholder = 'write your text',

      allowNotesInsertion = false,
      allowInlineAsset = true,
      allowBlockAsset = true,

      blockAssetComponents,
      inlineButtons,

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
    const bindSideControlRef = (sideControl) => {
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

    const onMainClick = (e) => {
      if (typeof onClick === 'function') {
        onClick(e);
      }
      this.focus(e);
    };
    let assetRequestType;
    if (assetRequestPosition) {
      const currentContent = realEditorState.getCurrentContent();
      const positionBlockKey = assetRequestPosition.getAnchorKey();
      const positionBlock = currentContent.getBlockForKey(positionBlockKey);
      const isEmpty = positionBlock && positionBlock.toJS().text.length === 0;
      assetRequestType = isEmpty ? 'block' : 'inline';
    }

    const keyBindingFn = typeof this.props.keyBindingFn === 'function' ? this.props.keyBindingFn : defaultKeyBindingFn;
    return (
      <div 
        className={editorClass}
        onClick={onMainClick}
        style={editorStyle}

        onDragOver={_handleDragOver}
      >
        <PopoverControl
          ref={bindInlineToolbar}
          editorState={realEditorState}
          updateEditorState={onChange}
        />
        <SideControl
          ref={bindSideControlRef}

          allowAssets={{
            inline: allowInlineAsset,
            block: allowBlockAsset
          }}
          allowNotesInsertion={allowNotesInsertion}

          onAssetRequest={onAssetRequest}
          onAssetRequestCancel={onAssetRequestCancel}
          onAssetChoice={onAssetChoice}
          assetRequestPosition={assetRequestPosition}
          assetRequestType={assetRequestType}
          assetChoiceProps={assetChoiceProps}

          AssetChoiceComponent={AssetChoiceComponent}

          onNoteAdd={onNoteAdd}
        />
        <Editor
          blockRendererFn={_blockRenderer}
          spellCheck
          readOnly={readOnly}
          placeholder={placeholder}

          keyBindingFn={keyBindingFn}

          handleDrop={_handleDrop}

          handlePastedText={_handlePastedText}
          handleKeyCommand={_handleKeyCommand}
          handleBeforeInput={_handleBeforeInput}
          handleReturn={_handleReturn}
          onTab={_onTab}

          editorState={stateEditorState}

          onChange={onChange}
          ref={bindEditorRef}
          onBlur={this.onBlur}

          {...otherProps}
        />
      </div>
    );
  }
}
