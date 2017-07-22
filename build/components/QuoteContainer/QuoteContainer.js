'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This module exports a react component for wrapping quotes 
 * (and possibly styling them in a specific way)
 * @module scholar-draft/Quote
 */
var Quote = function Quote(props) {
  return _react2.default.createElement(
    'q',
    { className: 'scholar-draft-QuoteContainer' },
    props.children
  );
};

Quote.propTypes = {
  children: _propTypes2.default.array
};

exports.default = Quote;
module.exports = exports['default'];