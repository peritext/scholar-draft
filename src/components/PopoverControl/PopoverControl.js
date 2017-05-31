import React, { Component } from 'react';
import defaultButtons from './defaultButtons.js';
import PropTypes from 'prop-types';

import './PopoverControl.scss';

export default class PopoverControl extends Component {

  static propTypes = {
		
    toggleInlineStyle: PropTypes.func,
    currentInlineStyle: PropTypes.object,

    iconMap: PropTypes.object,

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

  shouldComponentUpdate = (nextProps, nextState) => {
    return (
      this.props.editorState !== nextProps.editorState
    );
  }

  render = () => {

    const { 
      updateEditorState, 
      editorState, 
      iconMap, 
      buttons, 
    } = this.props;
    const bindRef = (toolbar) => {
      this.toolbar = toolbar;
    };

    return (<div
      className="scholar-draft-PopoverControl"
      ref={bindRef}
    >

      {(buttons || defaultButtons).map((button, key) => React.cloneElement(button, {
          // Pass down some useful props to each button
        updateEditorState,
        editorState,
        iconMap,
        key
      })
      )}
    </div>);
  }
}
