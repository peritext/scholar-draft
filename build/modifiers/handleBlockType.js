"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _draftJsCheckableListItem = require("draft-js-checkable-list-item");

var _draftJs = require("draft-js");

var _changeCurrentBlockType = _interopRequireDefault(require("./changeCurrentBlockType"));

/**
 * Courtesy of markdown-shortcuts-plugins project(https://github.com/ngs/draft-js-markdown-shortcuts-plugin)
 */

/**
 * Courtesy of markdown-shortcuts-plugins project(https://github.com/ngs/draft-js-markdown-shortcuts-plugin)
 */
var sharps = function sharps(len) {
  var ret = '';

  while (ret.length < len) {
    ret += '#';
  }

  return ret;
};

var blockTypes = [null, 'header-one', 'header-two', 'header-three', 'header-four', 'header-five', 'header-six'];

var handleBlockType = function handleBlockType(editorState, character) {
  var currentSelection = editorState.getSelection();
  var key = currentSelection.getStartKey();
  var text = editorState.getCurrentContent().getBlockForKey(key).getText();
  var position = currentSelection.getAnchorOffset();
  var line = [text.slice(0, position), character, text.slice(position)].join('');

  var blockType = _draftJs.RichUtils.getCurrentBlockType(editorState);

  for (var index = 1; index <= 6; index += 1) {
    if (line.indexOf("".concat(sharps(index), " ")) === 0) {
      return (0, _changeCurrentBlockType.default)(editorState, blockTypes[index], line.replace(/^#+\s/, ''));
    }
  }

  var matchArr = line.match(/^[*-] (.*)$/);

  if (matchArr) {
    return (0, _changeCurrentBlockType.default)(editorState, 'unordered-list-item', matchArr[1]);
  }

  matchArr = line.match(/^[\d]\. (.*)$/);

  if (matchArr) {
    return (0, _changeCurrentBlockType.default)(editorState, 'ordered-list-item', matchArr[1]);
  }

  matchArr = line.match(/^> (.*)$/);

  if (matchArr) {
    return (0, _changeCurrentBlockType.default)(editorState, 'blockquote', matchArr[1]);
  }

  matchArr = line.match(/^\[([x ])] (.*)$/i);

  if (matchArr && blockType === 'unordered-list-item') {
    return (0, _changeCurrentBlockType.default)(editorState, _draftJsCheckableListItem.CHECKABLE_LIST_ITEM, matchArr[2], {
      checked: matchArr[1] !== ' '
    });
  }

  return editorState;
};

var _default = handleBlockType;
exports.default = _default;
module.exports = exports.default;