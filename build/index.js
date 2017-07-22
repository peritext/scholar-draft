'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constants = exports.utils = exports.BasicEditor = undefined;

var _BasicEditor = require('./components/BasicEditor/BasicEditor');

var _BasicEditor2 = _interopRequireDefault(_BasicEditor);

var _Editor = require('./components/Editor/Editor');

var _Editor2 = _interopRequireDefault(_Editor);

var _utils = require('./utils');

var Utils = _interopRequireWildcard(_utils);

var _constants = require('./constants');

var Constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Editor without footnotes support
 */
/**
 * Scholar-draft
 * entry point of the module
 * @module scholar-draft
 */

var BasicEditor = exports.BasicEditor = _BasicEditor2.default;
/**
 * Draft-js state manipulation and assets management utils
 */
var utils = exports.utils = Utils;
/**
 * Constant draft-js entity names used by the module
 */
var constants = exports.constants = Constants;

var Editor = _Editor2.default;
/**
 * Editor with footnotes support
 */
exports.default = Editor;