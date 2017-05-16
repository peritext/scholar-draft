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

var _italic = require('../../icons/italic.svg');

var _italic2 = _interopRequireDefault(_italic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (props) {
  return _react2.default.createElement(
    _InlineButton2.default,
    (0, _extends3.default)({}, props, { inlineStyleType: 'ITALIC', className: 'DraftJsEditor-ItalicButton' }),
    _react2.default.createElement(_reactSvgInline2.default, {
      svg: _italic2.default
    })
  );
};

module.exports = exports['default'];