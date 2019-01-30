"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _draftJs = require("draft-js");

/**
 * Courtesy of markdown-shortcuts-plugins project(https://github.com/ngs/draft-js-markdown-shortcuts-plugin)
 */
var leaveList = function leaveList(editorState) {
  var contentState = editorState.getCurrentContent();
  var selection = editorState.getSelection();
  var key = selection.getStartKey();
  var currentBlock = contentState.getBlockForKey(key);
  var type = currentBlock.getType();
  return _draftJs.RichUtils.toggleBlockType(editorState, type);
};

var _default = leaveList;
exports.default = _default;
module.exports = exports.default;