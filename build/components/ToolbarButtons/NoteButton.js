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

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactSvgInline = require('react-svg-inline');

var _reactSvgInline2 = _interopRequireDefault(_reactSvgInline);

var _note = require('../../icons/note.svg');

var _note2 = _interopRequireDefault(_note);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
  iconContainer: {
    display: 'inline-block',
    height: 24,
    width: 24
  }
};

var NoteButton = function (_Component) {
  (0, _inherits3.default)(NoteButton, _Component);

  function NoteButton() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, NoteButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = NoteButton.__proto__ || (0, _getPrototypeOf2.default)(NoteButton)).call.apply(_ref, [this].concat(args))), _this), _this.render = function () {
      var _this$props = _this.props,
          onClick = _this$props.onClick,
          otherProps = (0, _objectWithoutProperties3.default)(_this$props, ['onClick']);


      return _react2.default.createElement(
        'div',
        (0, _extends3.default)({
          style: styles.iconContainer,
          onClick: onClick,
          onMouseDown: function onMouseDown(e) {
            return e.preventDefault();
          }
        }, otherProps),
        _react2.default.createElement(_reactSvgInline2.default, {
          svg: _note2.default
        })
      );
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return NoteButton;
}(_react.Component);

NoteButton.propTypes = {

  onClick: _propTypes2.default.func
};
exports.default = NoteButton;
module.exports = exports['default'];