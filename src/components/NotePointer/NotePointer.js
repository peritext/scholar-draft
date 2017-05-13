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
  <span
    className="scholar-draft-NotePointer"
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    onClick={onMouseClick}
  >
    <span>{note && note.order || '°'}</span>
    {children}
  </span>
  );


NotePointer.propTypes = {
  children: PropTypes.array
};


export default NotePointer;
