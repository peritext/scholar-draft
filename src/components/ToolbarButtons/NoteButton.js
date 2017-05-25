import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import iconSVG from '../../icons/note.svg';

class NoteButton extends Component {
  
  static propTypes = {

    onClick: PropTypes.func
  };

  render = () => {

    const { 
      onClick, 
      iconMap,
      ...otherProps 
    } = this.props;

    return (<div
      className="scholar-draft-NoteButton"
      onClick={onClick}
      onMouseDown={e => e.preventDefault()}
      {...otherProps}
    >
      {iconMap.note}
    </div>);
  }
}

export default NoteButton;
