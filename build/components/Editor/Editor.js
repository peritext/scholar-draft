'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _BasicEditor = require('../BasicEditor/BasicEditor');

var _BasicEditor2 = _interopRequireDefault(_BasicEditor);

var _NoteContainer = require('../NoteContainer/NoteContainer');

var _NoteContainer2 = _interopRequireDefault(_NoteContainer);

require('./Editor.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SectionEditor = function (_Component) {
  (0, _inherits3.default)(SectionEditor, _Component);

  function SectionEditor(props) {
    (0, _classCallCheck3.default)(this, SectionEditor);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SectionEditor.__proto__ || (0, _getPrototypeOf2.default)(SectionEditor)).call(this, props));

    _this.focus = function (contentId) {
      if (contentId === 'main' && _this.mainEditor) {
        _this.mainEditor.focus();
      } else if (_this.notes[contentId]) {
        _this.notes[contentId].editor.focus();
      }
    };

    _this.notes = {};
    return _this;
  }

  (0, _createClass3.default)(SectionEditor, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          mainEditorState = _props.mainEditorState,
          notes = _props.notes,
          assets = _props.assets,
          _props$editorClass = _props.editorClass,
          editorClass = _props$editorClass === undefined ? 'scholar-draft-SectionEditor' : _props$editorClass,
          onEditorChange = _props.onEditorChange,
          onNoteAdd = _props.onNoteAdd,
          onAssetChange = _props.onAssetChange,
          onAssetRequest = _props.onAssetRequest,
          onAssetRequestCancel = _props.onAssetRequestCancel,
          onAssetChoice = _props.onAssetChoice,
          onAssetClick = _props.onAssetClick,
          onAssetMouseOver = _props.onAssetMouseOver,
          onAssetMouseOut = _props.onAssetMouseOut,
          onNotePointerMouseOver = _props.onNotePointerMouseOver,
          onNotePointerMouseOut = _props.onNotePointerMouseOut,
          onNotePointerMouseClick = _props.onNotePointerMouseClick,
          onDrop = _props.onDrop,
          onClick = _props.onClick,
          onBlur = _props.onBlur,
          assetRequestPosition = _props.assetRequestPosition,
          assetChoiceProps = _props.assetChoiceProps,
          inlineAssetComponents = _props.inlineAssetComponents,
          blockAssetComponents = _props.blockAssetComponents,
          AssetChoiceComponent = _props.AssetChoiceComponent,
          editorStyles = _props.editorStyles,
          _props$readOnly = _props.readOnly,
          readOnly = _props$readOnly === undefined ? {} : _props$readOnly;


      var bindMainEditor = function bindMainEditor(editor) {
        _this2.mainEditor = editor;
      };

      var renderNoteEditor = function renderNoteEditor(noteId, order) {
        var _React$createElement;

        var onThisNoteEditorChange = function onThisNoteEditorChange(editor) {
          return onEditorChange('note', noteId, editor);
        };
        var onNoteAssetRequest = function onNoteAssetRequest(selection) {
          onAssetRequest('note', noteId, selection);
        };
        var onClickDelete = function onClickDelete() {
          if (typeof _this2.props.onNoteDelete === 'function') {
            _this2.props.onNoteDelete(noteId);
          }
        };
        var onNoteDrop = function onNoteDrop(payload, selection) {
          if (typeof _this2.props.onDrop === 'function') {
            onDrop(noteId, payload, selection);
          }
        };
        var note = notes[noteId];

        var onNoteEditorClick = function onNoteEditorClick(e) {
          if (typeof onClick === 'function') {
            onClick(e, noteId);
          }
        };
        var bindNote = function bindNote(note) {
          _this2.notes[noteId] = note;
        };
        var onNoteBlur = function onNoteBlur(e) {
          onBlur(e, noteId);
        };

        return _react2.default.createElement(_NoteContainer2.default, (_React$createElement = {
          key: noteId,
          note: note,
          assets: assets,

          ref: bindNote,

          assetRequestPosition: assetRequestPosition,
          assetChoiceProps: assetChoiceProps,

          readOnly: readOnly[noteId],

          onEditorClick: onNoteEditorClick,
          onBlur: onNoteBlur,

          onEditorChange: onThisNoteEditorChange,

          onAssetRequest: onNoteAssetRequest,
          onAssetRequestCancel: onAssetRequestCancel,
          onAssetChange: onAssetChange
        }, (0, _defineProperty3.default)(_React$createElement, 'onAssetRequestCancel', onAssetRequestCancel), (0, _defineProperty3.default)(_React$createElement, 'onAssetChoice', onAssetChoice), (0, _defineProperty3.default)(_React$createElement, 'onDrop', onNoteDrop), (0, _defineProperty3.default)(_React$createElement, 'onClickDelete', onClickDelete), (0, _defineProperty3.default)(_React$createElement, 'onAssetClick', onAssetClick), (0, _defineProperty3.default)(_React$createElement, 'onAssetMouseOver', onAssetMouseOver), (0, _defineProperty3.default)(_React$createElement, 'onAssetMouseOut', onAssetMouseOut), (0, _defineProperty3.default)(_React$createElement, 'inlineAssetComponents', inlineAssetComponents), (0, _defineProperty3.default)(_React$createElement, 'blockAssetComponents', blockAssetComponents), (0, _defineProperty3.default)(_React$createElement, 'AssetChoiceComponent', AssetChoiceComponent), (0, _defineProperty3.default)(_React$createElement, 'editorStyle', editorStyles && editorStyles.noteEditor), _React$createElement));
      };

      var onMainEditorChange = function onMainEditorChange(editor) {
        return onEditorChange('main', undefined, editor);
      };
      var onMainAssetRequest = function onMainAssetRequest(selection) {
        onAssetRequest('main', undefined, selection);
      };

      var onMainEditorDrop = function onMainEditorDrop(payload, selection) {
        if (typeof onDrop === 'function') {
          onDrop('main', payload, selection);
        }
      };

      var onMainEditorClick = function onMainEditorClick(e) {
        if (typeof onClick === 'function') {
          onClick(e, 'main');
        }
      };
      var onMainBlur = function onMainBlur(e) {
        onBlur(e, 'main');
      };
      return _react2.default.createElement(
        'div',
        { className: editorClass },
        _react2.default.createElement(
          'section',
          { className: 'main-container-editor' },
          _react2.default.createElement(_BasicEditor2.default, {
            editorState: mainEditorState,
            notes: notes,
            assets: assets,
            ref: bindMainEditor,

            assetRequestPosition: assetRequestPosition,
            assetChoiceProps: assetChoiceProps,

            readOnly: readOnly.main,

            onClick: onMainEditorClick,
            onBlur: onMainBlur,

            onEditorChange: onMainEditorChange,
            onDrop: onMainEditorDrop,
            onAssetRequest: onMainAssetRequest,
            onAssetRequestCancel: onAssetRequestCancel,
            onAssetChoice: onAssetChoice,

            onNoteAdd: onNoteAdd,
            onAssetChange: onAssetChange,

            onAssetClick: onAssetClick,
            onAssetMouseOver: onAssetMouseOver,
            onAssetMouseOut: onAssetMouseOut,

            onNotePointerMouseOver: onNotePointerMouseOver,
            onNotePointerMouseOut: onNotePointerMouseOut,
            onNotePointerMouseClick: onNotePointerMouseClick,

            inlineAssetComponents: inlineAssetComponents,
            blockAssetComponents: blockAssetComponents,
            AssetChoiceComponent: AssetChoiceComponent,

            allowNotesInsertion: true,
            editorStyle: editorStyles && editorStyles.mainEditor
          })
        ),
        _react2.default.createElement(
          'aside',
          { className: 'notes-container' },
          (0, _keys2.default)(notes || {}).sort(function (a, b) {
            if (notes[a].order > notes[b].order) {
              return 1;
            }return -1;
          }).map(renderNoteEditor)
        )
      );
    }
  }]);
  return SectionEditor;
}(_react.Component);

SectionEditor.PropTypes = {};
SectionEditor.defaultProps = {};
exports.default = SectionEditor;
module.exports = exports['default'];