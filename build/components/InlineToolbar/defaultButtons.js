"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _BlockQuoteButton = _interopRequireDefault(require("../ToolbarButtons/BlockQuoteButton"));

var _BoldButton = _interopRequireDefault(require("../ToolbarButtons/BoldButton"));

var _CodeBlockButton = _interopRequireDefault(require("../ToolbarButtons/CodeBlockButton"));

var _HeaderOneButton = _interopRequireDefault(require("../ToolbarButtons/HeaderOneButton"));

var _HeaderTwoButton = _interopRequireDefault(require("../ToolbarButtons/HeaderTwoButton"));

var _ItalicButton = _interopRequireDefault(require("../ToolbarButtons/ItalicButton"));

var _OrderedListItemButton = _interopRequireDefault(require("../ToolbarButtons/OrderedListItemButton"));

var _UnorderedListItemButton = _interopRequireDefault(require("../ToolbarButtons/UnorderedListItemButton"));

var _default = [_react.default.createElement(_BoldButton.default, {
  key: 0
}), _react.default.createElement(_ItalicButton.default, {
  key: 1
}), _react.default.createElement(_BlockQuoteButton.default, {
  key: 2
}), _react.default.createElement(_HeaderOneButton.default, {
  key: 3
}), _react.default.createElement(_HeaderTwoButton.default, {
  key: 4
}), _react.default.createElement(_OrderedListItemButton.default, {
  key: 5
}), _react.default.createElement(_UnorderedListItemButton.default, {
  key: 6
}), _react.default.createElement(_CodeBlockButton.default, {
  key: 7
})];
exports.default = _default;
module.exports = exports.default;