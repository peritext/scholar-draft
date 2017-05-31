import React from 'react';
import PropTypes from 'prop-types';

import './NotePointer.scss';

const NotePointer = ({
  children,
  noteId,
  note,
  onMouseOver,
  onMouseOut,
  onMouseClick
}) => (
  <sup
    className="scholar-draft-NotePointer"
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    onClick={onMouseClick}
  >
    <span>{(note && note.order) || '*'}</span>
    {children}
  </sup>
  );


NotePointer.propTypes = {
  children: PropTypes.array,
  noteId: PropTypes.string,
  note: PropTypes.object,
  // iconMap: PropTypes.object,

  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  onMouseClick: PropTypes.func,
};


export default NotePointer;
