'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./BlockAssetContainer.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BlockAssetContainer = function (_Component) {
  (0, _inherits3.default)(BlockAssetContainer, _Component);

  function BlockAssetContainer(props) {
    (0, _classCallCheck3.default)(this, BlockAssetContainer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (BlockAssetContainer.__proto__ || (0, _getPrototypeOf2.default)(BlockAssetContainer)).call(this, props));

    _this.render = function () {
      var _this$state = _this.state,
          asset = _this$state.asset,
          renderingMode = _this$state.renderingMode,
          customContext = _this$state.customContext;

      if (!asset) {
        return null;
      }

      var _this$context = _this.context,
          onAssetMouseOver = _this$context.onAssetMouseOver,
          onAssetMouseOut = _this$context.onAssetMouseOut,
          onAssetChange = _this$context.onAssetChange,
          onAssetFocus = _this$context.onAssetFocus,
          onAssetBlur = _this$context.onAssetBlur,
          iconMap = _this$context.iconMap;
      var _this$props = _this.props,
          _this$props$blockProp = _this$props.blockProps,
          assetId = _this$props$blockProp.assetId,
          AssetComponent = _this$props$blockProp.AssetComponent,
          children = _this$props.children;


      var onMOver = function onMOver(event) {
        event.stopPropagation();
        if (typeof onMouseOver === 'function') {
          onAssetMouseOver(asset.id, asset, event);
        }
      };

      var onMOut = function onMOut(event) {
        event.stopPropagation();
        if (typeof onMouseOut === 'function') {
          onAssetMouseOut(asset.id, asset, event);
        }
      };

      var renderEmptyComponent = function renderEmptyComponent() {
        return _react2.default.createElement('div', null);
      };

      var RealAssetComponent = typeof AssetComponent === 'function' ? AssetComponent : renderEmptyComponent;

      return _react2.default.createElement(
        'div',
        {
          className: 'scholar-draft-BlockAssetContainer',
          onMouseOver: onMOver,
          onFocus: onMOver,
          onMouseOut: onMOut,
          onBlur: onMOut
        },
        _react2.default.createElement(
          RealAssetComponent,
          {
            assetId: assetId,
            asset: asset,
            customContext: customContext,
            onAssetChange: onAssetChange,
            onAssetFocus: onAssetFocus,
            onAssetBlur: onAssetBlur,
            iconMap: iconMap,
            renderingMode: renderingMode
          },
          children
        )
      );
    };

    _this.state = {};
    return _this;
  }

  (0, _createClass3.default)(BlockAssetContainer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.setState({
        asset: this.context.assets[this.props.blockProps.assetId],
        renderingMode: this.props.blockProps.renderingMode
      });
      this.unsubscribe = this.context.emitter.subscribeToAssets(function (assets) {
        var asset = assets[_this2.props.blockProps.assetId];
        // if (asset !== this.state.asset) {
        _this2.setState({
          asset: asset
        });
        // }
      });

      this.unsubscribeToCustomContext = this.context.emitter.subscribeToCustomContext(function (customContext) {
        if (customContext !== _this2.state.customContext) {
          _this2.setState({
            customContext: customContext
          });
        }
      });

      this.unsubscribeToRenderingMode = this.context.emitter.subscribeToRenderingMode(function (renderingMode) {
        // if (this.state.renderingMode !== renderingMode) {
        _this2.setState({
          renderingMode: renderingMode
        });
        // }
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unsubscribe();
      this.unsubscribeToRenderingMode();
      this.unsubscribeToCustomContext();
    }
  }]);
  return BlockAssetContainer;
}(_react.Component); /* eslint react/no-did-mount-set-state : 0 */
/**
 * This module exports a wrapper for block assets.
 * It handles context-related interactions with upstream environment
 * and provides a simple prop-based api to the asset components passed
 * at editor's implementation
 * @module scholar-draft/BlockAssetContainer
 */


BlockAssetContainer.contextTypes = {
  emitter: _propTypes2.default.object,
  assets: _propTypes2.default.object,
  iconMap: _propTypes2.default.object,

  renderingMode: _propTypes2.default.string,

  onAssetMouseOver: _propTypes2.default.func,
  onAssetMouseOut: _propTypes2.default.func,
  onAssetChange: _propTypes2.default.func,
  onAssetFocus: _propTypes2.default.func,
  onAssetBlur: _propTypes2.default.func
};


BlockAssetContainer.propTypes = {
  children: _propTypes2.default.array,
  assetId: _propTypes2.default.string,
  blockProps: _propTypes2.default.shape({
    assetId: _propTypes2.default.string,
    AssetComponent: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.element]),
    renderingMode: _propTypes2.default.string
  })
};

exports.default = BlockAssetContainer;
module.exports = exports['default'];