/* eslint react/no-did-mount-set-state : 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './NotePointer.scss';

class NotePointer extends Component {

  static contextTypes = {
    emitter: PropTypes.object,
    notes: PropTypes.object,

    onNoteMouseOver: PropTypes.func,
    onNoteMouseOut: PropTypes.func,
    onNoteClick: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState({
      note: this.context.notes && this.context.notes[this.props.noteId]
    });
    this.unsubscribe = this.context.emitter.subscribeToNotes((notes) => {
      const note = notes[this.props.noteId];
      this.setState({
        note
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render = () => {
    const {
      note
    } = this.state;

    const {
      onNoteMouseOver,
      onNoteMouseOut,
      onNoteClick,
    } = this.context;

    const {
      children
    } = this.props;

    const onMouseOver = (event) => {
      event.stopPropagation();
      if (typeof onNoteMouseOver === 'function') {
        onNoteMouseOver(note.id, note, event);
      }
    };

    const onMouseOut = (event) => {
      event.stopPropagation();
      if (typeof onNoteMouseOut === 'function') {
        onNoteMouseOut(note.id, note, event);
      }
    };

    const onMouseClick = (event) => {
      event.stopPropagation();
      if (typeof onNoteClick === 'function') {
        onNoteClick(note.id, note, event);
      }
    };

    return (
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
  }
}

NotePointer.propTypes = {
  children: PropTypes.array,
  noteId: PropTypes.string,
};

export default NotePointer;
