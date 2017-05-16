'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _insertImage = require('./insertImage');

var _insertImage2 = _interopRequireDefault(_insertImage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var handleImage = function handleImage(editorState, character) {
  var re = /!\[([^\]]*)]\(([^)"]+)(?: "([^"]+)")?\)/g;
  var key = editorState.getSelection().getStartKey();
  var text = editorState.getCurrentContent().getBlockForKey(key).getText();
  var line = '' + text + character;
  var newEditorState = editorState;
  var matchArr = void 0;
  do {
    matchArr = re.exec(line);
    if (matchArr) {
      newEditorState = (0, _insertImage2.default)(newEditorState, matchArr);
    }
  } while (matchArr);
  return newEditorState;
}; /**
    * Courtesy of markdown-shortcuts-plugins project(https://github.com/ngs/draft-js-markdown-shortcuts-plugin)
    */
exports.default = handleImage;
module.exports = exports['default'];