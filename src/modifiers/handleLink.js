/**
 * Courtesy of markdown-shortcuts-plugins project(https://github.com/ngs/draft-js-markdown-shortcuts-plugin)
 */
import insertLink from './insertLink';

const handleLink = ( editorState, character ) => {
  const re = /\[([^\]]+)]\(([^)"]+)(?: "([^"]+)")?\)/g;
  const key = editorState.getSelection().getStartKey();
  const text = editorState.getCurrentContent().getBlockForKey( key ).getText();
  const line = `${text}${character}`;
  let newEditorState = editorState;
  let matchArr;
  do {
    matchArr = re.exec( line );
    if ( matchArr ) {
      newEditorState = insertLink( newEditorState, matchArr );
    }
  } while ( matchArr );
  return newEditorState;
};

export default handleLink;
