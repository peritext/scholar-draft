"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

require("./InlineAssetContainer.scss");

/* eslint react/no-did-mount-set-state : 0 */

/**
 * This module exports a wrapper for block assets.
 * It handles context-related interactions with upstream environment
 * and provides a simple prop-based api to the asset components passed
 * at editor's implementation
 * @module scholar-draft/BlockAssetContainer
 */
var InlineAssetContainer =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(InlineAssetContainer, _Component);

  function InlineAssetContainer(props) {
    var _this;

    (0, _classCallCheck2.default)(this, InlineAssetContainer);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(InlineAssetContainer).call(this, props));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "render", function () {
      var _this$state = _this.state,
          asset = _this$state.asset,
          assetId = _this$state.assetId,
          renderingMode = _this$state.renderingMode,
          customContext = _this$state.customContext,
          AssetComponent = _this$state.AssetComponent;

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
      var children = _this.props.children;

      if (!AssetComponent) {
        return null;
      }

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

      return _react.default.createElement("span", {
        className: 'scholar-draft-InlineAssetContainer',
        onMouseOver: onMOver,
        onFocus: onMOver,
        onMouseOut: onMOut,
        onBlur: onMOut
      }, _react.default.createElement(AssetComponent, {
        assetId: assetId,
        asset: asset,
        customContext: customContext,
        onAssetChange: onAssetChange,
        onAssetFocus: onAssetFocus,
        onAssetBlur: onAssetBlur,
        iconMap: iconMap,
        renderingMode: renderingMode
      }, children));
    });
    _this.state = {};
    return _this;
  }

  (0, _createClass2.default)(InlineAssetContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _this$props = this.props,
          entityKey = _this$props.entityKey,
          contentState = _this$props.contentState;
      var getAssetComponent = this.context.getAssetComponent;
      var entity = contentState.getEntity(entityKey);

      var _entity$getData = entity.getData(),
          entityAsset = _entity$getData.asset;

      var asset;
      var assetId;
      var AssetComponent;

      if (entityAsset) {
        var id = entityAsset.id;
        assetId = id;
        asset = this.context.assets[assetId];
        AssetComponent = getAssetComponent(asset);
      }

      this.setState({
        asset: asset,
        assetId: assetId,
        renderingMode: this.props.renderingMode,
        AssetComponent: AssetComponent
      });
      this.unsubscribeToAssets = this.context.emitter.subscribeToAssets(function (assets) {
        var newAsset = assets[_this2.state.assetId];
        AssetComponent = _this2.context.getAssetComponent(newAsset);

        if (newAsset !== _this2.state.asset) {
          _this2.setState({
            asset: newAsset,
            AssetComponent: AssetComponent
          });
        }
      });
      this.unsubscribeToCustomContext = this.context.emitter.subscribeToCustomContext(function (customContext) {
        if (customContext !== _this2.state.customContext) {
          _this2.setState({
            customContext: customContext
          });
        }
      });
      this.unsubscribeToRenderingMode = this.context.emitter.subscribeToRenderingMode(function (renderingMode) {
        if (_this2.state.renderingMode !== renderingMode) {
          _this2.setState({
            renderingMode: renderingMode
          });
        }
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unsubscribeToAssets();
      this.unsubscribeToRenderingMode();
      this.unsubscribeToCustomContext();
    }
  }]);
  return InlineAssetContainer;
}(_react.Component);

(0, _defineProperty2.default)(InlineAssetContainer, "contextTypes", {
  emitter: _propTypes.default.object,
  assets: _propTypes.default.object,
  iconMap: _propTypes.default.object,
  renderingMode: _propTypes.default.string,
  onAssetMouseOver: _propTypes.default.func,
  onAssetMouseOut: _propTypes.default.func,
  onAssetChange: _propTypes.default.func,
  onAssetFocus: _propTypes.default.func,
  onAssetBlur: _propTypes.default.func,
  getAssetComponent: _propTypes.default.func
});
InlineAssetContainer.propTypes = {
  children: _propTypes.default.array,
  assetId: _propTypes.default.string,
  AssetComponent: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.element]),
  renderingMode: _propTypes.default.string
};
var _default = InlineAssetContainer;
exports.default = _default;
module.exports = exports.default;