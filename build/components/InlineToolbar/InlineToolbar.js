"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _defaultButtons = _interopRequireDefault(require("./defaultButtons"));

require("./InlineToolbar.scss");

/**
 * This module exports a react component for editors' pop-up toolbar 
 * allowing to style selected text
 * @module scholar-draft/InlineToolbar
 */
var InlineToolbar =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(InlineToolbar, _Component);

  function InlineToolbar() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, InlineToolbar);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(InlineToolbar)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "shouldComponentUpdate", function (nextProps, nextState) {
      return _this.props.editorState !== nextProps.editorState || _this.props.style !== nextProps.style;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "render", function () {
      var _this$props = _this.props,
          updateEditorState = _this$props.updateEditorState,
          editorState = _this$props.editorState,
          iconMap = _this$props.iconMap,
          buttons = _this$props.buttons,
          style = _this$props.style;

      var bindRef = function bindRef(toolbar) {
        _this.toolbar = toolbar;
      };

      return _react.default.createElement("div", {
        className: "scholar-draft-InlineToolbar",
        ref: bindRef,
        style: style
      }, (buttons || _defaultButtons.default).map(function (button, key) {
        return _react.default.cloneElement(button, {
          // Pass down some useful props to each button
          updateEditorState: updateEditorState,
          editorState: editorState,
          iconMap: iconMap,
          key: key
          /* eslint react/no-array-index-key:0 */

        });
      }));
    });
    return _this;
  }

  return InlineToolbar;
}(_react.Component);

exports.default = InlineToolbar;
(0, _defineProperty2.default)(InlineToolbar, "propTypes", {
  iconMap: _propTypes.default.object,

  /**
   * The current editorState
   */
  editorState: _propTypes.default.object,

  /**
   * The current style
   */
  style: _propTypes.default.object,

  /**
   * Can call this to update the editor state
   */
  updateEditorState: _propTypes.default.func,

  /**
   * The inline buttons to use, if this is omitted will use the default
   * buttons, bold, italic and link.
   */
  buttons: _propTypes.default.array
});
module.exports = exports.default;