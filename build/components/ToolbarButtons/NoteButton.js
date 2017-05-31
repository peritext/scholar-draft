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

var NoteButton = function NoteButton(_ref) {
  var onClick = _ref.onClick,
      iconMap = _ref.iconMap,
      otherProps = (0, _objectWithoutProperties3.default)(_ref, ['onClick', 'iconMap']);


  var onMouseDown = function onMouseDown(event) {
    return event.preventDefault();
  };

  return _react2.default.createElement(
    'div',
    (0, _extends3.default)({
      className: 'scholar-draft-NoteButton',
      onClick: onClick,
      onMouseDown: onMouseDown
    }, otherProps),
    iconMap.note
  );
};

NoteButton.propTypes = {
  onClick: _propTypes2.default.func,
  iconMap: _propTypes2.default.object
};

exports.default = NoteButton;
module.exports = exports['default'];