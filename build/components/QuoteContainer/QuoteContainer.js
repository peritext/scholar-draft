"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

/**
 * This module exports a react component for wrapping quotes 
 * (and possibly styling them in a specific way)
 * @module scholar-draft/Quote
 */
var Quote = function Quote(props) {
  return _react.default.createElement("q", {
    className: "scholar-draft-QuoteContainer"
  }, props.children);
};

Quote.propTypes = {
  children: _propTypes.default.array
};
var _default = Quote;
exports.default = _default;
module.exports = exports.default;