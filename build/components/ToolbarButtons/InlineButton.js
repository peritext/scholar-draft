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

var _draftJs = require('draft-js');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./ButtonStyles.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InlineButton = function (_Component) {
  (0, _inherits3.default)(InlineButton, _Component);

  function InlineButton() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, InlineButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = InlineButton.__proto__ || (0, _getPrototypeOf2.default)(InlineButton)).call.apply(_ref, [this].concat(args))), _this), _this.isSelected = function (editorState, inlineStyleType) {
      if (!editorState || !editorState.getSelection) {
        return;
      }
      // Check the editor is focused
      var selection = editorState.getSelection();

      var selectedBlock = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
      if (!selectedBlock) return false;

      var currentInlineStyle = editorState.getCurrentInlineStyle();
      return currentInlineStyle.has(inlineStyleType);
    }, _this.render = function () {
      var _this$props = _this.props,
          editorState = _this$props.editorState,
          updateEditorState = _this$props.updateEditorState,
          inlineStyleType = _this$props.inlineStyleType,
          iconMap = _this$props.iconMap,
          otherProps = (0, _objectWithoutProperties3.default)(_this$props, ['editorState', 'updateEditorState', 'inlineStyleType', 'iconMap']);


      var selected = _this.isSelected(editorState, inlineStyleType);
      var className = 'scholar-draft-InlineButton' + (selected ? ' active' : '') + ' ';

      var onMouseDown = function onMouseDown(event) {
        event.preventDefault();
        updateEditorState(_draftJs.RichUtils.toggleInlineStyle(editorState, inlineStyleType));
      };

      return _react2.default.createElement(
        'div',
        (0, _extends3.default)({
          onMouseDown: onMouseDown,
          className: className
        }, otherProps),
        _react2.default.Children.map(_this.props.children, function (child) {
          return _react2.default.cloneElement(child, {
            selected: selected
          });
        })
      );
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  /**
   * Checks wether current styling button is selected
   * @param {Record} editorState - editorState to check for selection
   * @param {string} inlineStyleType - inline style to inspect against the provided editorState
   * @return {boolean} isSelected - 
   */


  return InlineButton;
}(_react.Component);

InlineButton.propTypes = {
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
   * The inline style type this button is responsible for.
   */
  styleType: _propTypes2.default.string,

  children: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object]),

  inlineStyleType: _propTypes2.default.string,

  iconMap: _propTypes2.default.object
};
InlineButton.defaultProps = {
  selected: false
};
exports.default = InlineButton;
module.exports = exports['default'];