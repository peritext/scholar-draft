/**
 * Courtesy of markdown-shortcuts-plugins project(https://github.com/ngs/draft-js-markdown-shortcuts-plugin)
 */
import { EditorState, Modifier } from 'draft-js';

const insertText = ( editorState, text ) => {
  const selection = editorState.getSelection();
  const content = editorState.getCurrentContent();
  const newContentState = Modifier.insertText(
    content,
    selection,
    text,
    editorState.getCurrentInlineStyle()
  );
  return EditorState.push(
    editorState,
    newContentState,
    'insert-fragment'
  );
};

export default insertText;
