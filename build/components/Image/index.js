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
var Image = function Image(_ref) {
  var entityKey = _ref.entityKey,
      children = _ref.children,
      contentState = _ref.contentState;

  var _contentState$getEnti = contentState.getEntity(entityKey).getData(),
      src = _contentState$getEnti.src,
      alt = _contentState$getEnti.alt,
      title = _contentState$getEnti.title;

  return _react.default.createElement("span", {
    className: 'scholar-draft-Image'
  }, children, _react.default.createElement("img", {
    src: src,
    alt: alt,
    title: title
  }));
};

Image.propTypes = {
  contentState: _propTypes.default.object,
  entityKey: _propTypes.default.string,
  children: _propTypes.default.array
};
var _default = Image;
exports.default = _default;
module.exports = exports.default;