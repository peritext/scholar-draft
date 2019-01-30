"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _BoldButton = _interopRequireDefault(require("./BoldButton"));

var _ItalicButton = _interopRequireDefault(require("./ItalicButton"));

var _default = [_react.default.createElement(_BoldButton.default, {
  key: 0
}), _react.default.createElement(_ItalicButton.default, {
  key: 1
})];
exports.default = _default;
module.exports = exports.default;