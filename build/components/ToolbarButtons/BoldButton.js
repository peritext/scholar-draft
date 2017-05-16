'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _InlineButton = require('./InlineButton.js');

var _InlineButton2 = _interopRequireDefault(_InlineButton);

var _reactSvgInline = require('react-svg-inline');

var _reactSvgInline2 = _interopRequireDefault(_reactSvgInline);

var _bold = require('../../icons/bold.svg');

var _bold2 = _interopRequireDefault(_bold);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (props) {
  return _react2.default.createElement(
    _InlineButton2.default,
    (0, _extends3.default)({}, props, { inlineStyleType: 'BOLD', className: 'DraftJsEditor-BoldButton' }),
    _react2.default.createElement(_reactSvgInline2.default, {
      svg: _bold2.default
    })
  );
};

module.exports = exports['default'];