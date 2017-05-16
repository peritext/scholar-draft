'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./NotePointer.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NotePointer = function NotePointer(_ref) {
  var children = _ref.children,
      noteId = _ref.noteId,
      note = _ref.note,
      onMouseOver = _ref.onMouseOver,
      onMouseOut = _ref.onMouseOut,
      onMouseClick = _ref.onMouseClick;
  return _react2.default.createElement(
    'sup',
    {
      className: 'scholar-draft-NotePointer',
      onMouseOver: onMouseOver,
      onMouseOut: onMouseOut,
      onClick: onMouseClick
    },
    _react2.default.createElement(
      'span',
      null,
      note && note.order || '°'
    ),
    children
  );
};

NotePointer.propTypes = {
  children: _propTypes2.default.array
};

exports.default = NotePointer;
module.exports = exports['default'];