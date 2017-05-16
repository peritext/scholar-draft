'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _defaultButtons = require('./defaultButtons.js');

var _defaultButtons2 = _interopRequireDefault(_defaultButtons);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./PopoverControl.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PopoverControl = function (_Component) {
  (0, _inherits3.default)(PopoverControl, _Component);

  function PopoverControl() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, PopoverControl);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = PopoverControl.__proto__ || (0, _getPrototypeOf2.default)(PopoverControl)).call.apply(_ref, [this].concat(args))), _this), _this.render = function () {
      var _this$props = _this.props,
          updateEditorState = _this$props.updateEditorState,
          editorState = _this$props.editorState,
          _this$props$iconColor = _this$props.iconColor,
          iconColor = _this$props$iconColor === undefined ? 'black' : _this$props$iconColor,
          _this$props$iconSelec = _this$props.iconSelectedColor,
          iconSelectedColor = _this$props$iconSelec === undefined ? 'red' : _this$props$iconSelec,
          buttons = _this$props.buttons;

      var bindRef = function bindRef(toolbar) {
        _this.toolbar = toolbar;
      };

      return _react2.default.createElement(
        'div',
        {
          className: 'scholar-draft-PopoverControl',
          style: (0, _assign2.default)({}, _this.props.style),
          ref: bindRef
        },
        (buttons || _defaultButtons2.default).map(function (button, key) {
          return _react2.default.cloneElement(button, {
            // Pass down some useful props to each button
            updateEditorState: updateEditorState,
            editorState: editorState,
            iconColor: iconColor,
            iconSelectedColor: iconSelectedColor,
            key: key
          });
        })
      );
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return PopoverControl;
}(_react.Component);

PopoverControl.propTypes = {
  /**
   * The popover container style
   */
  style: _propTypes2.default.object,

  toggleInlineStyle: _propTypes2.default.func,
  currentInlineStyle: _propTypes2.default.object,

  /**
   * The icon fill colour
   */
  iconColor: _propTypes2.default.string,

  /**
   * The icon fill colour when selected
   */
  iconSelectedColor: _propTypes2.default.string,

  /**
   * The current editorState
   */
  editorState: _propTypes2.default.object,

  /**
   * Can call this to update the editor state
   */
  updateEditorState: _propTypes2.default.func,

  /**
   * The inline buttons to use, if this is omitted will use the default
   * buttons, bold, italic and link.
   */
  buttons: _propTypes2.default.array
};
PopoverControl.defaultProps = {
  iconColor: '#000000',
  iconSelectedColor: '#2000FF'
};
exports.default = PopoverControl;
module.exports = exports['default'];