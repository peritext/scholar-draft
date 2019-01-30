"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

/**
 * Courtesy of markdown-shortcuts-plugins project(https://github.com/ngs/draft-js-markdown-shortcuts-plugin)
 */
var Link = function Link(props) {
  var _props$contentState$g = props.contentState.getEntity(props.entityKey).getData(),
      href = _props$contentState$g.href,
      title = _props$contentState$g.title;

  return _react.default.createElement("a", {
    className: 'scholar-draft-Link',
    href: href,
    title: title
  }, props.children);
};

Link.propTypes = {
  contentState: _propTypes.default.object,
  children: _propTypes.default.array,
  entityKey: _propTypes.default.string
};
var _default = Link;
exports.default = _default;
module.exports = exports.default;