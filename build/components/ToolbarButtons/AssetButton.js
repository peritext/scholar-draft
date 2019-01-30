"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

/* eslint react/prop-types: 0 */
var AssetButton =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(AssetButton, _Component);

  function AssetButton() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, AssetButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(AssetButton)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "render", function () {
      var _this$props = _this.props,
          onClick = _this$props.onClick,
          active = _this$props.active,
          iconMap = _this$props.iconMap,
          message = _this$props.message,
          otherProps = (0, _objectWithoutProperties2.default)(_this$props, ["onClick", "active", "iconMap", "message"]);

      var onMouseDown = function onMouseDown(event) {
        return event.preventDefault();
      };

      var bindRef = function bindRef(element) {
        _this.element = element;
      };

      return _react.default.createElement("div", (0, _extends2.default)({
        ref: bindRef,
        className: "scholar-draft-AssetButton".concat(active ? ' active' : ''),
        onMouseDown: onMouseDown,
        onClick: onClick,
        "data-tip": message
      }, otherProps), iconMap.asset, _react.default.createElement(_reactTooltip.default, {
        place: active ? 'left' : 'right'
      }));
    });
    return _this;
  }

  return AssetButton;
}(_react.Component);

AssetButton.propTypes = {
  active: _propTypes.default.bool,
  iconMap: _propTypes.default.object,
  onClick: _propTypes.default.func,
  message: _propTypes.default.string
};
var _default = AssetButton;
exports.default = _default;
module.exports = exports.default;