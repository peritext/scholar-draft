'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _draftJsCheckableListItem = require('draft-js-checkable-list-item');

var _draftJs = require('draft-js');

/**
 * Courtesy of markdown-shortcuts-plugins project(https://github.com/ngs/draft-js-markdown-shortcuts-plugin)
 */

var adjustBlockDepth = function adjustBlockDepth(editorState, ev) {
  var newEditorState = _draftJsCheckableListItem.CheckableListItemUtils.onTab(ev, editorState, 4);
  if (newEditorState !== editorState) {
    return newEditorState;
  }
  return _draftJs.RichUtils.onTab(ev, editorState, 4);
};

exports.default = adjustBlockDepth;
module.exports = exports['default'];