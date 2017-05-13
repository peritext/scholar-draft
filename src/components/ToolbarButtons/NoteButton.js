import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import iconSVG from '../../icons/note.svg';

const styles = {
  iconContainer: {
    display: 'inline-block',
    height: 24,
    width: 24,
  },
};

class NoteButton extends Component {
  
  static propTypes = {

    onClick: PropTypes.func
  };

  render = () => {

    const { 
      onClick, 
      ...otherProps 
    } = this.props;

    return (<div
      style={styles.iconContainer}
      onClick={onClick}
      onMouseDown={e => e.preventDefault()}
      {...otherProps}
    >
      <SVGInline
        svg={iconSVG}
      />
    </div>);
  }
}

export default NoteButton;
