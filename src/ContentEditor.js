import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getUnboundedScrollPosition from 'fbjs/lib/getUnboundedScrollPosition.js';
import Style from 'fbjs/lib/Style.js';

import {Map} from 'immutable';

import SideToolbar from './components/SideToolbar';
import PopoverControl from './components/PopoverControl/PopoverControl';

import SimpleDecorator from 'draft-js-simpledecorator';

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
  /* const currentContent = this.props.editorState.getCurrentContent()
  const selection = this.props.editorState.getSelection()
  return currentContent.getBlockForKey(selection.getStartKey())*/
};

const getSelectionRange = () => {
  const selection = window.getSelection();
  if (selection.rangeCount == 0) return null;
  return selection.getRangeAt(0);
};

const isParentOf = (ele, maybeParent) => {

  while (ele.parentNode != null && ele.parentNode != document.body) {
    if (ele.parentNode == maybeParent) return true;
    ele = ele.parentNode;
  }
  return false;
};

const InlinePointer = (props) => {
  const {
    children,
    contentState,
    contextualizer = {},
    contextualizerId,
    data,
    onDataChange,
    onInputBlur,
    onInputFocus,
    onContextualizationMouseOver,
    onContextualizationMouseOut,
    resource = {},
    resourceId
  } = props;

  const onResourceTitleChange = e => {
    const title = e.target.value;
    onDataChange('resources', resourceId, {
      ...resource,
      title
    });
  };

  const onContextualizerPageChange = e => {
    const pages = e.target.value;
    onDataChange('contextualizers', contextualizerId, {
      ...contextualizer,
      pages
    });
  };
  const onMouseOver = e => {
    if (typeof onContextualizationMouseOver === 'function') {
      onContextualizationMouseOver(data.contextualization.id, data.contextualization, e);
    }
  }

  const onMouseOut = e => {
    if (typeof onContextualizationMouseOut === 'function') {
      onContextualizationMouseOut(data.contextualization.id, data.contextualization, e);
    }
  }
  return (
    <span style={{
      background: 'grey',
      color: 'white',
      padding: '5px'
    }}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <input
        value={resource.title}
        onChange={onResourceTitleChange}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
      />, pp.
      <input
        value={contextualizer.pages}
        onChange={onContextualizerPageChange}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
      />

      {children}
    </span>
  );
};

const NotePointer = ({
  children
}) => (
  <span style={{
    width: '1rem',
    height: '1rem',
    background: 'red',
    borderRadius: '50%',
    display: 'inline-block',
    marginLeft: '.5rem',
    marginRight: '.5rem'
  }}>
    {children}
  </span>
);


const styles = {
  editorContainer: {
    position: 'relative',
    // paddingLeft: 48,
  },
  popOverControl: {
    // width: 78, // Height and width are needed to compute the position
    // height: 24,
    display: 'none', 
    position: 'absolute',
    zIndex: 999,
  },
  sideControl: {
    height: 24, // Required to figure out positioning
    // width: 48, // Needed to figure out how much to offset the sideControl left
    left: -92,
    right: '100%',
    display: 'none',
    textAlign: 'right',
  }
};

