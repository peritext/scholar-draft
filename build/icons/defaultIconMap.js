'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _asset = require('./asset.svg');

var _asset2 = _interopRequireDefault(_asset);

var _bold = require('./bold.svg');

var _bold2 = _interopRequireDefault(_bold);

var _codeblock = require('./codeblock.svg');

var _codeblock2 = _interopRequireDefault(_codeblock);

var _h = require('./h1.svg');

var _h2 = _interopRequireDefault(_h);

var _h3 = require('./h2.svg');

var _h4 = _interopRequireDefault(_h3);

var _italic = require('./italic.svg');

var _italic2 = _interopRequireDefault(_italic);

var _note = require('./note.svg');

var _note2 = _interopRequireDefault(_note);

var _orderedlist = require('./orderedlist.svg');

var _orderedlist2 = _interopRequireDefault(_orderedlist);

var _quoteblock = require('./quoteblock.svg');

var _quoteblock2 = _interopRequireDefault(_quoteblock);

var _unorderedlist = require('./unorderedlist.svg');

var _unorderedlist2 = _interopRequireDefault(_unorderedlist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import SVGInline from 'react-svg-inline';

exports.default = {
  asset: _react2.default.createElement('img', { src: _asset2.default }),
  bold: _react2.default.createElement('img', { src: _bold2.default }),
  codeblock: _react2.default.createElement('img', { src: _codeblock2.default }),
  h1: _react2.default.createElement('img', { src: _h2.default }),
  h2: _react2.default.createElement('img', { src: _h4.default }),
  italic: _react2.default.createElement('img', { src: _italic2.default }),
  note: _react2.default.createElement('img', { src: _note2.default }),
  orderedlist: _react2.default.createElement('img', { src: _orderedlist2.default }),
  quoteblock: _react2.default.createElement('img', { src: _quoteblock2.default }),
  unorderedlist: _react2.default.createElement('img', { src: _unorderedlist2.default })
}; /* eslint jsx-a11y/img-has-alt: 0 */

module.exports = exports['default'];