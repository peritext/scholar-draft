'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var insertImage = function insertImage(editorState, matchArr) {
  var currentContent = editorState.getCurrentContent();
  var selection = editorState.getSelection();
  var key = selection.getStartKey();

  var _matchArr = (0, _slicedToArray3.default)(matchArr, 4),
      matchText = _matchArr[0],
      alt = _matchArr[1],
      src = _matchArr[2],
      title = _matchArr[3];

  var index = matchArr.index;

  var focusOffset = index + matchText.length;
  var wordSelection = _draftJs.SelectionState.createEmpty(key).merge({
    anchorOffset: index,
    focusOffset: focusOffset
  });
  var nextContent = currentContent.createEntity('IMG', 'IMMUTABLE', { alt: alt, src: src, title: title });
  var entityKey = nextContent.getLastCreatedEntityKey();
  var newContentState = _draftJs.Modifier.replaceText(nextContent, wordSelection, '\u200B', null, entityKey);
  newContentState = _draftJs.Modifier.insertText(newContentState, newContentState.getSelectionAfter(), ' ');
  var newWordSelection = wordSelection.merge({
    focusOffset: index + 1
  });
  var newEditorState = _draftJs.EditorState.push(editorState, newContentState, 'insert-image');
  newEditorState = _draftJs.RichUtils.toggleLink(newEditorState, newWordSelection, entityKey);
  return _draftJs.EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter());
}; /**
    * Courtesy of markdown-shortcuts-plugins project(https://github.com/ngs/draft-js-markdown-shortcuts-plugin)
    */
exports.default = insertImage;
module.exports = exports['default'];