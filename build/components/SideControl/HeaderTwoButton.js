'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _BlockButton = require('./BlockButton');

var _BlockButton2 = _interopRequireDefault(_BlockButton);

var _reactSvg = require('react-svg');

var _reactSvg2 = _interopRequireDefault(_reactSvg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (props) {
  return _react2.default.createElement(
    _BlockButton2.default,
    _extends({}, props, { blockType: 'header-two', className: 'DraftJsEditor-header-two' }),
    _react2.default.createElement(_reactSvg2.default, {
      path: '../../icons/h2.svg'
    })
  );
};

module.exports = exports['default'];