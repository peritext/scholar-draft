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
 * Courtesy of markdown-shortcuts-plugins project(https://github.com/ngs/draft-js-markdown-shortcuts-plugin)
 */
var Link = function Link(props) {
  var _props$contentState$g = props.contentState.getEntity(props.entityKey).getData(),
      href = _props$contentState$g.href,
      title = _props$contentState$g.title;

  return _react2.default.createElement(
    'a',
    { className: 'scholar-draft-Link', href: href, title: title },
    props.children
  );
};

Link.propTypes = {
  contentState: _propTypes2.default.object,
  children: _propTypes2.default.array,
  entityKey: _propTypes2.default.string
};

exports.default = Link;
module.exports = exports['default'];