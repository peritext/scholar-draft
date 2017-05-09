'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = NotePointer;


var NotePointer = function NotePointer(_ref) {
  var children = _ref.children;
  return _react2.default.createElement(
    'span',
    { style: {
        width: '1rem',
        height: '1rem',
        background: 'red',
        borderRadius: '50%',
        display: 'inline-block',
        marginLeft: '.5rem',
        marginRight: '.5rem'
      } },
    children
  );
};
module.exports = exports['default'];