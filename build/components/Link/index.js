"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Link = function Link(props) {
  var _props$contentState$g = props.contentState.getEntity(props.entityKey).getData(),
      href = _props$contentState$g.href,
      title = _props$contentState$g.title;

  return _react2.default.createElement(
    "a",
    { className: "scholar-draft-Link", href: href, title: title },
    props.children
  );
}; /**
    * Courtesy of markdown-shortcuts-plugins project(https://github.com/ngs/draft-js-markdown-shortcuts-plugin)
    */
exports.default = Link;
module.exports = exports["default"];