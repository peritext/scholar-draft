'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactTooltip = require('react-tooltip');

var _reactTooltip2 = _interopRequireDefault(_reactTooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AssetButton = function (_Component) {
  (0, _inherits3.default)(AssetButton, _Component);

  function AssetButton() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, AssetButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = AssetButton.__proto__ || (0, _getPrototypeOf2.default)(AssetButton)).call.apply(_ref, [this].concat(args))), _this), _this.render = function () {
      var _this$props = _this.props,
          onClick = _this$props.onClick,
          active = _this$props.active,
          iconMap = _this$props.iconMap,
          message = _this$props.message,
          otherProps = (0, _objectWithoutProperties3.default)(_this$props, ['onClick', 'active', 'iconMap', 'message']);

      var onMouseDown = function onMouseDown(event) {
        return event.preventDefault();
      };
      var bindRef = function bindRef(element) {
        _this.element = element;
      };
      return _react2.default.createElement(
        'div',
        (0, _extends3.default)({
          ref: bindRef,
          className: 'scholar-draft-AssetButton' + (active ? ' active' : ''),
          onMouseDown: onMouseDown,
          onClick: onClick,
          'data-tip': message
        }, otherProps),
        iconMap.asset,
        _react2.default.createElement(_reactTooltip2.default, {
          place: active ? 'left' : 'right'
        })
      );
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return AssetButton;
}(_react.Component); /* eslint react/prop-types: 0 */

AssetButton.propTypes = {

  active: _propTypes2.default.bool,

  iconMap: _propTypes2.default.object,

  onClick: _propTypes2.default.func,

  message: _propTypes2.default.string
};

exports.default = AssetButton;
module.exports = exports['default'];