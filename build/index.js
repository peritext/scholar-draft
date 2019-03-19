"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuoteContainer = exports.NotePointer = exports.InlineAssetContainer = exports.default = exports.constants = exports.utils = exports.BasicEditor = void 0;

var _BasicEditor = _interopRequireDefault(require("./components/BasicEditor/BasicEditor"));

var _Editor = _interopRequireDefault(require("./components/Editor/Editor"));

var Utils = _interopRequireWildcard(require("./utils"));

var Constants = _interopRequireWildcard(require("./constants"));

var _InlineAssetContainer = _interopRequireDefault(require("./components/InlineAssetContainer/InlineAssetContainer"));

var _NotePointer = _interopRequireDefault(require("./components/NotePointer/NotePointer"));

var _QuoteContainer = _interopRequireDefault(require("./components/QuoteContainer/QuoteContainer"));

/**
 * Scholar-draft
 * entry point of the module
 * @module scholar-draft
 */

/**
 * Editor without footnotes support
 */
var BasicEditor = _BasicEditor.default;
/**
 * Draft-js state manipulation and assets management utils
 */

exports.BasicEditor = BasicEditor;
var utils = Utils;
/**
 * Constant draft-js entity names used by the module
 */

exports.utils = utils;
var constants = Constants;
exports.constants = constants;
var Editor = _Editor.default;
/**
 * Editor with footnotes support
 */

var _default = Editor;
exports.default = _default;
var InlineAssetContainer = _InlineAssetContainer.default;
exports.InlineAssetContainer = InlineAssetContainer;
var NotePointer = _NotePointer.default;
exports.NotePointer = NotePointer;
var QuoteContainer = _QuoteContainer.default;
exports.QuoteContainer = QuoteContainer;