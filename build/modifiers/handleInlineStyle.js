"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _changeCurrentInlineStyle = _interopRequireDefault(require("./changeCurrentInlineStyle"));

/**
 * Courtesy of markdown-shortcuts-plugins project(https://github.com/ngs/draft-js-markdown-shortcuts-plugin)
 */
var inlineMatchers = {
  BOLD: [/\*\*([^(?:**)]+)\*\*/g, /__([^(?:__)]+)__/g],
  ITALIC: [/\*([^*]+)\*/g, /_([^_]+)_/g],
  CODE: [/`([^`]+)`/g],
  STRIKETHROUGH: [/~~([^(?:~~)]+)~~/g]
};

var handleInlineStyle = function handleInlineStyle(editorState, character) {
  var key = editorState.getSelection().getStartKey();
  var text = editorState.getCurrentContent().getBlockForKey(key).getText();
  var line = "".concat(text).concat(character);
  var newEditorState = editorState;
  Object.keys(inlineMatchers).some(function (index) {
    inlineMatchers[index].some(function (re) {
      var matchArr;

      do {
        matchArr = re.exec(line);

        if (matchArr) {
          newEditorState = (0, _changeCurrentInlineStyle.default)(newEditorState, matchArr, index);
        }
      } while (matchArr);

      return newEditorState !== editorState;
    });
    return newEditorState !== editorState;
  });
  return newEditorState;
};

var _default = handleInlineStyle;
exports.default = _default;
module.exports = exports.default;