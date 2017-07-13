'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

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

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _defaultButtons = require('./defaultButtons');

var _defaultButtons2 = _interopRequireDefault(_defaultButtons);

require('./InlineToolbar.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InlineToolbar = function (_Component) {
  (0, _inherits3.default)(InlineToolbar, _Component);

  function InlineToolbar() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, InlineToolbar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = InlineToolbar.__proto__ || (0, _getPrototypeOf2.default)(InlineToolbar)).call.apply(_ref, [this].concat(args))), _this), _this.shouldComponentUpdate = function (nextProps, nextState) {
      return _this.props.editorState !== nextProps.editorState;
    }, _this.render = function () {
      var _this$props = _this.props,
          updateEditorState = _this$props.updateEditorState,
          editorState = _this$props.editorState,
          iconMap = _this$props.iconMap,
          buttons = _this$props.buttons;

      var bindRef = function bindRef(toolbar) {
        _this.toolbar = toolbar;
      };

      return _react2.default.createElement(
        'div',
        {
          className: 'scholar-draft-InlineToolbar',
          ref: bindRef
        },
        (buttons || _defaultButtons2.default).map(function (button, key) {
          return _react2.default.cloneElement(button, {
            // Pass down some useful props to each button
            updateEditorState: updateEditorState,
            editorState: editorState,
            iconMap: iconMap,
            key: key /* eslint react/no-array-index-key:0 */
          });
        })
      );
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return InlineToolbar;
}(_react.Component);

InlineToolbar.propTypes = {
  iconMap: _propTypes2.default.object,

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
exports.default = InlineToolbar;
module.exports = exports['default'];