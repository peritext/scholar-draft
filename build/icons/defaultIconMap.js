"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _asset = _interopRequireDefault(require("./asset.svg"));

var _bold = _interopRequireDefault(require("./bold.svg"));

var _codeblock = _interopRequireDefault(require("./codeblock.svg"));

var _h = _interopRequireDefault(require("./h1.svg"));

var _h2 = _interopRequireDefault(require("./h2.svg"));

var _italic = _interopRequireDefault(require("./italic.svg"));

var _note = _interopRequireDefault(require("./note.svg"));

var _orderedlist = _interopRequireDefault(require("./orderedlist.svg"));

var _quoteblock = _interopRequireDefault(require("./quoteblock.svg"));

var _unorderedlist = _interopRequireDefault(require("./unorderedlist.svg"));

/* eslint jsx-a11y/img-has-alt: 0 */
// import SVGInline from 'react-svg-inline';
var _default = {
  asset: _react.default.createElement("img", {
    alt: 'asset-icon',
    src: _asset.default
  }),
  bold: _react.default.createElement("img", {
    alt: 'bold-icon',
    src: _bold.default
  }),
  codeblock: _react.default.createElement("img", {
    alt: 'codeblock-icon',
    src: _codeblock.default
  }),
  h1: _react.default.createElement("img", {
    alt: 'h1-icon',
    src: _h.default
  }),
  h2: _react.default.createElement("img", {
    alt: 'h2-icon',
    src: _h2.default
  }),
  italic: _react.default.createElement("img", {
    alt: 'italic-icon',
    src: _italic.default
  }),
  note: _react.default.createElement("img", {
    alt: 'note-icon',
    src: _note.default
  }),
  orderedlist: _react.default.createElement("img", {
    alt: 'orderedlist-icon',
    src: _orderedlist.default
  }),
  quoteblock: _react.default.createElement("img", {
    alt: 'quoteblock-icon',
    src: _quoteblock.default
  }),
  unorderedlist: _react.default.createElement("img", {
    alt: 'unorderedlist-icon',
    src: _unorderedlist.default
  })
};
exports.default = _default;
module.exports = exports.default;