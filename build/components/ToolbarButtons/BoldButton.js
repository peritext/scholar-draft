'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _InlineButton = require('./InlineButton');

var _InlineButton2 = _interopRequireDefault(_InlineButton);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint react/prop-types: 0 */

exports.default = function (props) {
  return _react2.default.createElement(
    _InlineButton2.default,
    (0, _extends3.default)({}, props, { inlineStyleType: 'BOLD' }),
    props.iconMap.bold
  );
};

module.exports = exports['default'];