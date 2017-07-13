'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactTooltip = require('react-tooltip');

var _reactTooltip2 = _interopRequireDefault(_reactTooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AssetButton = function AssetButton(_ref) {
  var onClick = _ref.onClick,
      active = _ref.active,
      iconMap = _ref.iconMap,
      message = _ref.message,
      otherProps = (0, _objectWithoutProperties3.default)(_ref, ['onClick', 'active', 'iconMap', 'message']);

  var onMouseDown = function onMouseDown(event) {
    return event.preventDefault();
  };
  return _react2.default.createElement(
    'div',
    (0, _extends3.default)({
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
}; /* eslint react/prop-types: 0 */

AssetButton.propTypes = {

  active: _propTypes2.default.bool,

  iconMap: _propTypes2.default.object,

  onClick: _propTypes2.default.func,

  message: _propTypes2.default.string
};

exports.default = AssetButton;
module.exports = exports['default'];