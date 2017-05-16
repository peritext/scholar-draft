"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Image = function Image(_ref) {
  var entityKey = _ref.entityKey,
      children = _ref.children,
      contentState = _ref.contentState;

  var _contentState$getEnti = contentState.getEntity(entityKey).getData(),
      src = _contentState$getEnti.src,
      alt = _contentState$getEnti.alt,
      title = _contentState$getEnti.title;

  return _react2.default.createElement(
    "span",
    { className: "scholar-draft-Image" },
    children,
    _react2.default.createElement("img", { src: src, alt: alt, title: title })
  );
}; /**
    * Courtesy of markdown-shortcuts-plugins project(https://github.com/ngs/draft-js-markdown-shortcuts-plugin)
    */
exports.default = Image;
module.exports = exports["default"];