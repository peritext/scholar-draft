import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getUnboundedScrollPosition from 'fbjs/lib/getUnboundedScrollPosition.js';
import Style from 'fbjs/lib/Style.js';

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
  RichUtils,
  Modifier,
  Entity,
  Editor
} from 'draft-js';

import {
  INLINE_CONTEXTUALIZATION,
  NOTE_POINTER
} from '../../constants';

import SideControl from '../SideControl/SideControl';
import PopoverControl from '../PopoverControl/PopoverControl';
import InlinePointer from '../InlinePointer/InlinePointer';
import NotePointer from '../NotePointer/NotePointer';

import './ContentEditor.scss';

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

const popoverSpacing = 30;


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


export default class ContentEditor extends Component {

  static propTypes = {
    /*
     * State-related props
     */
    editorState: PropTypes.object,
    contextualizations: PropTypes.object,
    resources: PropTypes.object,
    contextualizers: PropTypes.object,
    inlineContextualizationComponents: PropTypes.object,
    blockContextualizationComponents: PropTypes.object,
    /*
     * Method props
     */
    onEditorChange: PropTypes.func,
    onNotesOrderChange: PropTypes.func,
    onContextualizationRequest: PropTypes.func,
    onNoteAdd: PropTypes.func,
    onContextualizationClick: PropTypes.func,
    onContextualizationMouseOver: PropTypes.func,
    onContextualizationMouseOut: PropTypes.func,
    /*
     * Parametrization props
     */
    editorClass: PropTypes.string,
    editorStyle: PropTypes.object,
    allowFootnotesInsertion: PropTypes.bool,
    allowInlineContextualizationInsertion: PropTypes.bool,
    allowBlockContextualizationInsertion: PropTypes.bool,
  }


  static defaultProps = {
    blockContextualizationComponents: {},
  };

  constructor(props) {
    super(props);
  }

  focus = () => {
    if (this.props.readOnly) return;

    const editorNode = this.editor.refs.editor;
    const editorBounds = editorNode.getBoundingClientRect();
    this.setState({
      editorBounds,
    });

    const scrollParent = Style.getScrollParent(editorNode);
    editorNode.focus(getUnboundedScrollPosition(scrollParent));
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
    
    if (!selectionRange) return;
    
    const editorEle = this.editor;
    if (!isParentOf(selectionRange.commonAncestorContainer, editorEle.refs.editor)) { return; }
    const inlineToolbarEle = this.inlineToolbar.toolbar;
    const sideControlEle = this.sideControl.toolbar;
    const rangeBounds = selectionRange.getBoundingClientRect();

    const displaceY = this.editor.refs.editorContainer.parentNode.offsetTop;
    const selectedBlock = getSelectedBlockElement(selectionRange);

    const offsetTop = selectionRange.startContainer.parentNode.offsetTop || 0;
    const top = displaceY + offsetTop;
    if (selectedBlock) {
      const blockBounds = selectedBlock.getBoundingClientRect();
      sideControlVisible = true;
      // sideControlTop = this.state.selectedBlock.offsetTop
      const editorBounds = this.state.editorBounds;
      if (!editorBounds) return;
      const top = displaceY + offsetTop;
      sideControlTop = top;
      sideControlEle.style.top = `${sideControlTop}px`;
      const left = editorEle.refs.editorContainer.parentNode.offsetLeft - sideControlEle.offsetWidth; //  blockBounds.left - sideControlEle.offsetWidth - editorEle.refs.editorContainer.parentNode.offsetLeft;
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
  }

  findInlineContextualizations = (contentBlock, callback, contentState) => {
    if (contentState === undefined) {
      contentState = this.props.editorState.getCurrentContent();
    }
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === INLINE_CONTEXTUALIZATION
        );
      },
      (start, end) => {
        const {
          resources,
          contextualizers,
          contextualizations,
          onContextualizationMouseOver,
          onContextualizationMouseOut,
          onDataChange,
          inlineContextualizationComponents
        } = this.props;

        const {
          onInputFocus,
          onInputBlur
        } = this;

        const entityKey = contentBlock.getEntityAt(start);
        const data = this.state.editorState.getCurrentContent().getEntity(entityKey).toJS();

        const id = data.data.contextualization.id;
        const contextualization = contextualizations[id];
        let props = {};
        if (contextualization) {
          props = {
            ...data,
            resource: resources[contextualization.resourceId],
            contextualizer: contextualizers[contextualization.contextualizerId],
            resourceId: contextualization.resourceId,
            contextualizerId: contextualization.contextualizerId,
            onContextualizationMouseOver,
            onContextualizationMouseOut,
            inlineContextualizationComponents,
            onDataChange,
            onInputFocus,
            onInputBlur
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
          this.props.onNotePointerMouseOver(noteId, e);
        };
        const onMouseOut = (e) => {
          this.props.onNotePointerMouseOut(noteId, e);
        };
        const onMouseClick = (e) => {
          this.props.onNotePointerMouseClick(noteId, e);
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
       new SimpleDecorator(this.findInlineContextualizations, InlinePointer),
       new SimpleDecorator(this.findNotePointers, NotePointer),
     ]);

  forceRender = (props) => {
    const editorState = props.editorState || this.generateEmptyEditor();
    const content = editorState.getCurrentContent();
    const {
      contextualizers
    } = props;

    const newEditorState = EditorState.createWithContent(content, this.createDecorator());
    const selectedEditorState = EditorState.acceptSelection(newEditorState, editorState.getSelection());
    this.setState({ editorState: selectedEditorState });
  }


  generateEmptyEditor = () => 
    EditorState.createEmpty(this.createDecorator())

  state = {
    editorState: this.generateEmptyEditor()
  };


  onInputFocus = () => {
    this.setState({
      readOnly: true
    });
  }

  onInputBlur = () => {
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
      const { blockContextualizationComponents } = this.props;
      const component = blockContextualizationComponents[data.data.contextualization.type];
      const {
        resources,
        contextualizers,
        contextualizations,
        onDataChange,
        onContextualizationMouseOver,
        onContextualizationMouseOut
      } = this.props;

      const {
        onInputFocus,
        onInputBlur
      } = this;

      const id = data.data.contextualization.id;
      const contextualization = contextualizations[id];
      if (contextualization) {
        return {
          component,
          editable: false,
          props: {
            ...data,
            resource: resources[contextualization.resourceId],
            contextualizer: contextualizers[contextualization.contextualizerId],
            resourceId: contextualization.resourceId,
            contextualizerId: contextualization.contextualizerId,
            onDataChange,
            onInputFocus,
            onInputBlur,
            onContextualizationMouseOver,
            onContextualizationMouseOut
          },
        };
      }
    }
  }

