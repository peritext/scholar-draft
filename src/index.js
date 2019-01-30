/**
 * Scholar-draft
 * entry point of the module
 * @module scholar-draft
 */

import basicEditor from './components/BasicEditor/BasicEditor';
import editor from './components/Editor/Editor';
import * as Utils from './utils';
import * as Constants from './constants';

/**
 * Editor without footnotes support
 */
export const BasicEditor = basicEditor;

/**
 * Draft-js state manipulation and assets management utils
 */
export const utils = Utils;

/**
 * Constant draft-js entity names used by the module
 */
export const constants = Constants;

const Editor = editor;

/**
 * Editor with footnotes support
 */
export default Editor;

