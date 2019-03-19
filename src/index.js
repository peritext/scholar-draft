/**
 * Scholar-draft
 * entry point of the module
 * @module scholar-draft
 */

import basicEditor from './components/BasicEditor/BasicEditor';
import editor from './components/Editor/Editor';
import * as Utils from './utils';
import * as Constants from './constants';

import inlineAssetContainer from './components/InlineAssetContainer/InlineAssetContainer';
import notePointer from './components/NotePointer/NotePointer';
import quoteContainer from './components/QuoteContainer/QuoteContainer';

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

export const InlineAssetContainer = inlineAssetContainer;
export const NotePointer = notePointer;
export const QuoteContainer = quoteContainer;
