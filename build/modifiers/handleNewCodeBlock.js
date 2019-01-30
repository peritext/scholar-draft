"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _changeCurrentBlockType = _interopRequireDefault(require("./changeCurrentBlockType"));

var _insertEmptyBlock = _interopRequireDefault(require("./insertEmptyBlock"));

/**
 * Courtesy of markdown-shortcuts-plugins project(https://github.com/ngs/draft-js-markdown-shortcuts-plugin)
 */
var handleNewCodeBlock = function handleNewCodeBlock(editorState) {
  var contentState = editorState.getCurrentContent();
  var selection = editorState.getSelection();
  var key = selection.getStartKey();
  var currentBlock = contentState.getBlockForKey(key);
  var matchData = /^```([\w-]+)?$/.exec(currentBlock.getText());
  var isLast = selection.getEndOffset() === currentBlock.getLength();

  if (matchData && isLast) {
    var data = {};
    var language = matchData[1];

    if (language) {
      data.language = language;
    }

    return (0, _changeCurrentBlockType.default)(editorState, 'code-block', '', data);
  }

  var type = currentBlock.getType();

  if (type === 'code-block' && isLast) {
    return (0, _insertEmptyBlock.default)(editorState, 'code-block', currentBlock.getData());
  }

  return editorState;
};

var _default = handleNewCodeBlock;
exports.default = _default;
module.exports = exports.default;