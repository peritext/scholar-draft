"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

require("./NotePointer.scss");

/* eslint react/no-did-mount-set-state : 0 */

/**
 * This module exports a react component for note pointers in editors
 * @module scholar-draft/NotePointer
 */
var NotePointer =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(NotePointer, _Component);

  function NotePointer(props) {
    var _this;

    (0, _classCallCheck2.default)(this, NotePointer);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(NotePointer).call(this, props));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "render", function () {
      var note = _this.state.note;
      var _this$context = _this.context,
          onNotePointerMouseOver = _this$context.onNotePointerMouseOver,
          onNotePointerMouseOut = _this$context.onNotePointerMouseOut,
          onNotePointerMouseClick = _this$context.onNotePointerMouseClick; // note:  it was necessary to display component children
      // to avoid weird selection bugs implying this component.
      // this should be solved with draft-js@0.11
      // see https://github.com/facebook/draft-js/issues/627

      var children = _this.props.children;

      var onMouseOver = function onMouseOver(event) {
        event.stopPropagation();

        if (typeof onNotePointerMouseOver === 'function' && note) {
          onNotePointerMouseOver(note.id, note, event);
        }
      };

      var onMouseOut = function onMouseOut(event) {
        event.stopPropagation();

        if (typeof onNotePointerMouseOut === 'function' && note) {
          onNotePointerMouseOut(note.id, note, event);
        }
      };

      var onMouseClick = function onMouseClick(event) {
        event.stopPropagation();

        if (typeof onNotePointerMouseClick === 'function' && note) {
          onNotePointerMouseClick(note.id, note, event);
        }
      };

      var id = note && note.id ? "note-pointer-".concat(note.id) : 'note-pointer-orphan';
      return _react.default.createElement("sup", {
        className: "scholar-draft-NotePointer",
        id: id,
        onMouseOver: onMouseOver,
        onFocus: onMouseOver,
        onMouseOut: onMouseOut,
        onBlur: onMouseOut,
        onClick: onMouseClick
      }, _react.default.createElement("span", null, note && note.order || '*', children));
    });
    _this.state = {};
    return _this;
  }

  (0, _createClass2.default)(NotePointer, [{
    key: "componentDidMount",
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
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unsubscribe();
    }
  }]);
  return NotePointer;
}(_react.Component);

(0, _defineProperty2.default)(NotePointer, "contextTypes", {
  emitter: _propTypes.default.object,
  notes: _propTypes.default.object,
  onNotePointerMouseOver: _propTypes.default.func,
  onNotePointerMouseOut: _propTypes.default.func,
  onNotePointerMouseClick: _propTypes.default.func
});
NotePointer.propTypes = {
  noteId: _propTypes.default.string
};
var _default = NotePointer;
exports.default = _default;
module.exports = exports.default;