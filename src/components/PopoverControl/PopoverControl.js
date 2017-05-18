import React, { Component } from 'react';
import defaultButtons from './defaultButtons.js';
import PropTypes from 'prop-types';

import './PopoverControl.scss';

export default class PopoverControl extends Component {

  static propTypes = {
		/**
		 * The popover container style
		 */
    style: PropTypes.object,
		
    toggleInlineStyle: PropTypes.func,
    currentInlineStyle: PropTypes.object,

		/**
		 * The icon fill colour
		 */
    iconColor: PropTypes.string,

		/**
		 * The icon fill colour when selected
		 */
    iconSelectedColor: PropTypes.string,

    /**
     * The current editorState
     */
    editorState: PropTypes.object,

    /**
     * Can call this to update the editor state
     */
    updateEditorState: PropTypes.func,

    /**
     * The inline buttons to use, if this is omitted will use the default
     * buttons, bold, italic and link.
     */
    buttons: PropTypes.array,
  };

  static defaultProps = {
    iconColor: '#000000',
    iconSelectedColor: '#2000FF',
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    return (
      this.props.editorState !== nextProps.editorState
    );
  }

  render = () => {

    const { 
      updateEditorState, 
      editorState, 
      iconColor = 'black', 
      iconSelectedColor = 'red', 
      buttons, 
    } = this.props;
    const bindRef = (toolbar) => {
      this.toolbar = toolbar;
    };

    return (<div
      className="scholar-draft-PopoverControl"
      style={Object.assign({}, this.props.style)}
      ref={bindRef}
    >

      {(buttons || defaultButtons).map((button, key) => React.cloneElement(button, {
          // Pass down some useful props to each button
        updateEditorState,
        editorState,
        iconColor,
        iconSelectedColor,
        key
      })
      )}
    </div>);
  }
}
