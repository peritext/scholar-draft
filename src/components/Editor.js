import {
  ContentState, 
  Editor, 
  EditorState, 
  RichUtils,
  Entity
} from 'draft-js';
import React from 'react';
import PropTypes from 'prop-types';

import ReactDOM from 'react-dom';
import SideControl from './SideControl/SideControl';
import PopoverControl from './PopoverControl/PopoverControl';
import getUnboundedScrollPosition from 'fbjs/lib/getUnboundedScrollPosition.js';
import Style from 'fbjs/lib/Style.js';
import defaultDecorator from './defaultDecorator.js';
import defaultBlockRenderMap from './defaultBlockRenderMap';

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

const isInDev = typeof process === 'undefined' 
  || typeof process.env === 'undefined'
  || process.env.NODE_ENV != 'production';

const styles = {
  editorContainer: {
    position: 'relative',
    // paddingLeft: 48,
  },
  popOverControl: {
    // width: 78, // Height and width are needed to compute the position
    height: 24,
    display: 'none', 
    position: 'absolute',
    zIndex: 999,
  },
  sideControl: {
    height: 24, // Required to figure out positioning
    // width: 48, // Needed to figure out how much to offset the sideControl left
    left: -92,
    display: 'none',
  }
};

const popoverSpacing = 3; // The distance above the selection that popover 
  // will display

class RichEditor extends React.Component {

  static propTypes = {
    blockTypes: PropTypes.object,
    readOnly: PropTypes.bool,
    /**
     * The root component class name.
     */
    className: PropTypes.string,

    /**
     * The icon fill colour
     */
    iconColor: PropTypes.string,

    /**
     * The icon fill colour when selected
     */
    iconSelectedColor: PropTypes.string,

    /**
     * Override the inline styles for the popover component.
     */
    popoverStyle: PropTypes.object,

    /**
     * Override the inline buttons, these are displayed in the popover control.
     */
    inlineButtons: PropTypes.array,

    /**
     * Override the block buttons, these are displayed in the "more options" 
     * side control.
     */
    blockButtons: PropTypes.array,
  };

  static defaultProps = {
    blockTypes: {
    },
    iconColor: '#000000',
    iconSelectedColor: '#2000FF',
    // editorState: EditorState.createEmpty(defaultDecorator),
    onChange() {},
  };

  state = {};

  constructor(props) {
    super(props);

    if (props.decorator) {
      throw new Error(`Passing in a decorator is deprecated, you must first 
        create an editorState object using your decorator and pass in that
        editorState object instead. e.g. EditorState.createEmpty(decorator)`);
    }

    if (props.editorState instanceof ContentState) {
      throw new Error(`You passed in a ContentState object when an EditorState 
        object was expected, use EditorState.createWithContent first.`); 
    }

    /* if (props.editorState != null && 
      !(props.editorState instanceof EditorState))
     throw new Error('Invalid editorState')*/
    
    
    this.updateSelection = () => {
      
      var selectionRangeIsCollapsed = null,
        sideControlVisible = false,
        sideControlTop = null,
        sideControlLeft = styles.sideControl.left,
        popoverControlVisible = false,
        popoverControlTop = null,
        popoverControlLeft = null;
      
      
      const selectionRange = getSelectionRange();
      if (!selectionRange) return;
      
      const editorEle = ReactDOM.findDOMNode(this.refs.editor);
      if (!isParentOf(selectionRange.commonAncestorContainer, editorEle)) { return; }

      const popoverControlEle = ReactDOM.findDOMNode(this.refs.popoverControl);
      const sideControlEle = ReactDOM.findDOMNode(this.refs.sideControl);

      const rangeBounds = selectionRange.getBoundingClientRect();
      const selectedBlock = getSelectedBlockElement(selectionRange);
      if (selectedBlock) {
        const blockBounds = selectedBlock.getBoundingClientRect();

        sideControlVisible = true;
        // sideControlTop = this.state.selectedBlock.offsetTop
        const editorBounds = this.state.editorBounds;
        if (!editorBounds) return;
        var sideControlTop = (blockBounds.top - editorBounds.top)
          + ((blockBounds.bottom - blockBounds.top) / 2)
          - (styles.sideControl.height / 2);

        // console.log(require('util').inspect(sideControlTop))
          
        sideControlEle.style.left = `${sideControlLeft}px`;
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
    };
    

  }

  _blockRenderer = (contentBlock) => {
    const type = contentBlock.getType();
    
    if (type === 'atomic') {
      const entityKey = contentBlock.getEntityAt(0);
      const data = Entity.get(entityKey).toJS();
      const { blockTypes } = this.props;
      const component = blockTypes[data.data.type];
      return {
        component,
        editable: false,
        props: data,
      };
    }
  }


  /**
   * This is needed, so that we can return true. Required to stop the event
   * bubbling up and then triggering handling for keyDown.
   */
  _handleKeyCommand = (command) => {
    const { editorState } = this.props;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this._onChange(newState);
      return true;
    }
    return false;
  };

