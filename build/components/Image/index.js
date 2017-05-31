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
var Image = function Image(_ref) {
  var entityKey = _ref.entityKey,
      children = _ref.children,
      contentState = _ref.contentState;

  var _contentState$getEnti = contentState.getEntity(entityKey).getData(),
      src = _contentState$getEnti.src,
      alt = _contentState$getEnti.alt,
      title = _contentState$getEnti.title;

  return _react2.default.createElement(
    'span',
    { className: 'scholar-draft-Image' },
    children,
    _react2.default.createElement('img', { src: src, alt: alt, title: title })
  );
};

Image.propTypes = {
  contentState: _propTypes2.default.object,
  entityKey: _propTypes2.default.string,
  children: _propTypes2.default.array
};

exports.default = Image;
module.exports = exports['default'];