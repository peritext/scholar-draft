'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BoldButton = require('./BoldButton');

var _BoldButton2 = _interopRequireDefault(_BoldButton);

var _ItalicButton = require('./ItalicButton');

var _ItalicButton2 = _interopRequireDefault(_ItalicButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [_react2.default.createElement(_BoldButton2.default, null), _react2.default.createElement(_ItalicButton2.default, null)];
module.exports = exports['default'];