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

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./NoteContainer.scss');

var _BasicEditor = require('../BasicEditor/BasicEditor');

var _BasicEditor2 = _interopRequireDefault(_BasicEditor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This module exports a react component wrapping a editable note representation
 * @module scholar-draft/NoteContainer
 */
var Layout = function Layout(_ref) {
  var children = _ref.children,
      NoteLayout = _ref.NoteLayout,
      note = _ref.note,
      onHeaderClick = _ref.onHeaderClick,
      onDelete = _ref.onDelete,
      onClickScrollToNotePointerHandler = _ref.onClickScrollToNotePointerHandler;

  if (NoteLayout) {
    return _react2.default.createElement(
      NoteLayout,
      {
        note: note,
        onHeaderClick: onHeaderClick,
        onDelete: onDelete,
        onClickToRetroLink: onClickScrollToNotePointerHandler,
        id: 'note-container-' + note.id
      },
      children
    );
  }
  return _react2.default.createElement(
    'section',
    {
      className: 'scholar-draft-NoteContainer',
      id: 'note-container-' + note.id
    },
    _react2.default.createElement(
      'div',
      { className: 'note-header', onClick: onHeaderClick },
      _react2.default.createElement(
        'button',
        { onClick: onDelete },
        'x'
      ),
      _react2.default.createElement(
        'h3',
        null,
        'Note ',
        note.order
      ),
      _react2.default.createElement(
        'button',
        { onClick: onClickScrollToNotePointerHandler },
        '\u2191'
      )
    ),
    _react2.default.createElement(
      'div',
      { className: 'note-body' },
      children
    )
  );
};

Layout.propTypes = {
  children: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object]),
  NoteLayout: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.func]),
  note: _propTypes2.default.object,
  onHeaderClick: _propTypes2.default.func,
  onDelete: _propTypes2.default.func,
  onClickScrollToNotePointerHandler: _propTypes2.default.func
};

var NoteContainer = function (_Component) {
  (0, _inherits3.default)(NoteContainer, _Component);

  function NoteContainer() {
    var _ref2;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, NoteContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref2 = NoteContainer.__proto__ || (0, _getPrototypeOf2.default)(NoteContainer)).call.apply(_ref2, [this].concat(args))), _this), _this.focus = function () {
      _this.editor.focus();
    }, _this.render = function () {
      var _this$props = _this.props,
          note = _this$props.note,
          assets = _this$props.assets,
          assetRequestPosition = _this$props.assetRequestPosition,
          addTextAtCurrentSelection = _this$props.addTextAtCurrentSelection,
          contentId = _this$props.contentId,
          isActive = _this$props.isActive,
          renderingMode = _this$props.renderingMode,
          messages = _this$props.messages,
          editorPlaceholder = _this$props.editorPlaceholder,
          onEditorChange = _this$props.onEditorChange,
          onAssetRequest = _this$props.onAssetRequest,
          onAssetRequestCancel = _this$props.onAssetRequestCancel,
          onAssetChoice = _this$props.onAssetChoice,
          onAssetChange = _this$props.onAssetChange,
          onClickDelete = _this$props.onClickDelete,
          onDrop = _this$props.onDrop,
          onDragOver = _this$props.onDragOver,
          onBlur = _this$props.onBlur,
          onEditorClick = _this$props.onEditorClick,
          handlePastedText = _this$props.handlePastedText,
          onAssetClick = _this$props.onAssetClick,
          onClickScrollToNotePointer = _this$props.onClickScrollToNotePointer,
          onAssetMouseOver = _this$props.onAssetMouseOver,
          onAssetMouseOut = _this$props.onAssetMouseOut,
          inlineAssetComponents = _this$props.inlineAssetComponents,
          blockAssetComponents = _this$props.blockAssetComponents,
          AssetChoiceComponent = _this$props.AssetChoiceComponent,
          AssetButtonComponent = _this$props.AssetButtonComponent,
          NoteButtonComponent = _this$props.NoteButtonComponent,
          _this$props$inlineEnt = _this$props.inlineEntities,
          inlineEntities = _this$props$inlineEnt === undefined ? [] : _this$props$inlineEnt,
          iconMap = _this$props.iconMap,
          inlineButtons = _this$props.inlineButtons,
          assetChoiceProps = _this$props.assetChoiceProps,
          assetRequestContentId = _this$props.assetRequestContentId,
          clipboard = _this$props.clipboard,
          editorStyle = _this$props.editorStyle,
          NoteLayout = _this$props.NoteLayout;


      var bindRef = function bindRef(editor) {
        _this.editor = editor;
      };

      var onClick = function onClick(event) {
        event.stopPropagation();
        onEditorClick(event);
      };

      var onHeaderClick = function onHeaderClick(event) {
        event.stopPropagation();
        onEditorClick(event);
      };

      var onDelete = function onDelete(event) {
        event.stopPropagation();
        onClickDelete(event);
      };

      var onClickScrollToNotePointerHandler = function onClickScrollToNotePointerHandler(event) {
        event.stopPropagation();
        onClickScrollToNotePointer(note.id);
      };
      if (note) {
        return _react2.default.createElement(
          Layout,
          {
            NoteLayout: NoteLayout,
            note: note,
            onHeaderClick: onHeaderClick,
            onDelete: onDelete,
            onClickScrollToNotePointerHandler: onClickScrollToNotePointerHandler
          },
          _react2.default.createElement(_BasicEditor2.default, {
            editorState: note.editorState,
            contentId: contentId,
            assets: assets,
            ref: bindRef,
            onClick: onClick,
            onDrop: onDrop,
            onDragOver: onDragOver,
            onBlur: onBlur,
            addTextAtCurrentSelection: addTextAtCurrentSelection,
            clipboard: clipboard,
            editorPlaceholder: editorPlaceholder,
            handlePastedText: handlePastedText,

            messages: messages,

            renderingMode: renderingMode,

            isActive: isActive,

            assetRequestPosition: assetRequestPosition,
            onAssetRequestCancel: onAssetRequestCancel,
            isRequestingAssets: assetRequestContentId === contentId,

            AssetButtonComponent: AssetButtonComponent,
            NoteButtonComponent: NoteButtonComponent,
            AssetChoiceComponent: AssetChoiceComponent,
            assetChoiceProps: assetChoiceProps,

            onEditorChange: onEditorChange,
            onAssetRequest: onAssetRequest,
            onAssetChange: onAssetChange,
            onAssetChoice: onAssetChoice,

            onAssetClick: onAssetClick,
            onAssetMouseOver: onAssetMouseOver,
            onAssetMouseOut: onAssetMouseOut,

            inlineButtons: inlineButtons,
            inlineAssetComponents: inlineAssetComponents,
            blockAssetComponents: blockAssetComponents,
            inlineEntities: inlineEntities,
            iconMap: iconMap,
            allowNotesInsertion: false,
            editorStyle: editorStyle
          })
        );
      }
      return null;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return NoteContainer;
}(_react.Component);

