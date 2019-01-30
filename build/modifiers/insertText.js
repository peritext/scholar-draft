"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _draftJs = require("draft-js");

/**
 * Courtesy of markdown-shortcuts-plugins project(https://github.com/ngs/draft-js-markdown-shortcuts-plugin)
 */
var insertText = function insertText(editorState, text) {
  var selection = editorState.getSelection();
  var content = editorState.getCurrentContent();

  var newContentState = _draftJs.Modifier.insertText(content, selection, text, editorState.getCurrentInlineStyle());

  return _draftJs.EditorState.push(editorState, newContentState, 'insert-fragment');
};

var _default = insertText;
exports.default = _default;
module.exports = exports.default;