'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./NotePointer.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NotePointer = function (_Component) {
  (0, _inherits3.default)(NotePointer, _Component);

  function NotePointer(props) {
    (0, _classCallCheck3.default)(this, NotePointer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (NotePointer.__proto__ || (0, _getPrototypeOf2.default)(NotePointer)).call(this, props));

    _this.render = function () {
      var note = _this.state.note;
      var _this$context = _this.context,
          onNoteMouseOver = _this$context.onNoteMouseOver,
          onNoteMouseOut = _this$context.onNoteMouseOut,
          onNoteClick = _this$context.onNoteClick;
      var children = _this.props.children;


      var onMouseOver = function onMouseOver(event) {
        event.stopPropagation();
        if (typeof onNoteMouseOver === 'function') {
          onNoteMouseOver(note.id, note, event);
        }
      };

      var onMouseOut = function onMouseOut(event) {
        event.stopPropagation();
        if (typeof onNoteMouseOut === 'function') {
          onNoteMouseOut(note.id, note, event);
        }
      };

      var onMouseClick = function onMouseClick(event) {
        event.stopPropagation();
        if (typeof onNoteClick === 'function') {
          onNoteClick(note.id, note, event);
        }
      };

      return _react2.default.createElement(
        'sup',
        {
          className: 'scholar-draft-NotePointer',
          onMouseOver: onMouseOver,
          onMouseOut: onMouseOut,
          onClick: onMouseClick
        },
        _react2.default.createElement(
          'span',
          null,
          note && note.order || '*'
        ),
        children
      );
    };

    _this.state = {};
    return _this;
  }

  (0, _createClass3.default)(NotePointer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.setState({
        note: this.context.notes && this.context.notes[this.props.noteId]
      });
      this.unsubscribe = this.context.emitter.subscribeToNotes(function (notes) {
        var note = notes[_this2.props.noteId];
        _this2.setState({
          note: note
        });
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unsubscribe();
    }
  }]);
  return NotePointer;
}(_react.Component); /* eslint react/no-did-mount-set-state : 0 */


NotePointer.contextTypes = {
  emitter: _propTypes2.default.object,
  notes: _propTypes2.default.object,

  onNoteMouseOver: _propTypes2.default.func,
  onNoteMouseOut: _propTypes2.default.func,
  onNoteClick: _propTypes2.default.func
};


NotePointer.propTypes = {
  children: _propTypes2.default.array,
  noteId: _propTypes2.default.string
};

exports.default = NotePointer;
module.exports = exports['default'];