NoteContainer.propTypes = {
  note: _propTypes2.default.object,
  assets: _propTypes2.default.object,
  assetRequestPosition: _propTypes2.default.object,
  assetRequestContentId: _propTypes2.default.string,
  contentId: _propTypes2.default.string,
  isActive: _propTypes2.default.bool,

  messages: _propTypes2.default.object,

  renderingMode: _propTypes2.default.string,

  inlineButtons: _propTypes2.default.array,
  editorPlaceholder: _propTypes2.default.string,

  addTextAtCurrentSelection: _propTypes2.default.func,
  onEditorChange: _propTypes2.default.func,
  onClickScrollToNotePointer: _propTypes2.default.func,
  onAssetRequest: _propTypes2.default.func,
  onAssetRequestCancel: _propTypes2.default.func,
  onAssetChoice: _propTypes2.default.func,
  onAssetChange: _propTypes2.default.func,
  onClickDelete: _propTypes2.default.func,
  onDrop: _propTypes2.default.func,
  onDragOver: _propTypes2.default.func,
  onBlur: _propTypes2.default.func,
  onEditorClick: _propTypes2.default.func,
  onAssetClick: _propTypes2.default.func,
  onAssetMouseOver: _propTypes2.default.func,
  onAssetMouseOut: _propTypes2.default.func,
  handlePastedText: _propTypes2.default.func,

  inlineAssetComponents: _propTypes2.default.object,
  blockAssetComponents: _propTypes2.default.object,
  AssetChoiceComponent: _propTypes2.default.func,
  AssetButtonComponent: _propTypes2.default.func,
  NoteButtonComponent: _propTypes2.default.func,
  NoteLayout: _propTypes2.default.func,
  editorStyle: _propTypes2.default.object,
  inlineEntities: _propTypes2.default.array,
  iconMap: _propTypes2.default.object,

  assetChoiceProps: _propTypes2.default.object,
  clipboard: _propTypes2.default.object
};
exports.default = NoteContainer;
module.exports = exports['default'];