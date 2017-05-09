import React from 'react';
import PropTypes from 'prop-types';

import './NotePointer.scss';

export default NotePointer;

const NotePointer = ({
  children
}) => (
  <span
    className="NotePointer"
  >
    {children}
  </span>
);


NotePointer.propTypes = {
  children: PropTypes.object
};
