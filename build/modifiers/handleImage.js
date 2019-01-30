"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _insertImage = _interopRequireDefault(require("./insertImage"));

/**
 * Courtesy of markdown-shortcuts-plugins project(https://github.com/ngs/draft-js-markdown-shortcuts-plugin)
 */
var handleImage = function handleImage(editorState, character) {
  var re = /!\[([^\]]*)]\(([^)"]+)(?: "([^"]+)")?\)/g;
  var key = editorState.getSelection().getStartKey();
  var text = editorState.getCurrentContent().getBlockForKey(key).getText();
  var line = "".concat(text).concat(character);
  var newEditorState = editorState;
  var matchArr;

  do {
    matchArr = re.exec(line);

    if (matchArr) {
      newEditorState = (0, _insertImage.default)(newEditorState, matchArr);
    }
  } while (matchArr);

  return newEditorState;
};

var _default = handleImage;
exports.default = _default;
module.exports = exports.default;