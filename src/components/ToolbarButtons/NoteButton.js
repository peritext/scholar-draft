
import React from 'react';
import PropTypes from 'prop-types';

const NoteButton = ({ 
  onClick, 
  iconMap,
  ...otherProps 
}) => {

  const onMouseDown = event => event.preventDefault();

  return (<div
    className="scholar-draft-NoteButton"
    onClick={onClick}
    onMouseDown={onMouseDown}
    {...otherProps}
  >
    {iconMap.note}
  </div>);
};

NoteButton.propTypes = {
  onClick: PropTypes.func,
  iconMap: PropTypes.object 
};

export default NoteButton;
