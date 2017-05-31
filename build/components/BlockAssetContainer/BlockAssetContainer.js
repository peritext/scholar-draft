'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./BlockAssetContainer.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BlockAssetContainer = function BlockAssetContainer(props) {
  var children = props.children,
      blockProps = props.blockProps;
  var asset = blockProps.asset,
      assetId = blockProps.assetId,
      AssetComponent = blockProps.AssetComponent,
      onChange = blockProps.onChange,
      onBlur = blockProps.onBlur,
      onFocus = blockProps.onFocus,
      onMouseOver = blockProps.onMouseOver,
      onMouseOut = blockProps.onMouseOut;


  var onMOver = function onMOver(event) {
    event.stopPropagation();
    if (typeof onMouseOver === 'function') {
      onMouseOver(asset.id, asset, event);
    }
  };

  var onMOut = function onMOut(event) {
    event.stopPropagation();
    if (typeof onMouseOut === 'function') {
      onMouseOut(asset.id, asset, event);
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
      assetId: assetId,
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

BlockAssetContainer.propTypes = {
  children: _propTypes2.default.array,
  blockProps: _propTypes2.default.shape({
    asset: _propTypes2.default.object,
    assetId: _propTypes2.default.string,

    AssetComponent: _propTypes2.default.func,
    onChange: _propTypes2.default.func,
    onBlur: _propTypes2.default.func,
    onFocus: _propTypes2.default.func,
    onMouseOver: _propTypes2.default.func,
    onMouseOut: _propTypes2.default.func
  })
};

exports.default = BlockAssetContainer;
module.exports = exports['default'];