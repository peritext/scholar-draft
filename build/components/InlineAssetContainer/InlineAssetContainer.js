'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

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


  var onMOver = function onMOver(event) {
    if (typeof onMouseOver === 'function') {
      onMouseOver(asset.id, asset, event);
    }
  };

  var onMOut = function onMOut(event) {
    if (typeof onMouseOut === 'function') {
      onMouseOut(asset.id, asset, event);
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

InlineAssetContainer.propTypes = {
  children: _propTypes2.default.array,
  contentState: _propTypes2.default.object,
  asset: _propTypes2.default.object,
  onChange: _propTypes2.default.func,
  onBlur: _propTypes2.default.func,
  onFocus: _propTypes2.default.func,
  onMouseOver: _propTypes2.default.func,
  onMouseOut: _propTypes2.default.func,
  components: _propTypes2.default.object
};

exports.default = InlineAssetContainer;
module.exports = exports['default'];