"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _InlineButton = _interopRequireDefault(require("./InlineButton"));

/* eslint react/prop-types: 0 */
var _default = function _default(props) {
  return _react.default.createElement(_InlineButton.default, (0, _extends2.default)({}, props, {
    inlineStyleType: 'ITALIC'
  }), props.iconMap.italic);
};

exports.default = _default;
module.exports = exports.default;