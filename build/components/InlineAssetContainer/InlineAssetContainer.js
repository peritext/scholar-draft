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

require('./InlineAssetContainer.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InlineAssetContainer = function (_Component) {
  (0, _inherits3.default)(InlineAssetContainer, _Component);

  function InlineAssetContainer(props) {
    (0, _classCallCheck3.default)(this, InlineAssetContainer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (InlineAssetContainer.__proto__ || (0, _getPrototypeOf2.default)(InlineAssetContainer)).call(this, props));

    _this.render = function () {
      var asset = _this.state.asset;

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
          assetId = _this$props.assetId,
          AssetComponent = _this$props.AssetComponent,
          children = _this$props.children;


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

      return _react2.default.createElement(
        'span',
        {
          className: 'scholar-draft-InlineAssetContainer',
          onMouseOver: onMOver,
          onMouseOut: onMOut
        },
        _react2.default.createElement(AssetComponent, {
          assetId: assetId,
          asset: asset,
          onAssetChange: onAssetChange,
          onAssetFocus: onAssetFocus,
          onAssetBlur: onAssetBlur,
          iconMap: iconMap
        }),
        _react2.default.createElement(
          'span',
          null,
          children
        )
      );
    };

    _this.state = {};
    return _this;
  }

  (0, _createClass3.default)(InlineAssetContainer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.setState({
        asset: this.context.assets[this.props.assetId]
      });
      this.unsubscribe = this.context.emitter.subscribe(function (assets) {
        var asset = assets[_this2.props.assetId];
        _this2.setState({
          asset: asset
        });
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unsubscribe();
    }
  }]);
  return InlineAssetContainer;
}(_react.Component); /* eslint react/no-did-mount-set-state : 0 */


InlineAssetContainer.contextTypes = {
  emitter: _propTypes2.default.object,
  assets: _propTypes2.default.object,
  iconMap: _propTypes2.default.object,

  onAssetMouseOver: _propTypes2.default.func,
  onAssetMouseOut: _propTypes2.default.func,
  onAssetChange: _propTypes2.default.func,
  onAssetFocus: _propTypes2.default.func,
  onAssetBlur: _propTypes2.default.func
};


InlineAssetContainer.propTypes = {
  children: _propTypes2.default.array,
  assetId: _propTypes2.default.string,
  AssetComponent: _propTypes2.default.func
};

exports.default = InlineAssetContainer;
module.exports = exports['default'];