  onBlur = () => {

    this.inlineToolbar.toolbar.display = 'none';
    this.sideControl.toolbar.display = 'none';

    const { onBlur } = this.props;
    if (onBlur) {
      onBlur.apply(this, arguments);
    }
  };

  _handleKeyCommand = (command) => {
    const { editorState } = this.props;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  };

  _handleBeforeInput = (character, props) => {
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

  _handleDrop = (e) => {
    const payload = e.dataTransfer.getData('text');
    e.preventDefault();
    e.stopPropagation();

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

      this.props.onDrop(payload, selection);
    }, 1);
    return false;
  }

  _handleDragOver = (e) => {
    e.preventDefault();
    return false;
  }

  onChange = (editorState) => {
    this.props.onEditorChange(editorState);
  }

  componentDidUpdate(prevProps) {
    this.updateSelection();
    // force render of inline and atomic block elements
    const {
      forceRender
    } = this;

    if (this.props.editorState !== prevProps.editorState 
      || prevProps.contextualizers !== this.props.contextualizers
      || prevProps.contextualizations !== this.props.contextualizations
      || prevProps.resources !== this.props.resources
      || prevProps.readOnly !== this.props.readOnly
      || prevProps.notes !== this.props.notes
    ) {
      forceRender(this.props);
    }

    // force focus if last insertion type is inline
    if (
      this.props.editorState !== prevProps.editorState && 
      this.editor && 
      this.props.lastInsertionType === INLINE_CONTEXTUALIZATION
    ) {
      this.editor.focus();
    }
  }

  render = () => {
    const {
      editorState,
      editorClass = '',
      editorStyles = {},

      placeholder = 'write your text',

      contextualizations,
      contextualizers,
      resources,

      allowNotesInsertion = false,
      allowInlineContextualization = true,
      allowBlockContextualization = true,

      blockContextualizationComponents,
      inlineButtons,

      onContextualizationRequest,
      // onContextualizationClick,
      // onContextualizationMouseOver,
      // onContextualizationMouseOut,

      // onNoteAdd,

      editorStyle,
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
      _handleDragOver
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

    const onNoteAdd = () => {
      this.props.onNoteAdd();
      setTimeout(() => {
        this.props.onEditorChange(this.props.editorState);        
      });
    };

    const onScroll = () => {
      this.updateSelection();
    };
    return (
      <div 
        className="peritext-draft-ContentEditor"
        onClick={this.focus}
        style={editorStyle}

        onScroll={onScroll}
        onDrop={_handleDrop}
        onDragOver={_handleDragOver}
      >
        <PopoverControl
          ref={bindInlineToolbar}
          editorState={realEditorState}
          updateEditorState={onChange}
        />
        <SideControl
          ref={bindSideControlRef}
          editorState={realEditorState}
          updateEditorState={onChange}

          allowContextualizations={{
            inline: allowInlineContextualization,
            block: allowBlockContextualization
          }}
          allowNotesInsertion={allowNotesInsertion}
          onContextualizationClick={onContextualizationRequest}
          onNoteAdd={onNoteAdd}
        />
        <Editor
          blockRendererFn={_blockRenderer}
          spellCheck
          readOnly={readOnly}
          placeholder={placeholder}

          handleKeyCommand={_handleKeyCommand}
          handleBeforeInput={_handleBeforeInput}
          handleReturn={_handleReturn}
          onTab={_onTab}

          editorState={stateEditorState}

          onChange={onChange}
          ref={bindEditorRef}
          onBlur={this.onBlur}

          onDrop={e => console.log('on editor drop')}

          {...otherProps}
        />
      </div>
    );
  }
}
