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

var _draftJs = require("draft-js");

var _propTypes = _interopRequireDefault(require("prop-types"));

var BlockButton =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(BlockButton, _Component);

  function BlockButton() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, BlockButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(BlockButton)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "isSelected", function (editorState, blockType) {
      if (!editorState || !editorState.getSelection) {
        return;
      }

      var selection = editorState.getSelection();
      var selectedBlock = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
      if (!selectedBlock) return false;
      var selectedBlockType = selectedBlock.getType();
      return selectedBlockType === blockType;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "render", function () {
      var _this$props = _this.props,
          editorState = _this$props.editorState,
          blockType = _this$props.blockType,
          children = _this$props.children,
          updateEditorState = _this$props.updateEditorState;

      var selected = _this.isSelected(editorState, blockType);

      var className = "scholar-draft-BlockButton".concat(selected ? ' active' : '');

      var onMouseDown = function onMouseDown(event) {
        event.preventDefault();
        updateEditorState(_draftJs.RichUtils.toggleBlockType(editorState, blockType));
      };

      return _react.default.createElement("div", {
        onMouseDown: onMouseDown,
        className: className
      }, _react.default.Children.map(children, function (child) {
        return _react.default.cloneElement(child, {
          selected: selected
        });
      }));
    });
    return _this;
  }

  return BlockButton;
}(_react.Component);

(0, _defineProperty2.default)(BlockButton, "propTypes", {
  /**
   * The current editorState. This gets passed down from the editor.
   */
  editorState: _propTypes.default.object,

  /**
   * A method that can be called to update the editor's editorState. This 
   * gets passed down from the editor.
   */
  updateEditorState: _propTypes.default.func,

  /**
   * The block type this button is responsible for.
   */
  blockType: _propTypes.default.string,
  children: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.object])
});
var _default = BlockButton;
exports.default = _default;
module.exports = exports.default;