  _onChange = editorState => this.props.onChange(editorState);

  focus = () => {
    if (this.props.readOnly) return;

    const editorNode = ReactDOM.findDOMNode(this.refs.editor);
    const editorBounds = editorNode.getBoundingClientRect();
    this.setState({
      editorBounds,
    });

    const scrollParent = Style.getScrollParent(editorNode);
    // console.log(`focus called: ${require('util').inspect(getUnboundedScrollPosition(scrollParent))}`)
    this.refs.editor.focus(getUnboundedScrollPosition(scrollParent));
    // this.refs.editor.focus();
  };

  componentDidUpdate = () => this.updateSelection();

  onEditorChange = (editorState) => {
    const { onChange } = this.props;
    onChange(editorState);
  };

  onBlur = () => {
    const popoverControlEle = ReactDOM.findDOMNode(this.refs.popoverControl);
    const sideControlEle = ReactDOM.findDOMNode(this.refs.sideControl);
    popoverControlEle.style.display = 'none';
    sideControlEle.style.display = 'none';
    const { onBlur } = this.props;
    if (onBlur) { onBlur.apply(this, arguments); }
  };

  // componentWillReceiveProps () {
  //   this.focus();
  // }

  /**
   * While editing TeX, set the Draft editor to read-only. This allows us to
   * have a textarea within the DOM.
   */
  render() {
    let { 
      iconColor, 
      iconSelectedColor,
      popoverStyle,
      inlineButtons,
      blockButtons,
      editorState,
      onContextualizationRequest,
      onNoteAdd,
      ...otherProps, 
    } = this.props;

    if (!editorState) {
      editorState = EditorState.createEmpty(defaultDecorator);
      this._onChange(editorState);
    }



    const sideControlStyles = Object.assign({}, styles.sideControl);
    /* if (this.props.readOnly != true && this.state.sideControlVisible){
      sideControlStyles.display = 'block'
    }*/

    const popoverStyleLocal = Object.assign({}, styles.popOverControl);
    /* if (this.props.readOnly != true && this.state.popoverControlVisible){
      popoverStyleLocal.display = 'block'
    }*/
    Object.assign(popoverStyleLocal, popoverStyle);

    return (
      <div>
        <div
          style={Object.assign({}, styles.editorContainer, this.props.style)} 
          className={this.props.className} onClick={this.focus}
        >
          <SideControl
            style={sideControlStyles} 
            iconSelectedColor={iconSelectedColor}
            iconColor={iconColor}
            popoverStyle={popoverStyle}
            ref="sideControl"
            buttons={blockButtons}
            editorState={editorState}
            updateEditorState={this.onEditorChange}
            onFigureClick={onContextualizationRequest}
            onNoteAdd={onNoteAdd}
          />
          <PopoverControl 
            style={popoverStyleLocal} 
            editorState={editorState}
            iconSelectedColor={iconSelectedColor}
            iconColor={iconColor}
            updateEditorState={this.onEditorChange}
            ref="popoverControl"
            buttons={inlineButtons}
          />
          <Editor
            blockRendererFn={this._blockRenderer}
            blockRenderMap={defaultBlockRenderMap}
            spellCheck
            handleKeyCommand={this._handleKeyCommand}
            {...otherProps}
            editorState={editorState}
            onChange={this._onChange}
            ref="editor"
            onBlur={this.onBlur}
          />
        </div>
      </div>
    );
  }
}

export default RichEditor;
