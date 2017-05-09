import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getUnboundedScrollPosition from 'fbjs/lib/getUnboundedScrollPosition.js';
import Style from 'fbjs/lib/Style.js';

import { Map } from 'immutable';

import SideControl from './components/SideControl/SideControl';
import PopoverControl from './components/PopoverControl/PopoverControl';
import InlinePointer from './components/InlinePointer/InlinePointer';
import NotePointer from './components/NotePointer/NotePointer';

import SimpleDecorator from 'draft-js-simpledecorator';
import MultiDecorator from 'draft-js-multidecorators';


import './ContentEditor.scss';

import {
  EditorState,
  CompositeDecorator,
  RichUtils,
  Entity,
  Editor
} from 'draft-js';


const getSelectedBlockElement = (range) => {
  let node = range.startContainer;
  do {
    if (node.getAttribute && node.getAttribute('data-block') == 'true') { return node; }
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

const popoverSpacing = 30; // The distance above the selection that popover 


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
    const popoverControlEle = this.inlineToolbar.toolbar;
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
        popoverControlEle.style.display = 'block';
        const popoverWidth = popoverControlEle.clientWidth;

        popoverControlVisible = true;
        let rangeWidth = rangeBounds.right - rangeBounds.left,
          rangeHeight = rangeBounds.bottom - rangeBounds.top;
        popoverControlTop = top;

        popoverControlLeft = 0;
        let startNode = selectionRange.startContainer;
        while (startNode.nodeType === 3) startNode = startNode.parentNode;
        const height = rangeBounds.bottom - rangeBounds.top;
        const popTop = rangeBounds.top - editorBounds.top + displaceY - popoverSpacing;
        const left = rangeBounds.left;
        popoverControlEle.style.left = `${left}px`;
        popoverControlEle.style.top = `${popTop}px`;
      } else {
        popoverControlEle.style.display = 'none';
      }
    } else {
      sideControlEle.style.display = 'none';
      popoverControlEle.style.display = 'none';
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
          contentState.getEntity(entityKey).getType() === 'inlineContextualization'
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
          contentState.getEntity(entityKey).getType() === 'note-pointer'
        );
      },
      callback
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
      const component = blockContextualizationComponents[data.type];

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
    ) {
      forceRender(this.props);
    }

    // force focus if last insertion type is inline
    if (
      this.props.editorState !== prevProps.editorState && 
      this.editor && 
      this.props.lastInsertionType === 'inlineContextualization'
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

      onNoteAdd,

      editorStyle,
      ...otherProps
    } = this.props;

    const {
      readOnly,
      editorState : stateEditorState
    } = this.state;

    const {
      _handleKeyCommand,
      onChange,
      _blockRenderer,
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
    return (
      <div>
        <div 
          className="ContentEditor"
          onClick={this.focus}
          style={editorStyle}
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
            editorState={stateEditorState}
            onChange={onChange}
            ref={bindEditorRef}
            onBlur={this.onBlur}
            {...otherProps}
          />
        </div>
      </div>
    );
  }
}
