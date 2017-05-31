/**
 * Courtesy of markdown-shortcuts-plugins project(https://github.com/ngs/draft-js-markdown-shortcuts-plugin)
 */
import changeCurrentInlineStyle from './changeCurrentInlineStyle';

const inlineMatchers = {
  BOLD: [
    /\*\*([^(?:**)]+)\*\*/g,
    /__([^(?:__)]+)__/g
  ],
  ITALIC: [
    /\*([^*]+)\*/g,
    /_([^_]+)_/g
  ],
  CODE: [
    /`([^`]+)`/g
  ],
  STRIKETHROUGH: [
    /~~([^(?:~~)]+)~~/g
  ]
};

const handleInlineStyle = (editorState, character) => {
  const key = editorState.getSelection().getStartKey();
  const text = editorState.getCurrentContent().getBlockForKey(key).getText();
  const line = `${text}${character}`;
  let newEditorState = editorState;
  Object.keys(inlineMatchers).some((index) => {
    inlineMatchers[index].some((re) => {
      let matchArr;
      do {
        matchArr = re.exec(line);
        if (matchArr) {
          newEditorState = changeCurrentInlineStyle(newEditorState, matchArr, index);
        }
      } while (matchArr);
      return newEditorState !== editorState;
    });
    return newEditorState !== editorState;
  });
  return newEditorState;
};

export default handleInlineStyle;
