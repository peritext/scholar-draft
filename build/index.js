"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.constants = exports.utils = exports.BasicEditor = void 0;

var _BasicEditor = _interopRequireDefault(require("./components/BasicEditor/BasicEditor"));

var _Editor = _interopRequireDefault(require("./components/Editor/Editor"));

var Utils = _interopRequireWildcard(require("./utils"));

var Constants = _interopRequireWildcard(require("./constants"));

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