const popoverSpacing = 3; // The distance above the selection that popover 


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
    onAddNote: PropTypes.func,
    onContextualizationClick: PropTypes.func,
    onContextualizationMouseOver: PropTypes.func,
    onContextualizationMouseOut: PropTypes.func,
    /*
     * Parametrization props
     */
     editorClass: PropTypes.string,
     editorStyles: PropTypes.object,
     allowFootnotesInsertion: PropTypes.bool,
     allowInlineContextualizationInsertion: PropTypes.bool,
     allowBlockContextualizationInsertion: PropTypes.bool,
  }


  static defaultProps = {
    blockContextualizationComponents: {},
    iconColor: '#000000',
    iconSelectedColor: '#2000FF',
  };

  constructor(props) {
    super(props);
  }

  // componentDidUpdate = () => this.updateSelection();

  focus = () => {
    if (this.props.readOnly) return;

    const editorNode = this.editor.refs.editor;
    const editorBounds = editorNode.getBoundingClientRect();
    this.setState({
      editorBounds,
    });

    const scrollParent = Style.getScrollParent(editorNode);
    // console.log(`focus called: ${require('util').inspect(getUnboundedScrollPosition(scrollParent))}`)
    editorNode.focus(getUnboundedScrollPosition(scrollParent));
    // this.refs.editor.focus();
  };

  updateSelection = () => {
      
    let selectionRangeIsCollapsed = null;
    let sideControlVisible = false;
    let sideControlTop = null;
    let sideControlLeft = styles.sideControl.left;
    let popoverControlVisible = false;
    let popoverControlTop = null;
    let popoverControlLeft = null;


    
    const selectionRange = getSelectionRange();
    if (!selectionRange) return;
    
    const editorEle = this.editor;
    if (!isParentOf(selectionRange.commonAncestorContainer, editorEle.refs.editor)) { return; }

    const popoverControlEle = this.inlineToolbar.toolbar;
    const sideControlEle = this.sideToolbar.toolbar;


    const rangeBounds = selectionRange.getBoundingClientRect();
    const selectedBlock = getSelectedBlockElement(selectionRange);
    if (selectedBlock) {
      const blockBounds = selectedBlock.getBoundingClientRect();
      sideControlVisible = true;
      // sideControlTop = this.state.selectedBlock.offsetTop
      const editorBounds = this.state.editorBounds;
      if (!editorBounds) return;
      sideControlTop = (blockBounds.top - editorBounds.top)
        + ((blockBounds.bottom - blockBounds.top) / 2)
        + (styles.sideControl.height / 2);


      // sideControlEle.style.left = `${sideControlLeft}px`;
      sideControlEle.style.top = `${sideControlTop}px`;
      sideControlEle.style.display = 'block';

      if (!selectionRange.collapsed) {
        // The control needs to be visible so that we can get it's width
        popoverControlEle.style.display = 'block';
        const popoverWidth = popoverControlEle.clientWidth;


        popoverControlVisible = true;
        let rangeWidth = rangeBounds.right - rangeBounds.left,
          rangeHeight = rangeBounds.bottom - rangeBounds.top;
        popoverControlTop = (rangeBounds.top - editorBounds.top)
          - styles.popOverControl.height
          - popoverSpacing;
        popoverControlLeft = 0
          + (rangeBounds.left - editorBounds.left)
          + (rangeWidth / 2)
          - (/* styles.popOverControl.width*/ popoverWidth / 2);


        // console.log(popoverControlEle)
        // console.log(popoverControlEle.style)
        popoverControlEle.style.left = `${popoverControlLeft}px`;
        popoverControlEle.style.top = `${popoverControlTop}px`;
      } else {
        popoverControlEle.style.display = 'none';
      }
    } else {
      sideControlEle.style.display = 'none';
      popoverControlEle.style.display = 'none';
    }
  }

  findInlineContextualizations = (contentBlock, callback, contentState) => {
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
          onDataChange
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

  createDecorator = () => {
    // new SimpleDecorator(this.findInlineContextualizations, InlinePointer)
    // new CompositeDecorator([
    return new SimpleDecorator(this.findInlineContextualizations, InlinePointer);
  }
    /*{
      strategy: this.findInlineContextualizations,
      component: InlinePointer
    }*/
    // ,
    // {
    //   strategy: this.findNotePointers,
    //   component: NotePointer
    // }
    // ])

  forceRender = (props) => {
    const editorState = props.editorState || this.generateEmptyEditor();
    const content = editorState.getCurrentContent();
    const {
      contextualizers
    } = props;
    // console.log('force render', contextualizers[Object.keys(contextualizers)[0]].pages);

    const newEditorState = EditorState.createWithContent(content, this.createDecorator());
    const selectedEditorState = EditorState.acceptSelection(newEditorState, editorState.getSelection());
    this.setState({editorState: selectedEditorState});
  }



  generateEmptyEditor = () => 
    EditorState.createEmpty(this.createDecorator())

  state = {
    editorState: this.generateEmptyEditor()
  };


  onInputFocus = () => {
    this.setState({
      readOnly: true
    })
  }

  onInputBlur = () => {
    this.setState({
      readOnly: false
    })
  }


  _blockRenderer = (contentBlock) => {
    const type = contentBlock.getType();
    
    if (type === 'atomic') {
      const entityKey = contentBlock.getEntityAt(0);
      const contentState = this.state.editorState.getCurrentContent();
      let data;
      try{
        data = contentState.getEntity(entityKey).toJS();
      } catch(e) {
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

    // this.inlineBar.style.display = 'none';
    // this.sideBar.style.display = 'none';

    const { onBlur } = this.props;
    if (onBlur) {
      onBlur.apply(this, arguments);
    }

    // const popoverControlEle = ReactDOM.findDOMNode(this.refs.popoverControl);
    // const sideControlEle = ReactDOM.findDOMNode(this.refs.sideControl);
    // popoverControlEle.style.display = 'none';
    // sideControlEle.style.display = 'none';
    // const { onBlur } = this.props;
    // if (onBlur) { onBlur.apply(this, arguments); }
  };

  _handleKeyCommand = (command) => {
    const { editorState } = this.props;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this._onChange(newState);
      return true;
    }
    return false;
  };

  _onChange = editorState => {
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
    if(this.props.editorState !== prevProps.editorState && this.editor && this.props.lastInsertionType === 'inlineContextualization') {
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
      blockButtons,
      inlineButtons,

      onContextualizationRequest,
      onContextualizationClick,
      onContextualizationMouseOver,
      onContextualizationMouseOut,

      onNoteAdd,

      iconColor,
      iconSelectedColor,
      popOverStyle,

      ...otherProps
    } = this.props;

    const {
      readOnly
    } = this.state;

    let realEditorState = editorState || this.generateEmptyEditor();
    
    const uEditor = realEditorState;

    const bindEditorRef = editor => {
      this.editor = editor;
    };
    const bindSideToolbarRef = sideToolbar => {
      this.sideToolbar = sideToolbar;
    };

    const bindInlineToolbar = inlineToolbar => {
      this.inlineToolbar = inlineToolbar;
    };

    const sideControlStyles = Object.assign({}, styles.sideControl);

    const popoverStyle = Object.assign({}, styles.popOverControl);
    return (
      <div>
        <div 
          style={editorStyles}
          className={editorClass}
          onClick={this.focus}
        >
          <PopoverControl
            ref={bindInlineToolbar}
            style={popoverStyle} 
            editorState={realEditorState}
            iconSelectedColor={iconSelectedColor}
            iconColor={iconColor}
            updateEditorState={this._onChange}
            buttons={inlineButtons}
          />
          <SideToolbar
            style={sideControlStyles} 
            iconSelectedColor={iconSelectedColor}
            iconColor={iconColor}
            popoverStyle={popoverStyle}
            ref={bindSideToolbarRef}
            buttons={blockButtons}
            editorState={realEditorState}
            updateEditorState={this._onChange}

            allowContextualizations={{
              inline: allowInlineContextualization,
              block: allowBlockContextualization
            }}
            allowNotesInsertion={allowNotesInsertion}
            onContextualizationClick={onContextualizationRequest}
            onNoteAdd={onNoteAdd}
          />
          <Editor
            blockRendererFn={this._blockRenderer}
            spellCheck
            readOnly={readOnly}
            placeholder={placeholder}

            handleKeyCommand={this._handleKeyCommand}
            editorState={this.state.editorState}
            onChange={this._onChange}
            ref={bindEditorRef}
            onBlur={this.onBlur}
            {...otherProps}
          />
        </div>
      </div>
    );
  }
}