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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint react/prop-types: 0 */

var AssetButton = function AssetButton(_ref) {
  var onClick = _ref.onClick,
      active = _ref.active,
      iconMap = _ref.iconMap,
      otherProps = (0, _objectWithoutProperties3.default)(_ref, ['onClick', 'active', 'iconMap']);

  var onMouseDown = function onMouseDown(event) {
    return event.preventDefault();
  };
  return _react2.default.createElement(
    'div',
    (0, _extends3.default)({
      className: 'scholar-draft-AssetButton' + (active ? ' active' : ''),
      onMouseDown: onMouseDown,
      onClick: onClick
    }, otherProps),
    iconMap.asset
  );
};

AssetButton.propTypes = {

  active: _propTypes2.default.bool,

  iconMap: _propTypes2.default.object,

  onClick: _propTypes2.default.func
};

exports.default = AssetButton;
module.exports = exports['default'];