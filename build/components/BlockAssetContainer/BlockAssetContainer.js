'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./BlockAssetContainer.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BlockAssetContainer = function BlockAssetContainer(props) {
  var children = props.children,
      blockProps = props.blockProps;
  var asset = blockProps.asset,
      AssetComponent = blockProps.AssetComponent,
      onChange = blockProps.onChange,
      onBlur = blockProps.onBlur,
      onFocus = blockProps.onFocus,
      onMouseOver = blockProps.onMouseOver,
      onMouseOut = blockProps.onMouseOut;


  var onMOver = function onMOver(e) {
    e.stopPropagation();
    if (typeof onMouseOver === 'function') {
      onMouseOver(asset.id, asset, e);
    }
  };

  var onMOut = function onMOut(e) {
    e.stopPropagation();
    if (typeof onMouseOut === 'function') {
      onMouseOut(asset.id, asset, e);
    }
  };
  return _react2.default.createElement(
    'div',
    {
      className: 'scholar-draft-BlockAssetContainer',
      onMouseOver: onMOver,
      onMouseOut: onMOut
    },
    _react2.default.createElement(AssetComponent, {
      asset: asset,
      onChange: onChange,
      onBlur: onBlur,
      onFocus: onFocus
    }),
    _react2.default.createElement(
      'div',
      null,
      children
    )
  );
};

exports.default = BlockAssetContainer;
module.exports = exports['default'];