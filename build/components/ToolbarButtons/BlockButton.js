'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _draftJs = require('draft-js');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BlockButton = function (_Component) {
  (0, _inherits3.default)(BlockButton, _Component);

  function BlockButton() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, BlockButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = BlockButton.__proto__ || (0, _getPrototypeOf2.default)(BlockButton)).call.apply(_ref, [this].concat(args))), _this), _this.isSelected = function (editorState, blockType) {
      var selection = editorState.getSelection();
      var selectedBlock = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
      if (!selectedBlock) return false;
      var selectedBlockType = selectedBlock.getType();
      return selectedBlockType === blockType;
    }, _this.render = function () {
      var _this$props = _this.props,
          editorState = _this$props.editorState,
          blockType = _this$props.blockType,
          children = _this$props.children,
          updateEditorState = _this$props.updateEditorState;


      var selected = _this.isSelected(editorState, blockType);
      var className = 'scholar-draft-BlockButton' + (selected ? ' active' : '');

      var onMouseDown = function onMouseDown(event) {
        event.preventDefault();
        updateEditorState(_draftJs.RichUtils.toggleBlockType(editorState, blockType));
      };

      return _react2.default.createElement(
        'div',
        {
          onMouseDown: onMouseDown,
          className: className
        },
        _react2.default.Children.map(children, function (child) {
          return _react2.default.cloneElement(child, {
            selected: selected
          });
        })
      );
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return BlockButton;
}(_react.Component);

BlockButton.propTypes = {
  /**
   * The current editorState. This gets passed down from the editor.
   */
  editorState: _propTypes2.default.object,

  /**
   * A method that can be called to update the editor's editorState. This 
   * gets passed down from the editor.
   */
  updateEditorState: _propTypes2.default.func,

  /**
   * The block type this button is responsible for.
   */
  blockType: _propTypes2.default.string,

  children: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object])
};
exports.default = BlockButton;
module.exports = exports['default'];