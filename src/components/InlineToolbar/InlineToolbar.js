/**
 * This module exports a react component for editors' pop-up toolbar 
 * allowing to style selected text
 * @module scholar-draft/InlineToolbar
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import defaultButtons from './defaultButtons';

import './InlineToolbar.scss';

export default class InlineToolbar extends Component {

  static propTypes = {
    iconMap: PropTypes.object,

    /**
     * The current editorState
     */
    editorState: PropTypes.object,

    /**
     * The current style
     */
    style: PropTypes.object,

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

  shouldComponentUpdate = (nextProps, nextState) => (
      this.props.editorState !== nextProps.editorState ||
      this.props.style !== nextProps.style
    )

  render = () => {

    const { 
      updateEditorState, 
      editorState, 
      iconMap, 
      buttons, 
      style,
    } = this.props;
    const bindRef = (toolbar) => {
      this.toolbar = toolbar;
    };

    return (<div
      className="scholar-draft-InlineToolbar"
      ref={bindRef}
      style={style}
    >
      {(buttons || defaultButtons).map((button, key) => React.cloneElement(button, {
          // Pass down some useful props to each button
        updateEditorState,
        editorState,
        iconMap,
        key /* eslint react/no-array-index-key:0 */
      })
      )}
    </div>);
  }
}
