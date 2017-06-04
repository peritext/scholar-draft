'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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

var Editor = function (_Component) {
  (0, _inherits3.default)(Editor, _Component);

  function Editor(props) {
    (0, _classCallCheck3.default)(this, Editor);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Editor.__proto__ || (0, _getPrototypeOf2.default)(Editor)).call(this, props));

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

  (0, _createClass3.default)(Editor, [{
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
          onNoteDelete = _props.onNoteDelete,
          onDrop = _props.onDrop,
          onDragOver = _props.onDragOver,
          onClick = _props.onClick,
          onBlur = _props.onBlur,
          assetRequestPosition = _props.assetRequestPosition,
          assetChoiceProps = _props.assetChoiceProps,
          inlineAssetComponents = _props.inlineAssetComponents,
          blockAssetComponents = _props.blockAssetComponents,
          AssetChoiceComponent = _props.AssetChoiceComponent,
          NotePointerComponent = _props.NotePointerComponent,
          iconMap = _props.iconMap,
          keyBindingFn = _props.keyBindingFn,
          editorStyles = _props.editorStyles,
          clipboard = _props.clipboard,
          focusedEditorId = _props.focusedEditorId,
          NoteContainerComponent = _props.NoteContainerComponent;


      var bindMainEditor = function bindMainEditor(editor) {
        _this2.mainEditor = editor;
      };

      var renderNoteEditor = function renderNoteEditor(noteId, order) {
        var onThisNoteEditorChange = function onThisNoteEditorChange(editor) {
          return onEditorChange(noteId, editor);
        };
        var onNoteAssetRequest = function onNoteAssetRequest(selection) {
          onAssetRequest(noteId, selection);
        };
        var onClickDelete = function onClickDelete() {
          if (typeof onNoteDelete === 'function') {
            _this2.props.onNoteDelete(noteId);
          }
        };
        var onNoteDrop = function onNoteDrop(payload, selection) {
          if (typeof onDrop === 'function') {
            onDrop(noteId, payload, selection);
          }
        };
        var onNoteDragOver = function onNoteDragOver(event) {
          if (typeof onDragOver === 'function') {
            onDragOver(noteId, event);
          }
        };
        var note = notes[noteId];

        var onNoteEditorClick = function onNoteEditorClick(event) {
          if (typeof onClick === 'function') {
            onClick(event, noteId);
          }
        };
        var bindNote = function bindNote(thatNote) {
          _this2.notes[noteId] = thatNote;
        };
        var onNoteBlur = function onNoteBlur(event) {
          onBlur(event, noteId);
        };

        var NoteContainer = NoteContainerComponent || _NoteContainer2.default;

        return _react2.default.createElement(NoteContainer, {
          key: noteId,
          note: note,
          assets: assets,

          ref: bindNote,

          contentId: noteId,

          assetRequestPosition: assetRequestPosition,
          assetChoiceProps: assetChoiceProps,

          readOnly: noteId !== focusedEditorId,

          onEditorClick: onNoteEditorClick,
          onBlur: onNoteBlur,

          onEditorChange: onThisNoteEditorChange,

          onAssetRequest: onNoteAssetRequest,
          onAssetRequestCancel: onAssetRequestCancel,
          onAssetChange: onAssetChange,
          onAssetChoice: onAssetChoice,

          clipboard: clipboard,

          onDrop: onNoteDrop,
          onDragOver: onNoteDragOver,
          onClickDelete: onClickDelete,

          onAssetClick: onAssetClick,
          onAssetMouseOver: onAssetMouseOver,
          onAssetMouseOut: onAssetMouseOut,

          inlineAssetComponents: inlineAssetComponents,
          blockAssetComponents: blockAssetComponents,
          AssetChoiceComponent: AssetChoiceComponent,
          iconMap: iconMap,
          keyBindingFn: keyBindingFn,

          editorStyle: editorStyles && editorStyles.noteEditor
        });
      };

      var onMainEditorChange = function onMainEditorChange(editor) {
        return onEditorChange('main', editor);
      };
      var onMainAssetRequest = function onMainAssetRequest(selection) {
        onAssetRequest('main', selection);
      };

      var onMainEditorDrop = function onMainEditorDrop(payload, selection) {
        if (typeof onDrop === 'function') {
          onDrop('main', payload, selection);
        }
      };

      var onMainDragOver = function onMainDragOver(event) {
        if (typeof onDragOver === 'function') {
          onDragOver('main', event);
        }
      };

      var onMainEditorClick = function onMainEditorClick(event) {
        if (typeof onClick === 'function') {
          onClick(event, 'main');
        }
      };
      var onMainBlur = function onMainBlur(event) {
        onBlur(event, 'main');
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

            contentId: 'main',

            assetRequestPosition: assetRequestPosition,
            assetChoiceProps: assetChoiceProps,

            readOnly: focusedEditorId !== 'main',

            onClick: onMainEditorClick,
            onBlur: onMainBlur,

            onEditorChange: onMainEditorChange,
            onDragOver: onMainDragOver,
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
            NotePointerComponent: NotePointerComponent,
            iconMap: iconMap,

            clipboard: clipboard,

            allowNotesInsertion: true,
            editorStyle: editorStyles && editorStyles.mainEditor
          })
        ),
        _react2.default.createElement(
          'aside',
          { className: 'notes-container' },
          (0, _keys2.default)(notes || {}).sort(function (first, second) {
            if (notes[first].order > notes[second].order) {
              return 1;
            }return -1;
          }).map(renderNoteEditor)
        )
      );
    }
  }]);
  return Editor;
}(_react.Component);

Editor.propTypes = {
  mainEditorState: _propTypes2.default.object,
  notes: _propTypes2.default.object,
  assets: _propTypes2.default.object,

  editorClass: _propTypes2.default.string,

  onEditorChange: _propTypes2.default.func,
  onNoteAdd: _propTypes2.default.func,

  onAssetChange: _propTypes2.default.func,
  onAssetRequest: _propTypes2.default.func,
  onAssetRequestCancel: _propTypes2.default.func,
  onAssetChoice: _propTypes2.default.func,
  onAssetClick: _propTypes2.default.func,
  onAssetMouseOver: _propTypes2.default.func,
  onAssetMouseOut: _propTypes2.default.func,

  onNotePointerMouseOver: _propTypes2.default.func,
  onNotePointerMouseOut: _propTypes2.default.func,
  onNotePointerMouseClick: _propTypes2.default.func,
  onNoteDelete: _propTypes2.default.func,
  onDrop: _propTypes2.default.func,
  onDragOver: _propTypes2.default.func,
  onClick: _propTypes2.default.func,
  onBlur: _propTypes2.default.func,

  assetRequestPosition: _propTypes2.default.object,
  assetChoiceProps: _propTypes2.default.object,

  inlineAssetComponents: _propTypes2.default.object,
  blockAssetComponents: _propTypes2.default.object,
  AssetChoiceComponent: _propTypes2.default.func,
  NotePointerComponent: _propTypes2.default.func,
  iconMap: _propTypes2.default.object,

  keyBindingFn: _propTypes2.default.func,

  editorStyles: _propTypes2.default.object,
  clipboard: _propTypes2.default.object,
  focusedEditorId: _propTypes2.default.string,
  NoteContainerComponent: _propTypes2.default.func
};
exports.default = Editor;
module.exports = exports['default'];