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
          onNotePointerMouseOver = _this$context.onNotePointerMouseOver,
          onNotePointerMouseOut = _this$context.onNotePointerMouseOut,
          onNotePointerMouseClick = _this$context.onNotePointerMouseClick;


      var onMouseOver = function onMouseOver(event) {
        event.stopPropagation();
        if (typeof onNotePointerMouseOver === 'function') {
          onNotePointerMouseOver(note.id, note, event);
        }
      };

      var onMouseOut = function onMouseOut(event) {
        event.stopPropagation();
        if (typeof onNotePointerMouseOut === 'function') {
          onNotePointerMouseOut(note.id, note, event);
        }
      };

      var onMouseClick = function onMouseClick(event) {
        event.stopPropagation();
        if (typeof onNotePointerMouseClick === 'function') {
          onNotePointerMouseClick(note.id, note, event);
        }
      };

      var id = note && note.id ? 'note-pointer-' + note.id : 'note-pointer-orphan';

      return _react2.default.createElement(
        'sup',
        {
          className: 'scholar-draft-NotePointer',
          id: id,
          onMouseOver: onMouseOver,
          onFocus: onMouseOver,
          onMouseOut: onMouseOut,
          onBlur: onMouseOut,
          onClick: onMouseClick
        },
        _react2.default.createElement(
          'span',
          null,
          note && note.order || '*'
        )
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
        if (!_this2.state.note || note && note.order !== _this2.state.note.order) {
          _this2.setState({
            note: note
          });
        }
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
/**
 * This module exports a react component for note pointers in editors
 * @module scholar-draft/NotePointer
 */


NotePointer.contextTypes = {
  emitter: _propTypes2.default.object,
  notes: _propTypes2.default.object,

  onNotePointerMouseOver: _propTypes2.default.func,
  onNotePointerMouseOut: _propTypes2.default.func,
  onNotePointerMouseClick: _propTypes2.default.func
};


NotePointer.propTypes = {
  noteId: _propTypes2.default.string
};

exports.default = NotePointer;
module.exports = exports['default'];