"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactTooltip = _interopRequireDefault(require("react-tooltip"));

var NoteButton = function NoteButton(_ref) {
  var onClick = _ref.onClick,
      iconMap = _ref.iconMap,
      message = _ref.message,
      otherProps = (0, _objectWithoutProperties2.default)(_ref, ["onClick", "iconMap", "message"]);

  var onMouseDown = function onMouseDown(event) {
    return event.preventDefault();
  };

  return _react.default.createElement("div", (0, _extends2.default)({
    className: "scholar-draft-NoteButton",
    onClick: onClick,
    onMouseDown: onMouseDown,
    "data-tip": message
  }, otherProps), iconMap.note, _react.default.createElement(_reactTooltip.default, {
    place: "right"
  }));
};

NoteButton.propTypes = {
  onClick: _propTypes.default.func,
  iconMap: _propTypes.default.object,
  message: _propTypes.default.string
};
var _default = NoteButton;
exports.default = _default;
module.exports = exports.default;