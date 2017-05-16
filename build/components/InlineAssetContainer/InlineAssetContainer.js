'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./InlineAssetContainer.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InlineAssetContainer = function InlineAssetContainer(props) {
  var children = props.children,
      contentState = props.contentState,
      asset = props.asset,
      onChange = props.onChange,
      onBlur = props.onBlur,
      onFocus = props.onFocus,
      onMouseOver = props.onMouseOver,
      onMouseOut = props.onMouseOut,
      components = props.components;


  var onMOver = function onMOver(e) {
    if (typeof onMouseOver === 'function') {
      onMouseOver(asset.id, asset, e);
    }
  };

  var onMOut = function onMOut(e) {
    if (typeof onMouseOut === 'function') {
      onMouseOut(asset.id, asset, e);
    }
  };
  var Component = asset && asset.type && components[asset.type] || null;
  return Component ? _react2.default.createElement(
    'span',
    {
      className: 'scholar-draft-InlineAssetContainer',
      onMouseOver: onMOver,
      onMouseOut: onMOut
    },
    _react2.default.createElement(
      Component,
      {
        asset: asset,
        contentState: contentState,
        onChange: onChange,
        onBlur: onBlur,
        onFocus: onFocus
      },
      children
    )
  ) : null;
};

exports.default = InlineAssetContainer;
module.exports = exports['default'];