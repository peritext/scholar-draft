"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

require("./NoteContainer.scss");

var _BasicEditor = _interopRequireDefault(require("../BasicEditor/BasicEditor"));

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
    return _react.default.createElement(NoteLayout, {
      note: note,
      onHeaderClick: onHeaderClick,
      onDelete: onDelete,
      onClickToRetroLink: onClickScrollToNotePointerHandler,
      id: "note-container-".concat(note.id)
    }, children);
  }

  return _react.default.createElement("section", {
    className: 'scholar-draft-NoteContainer',
    id: "note-container-".concat(note.id)
  }, _react.default.createElement("div", {
    className: 'note-header',
    onClick: onHeaderClick
  }, _react.default.createElement("button", {
    onClick: onDelete
  }, "x"), _react.default.createElement("h3", null, "Note ", note.order), _react.default.createElement("button", {
    onClick: onClickScrollToNotePointerHandler
  }, "\u2191")), _react.default.createElement("div", {
    className: 'note-body'
  }, children));
};

Layout.propTypes = {
  children: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.object]),
  NoteLayout: _propTypes.default.oneOfType([_propTypes.default.element, _propTypes.default.func]),
  note: _propTypes.default.object,
  onHeaderClick: _propTypes.default.func,
  onDelete: _propTypes.default.func,
  onClickScrollToNotePointerHandler: _propTypes.default.func
};

var NoteContainer =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(NoteContainer, _Component);

  function NoteContainer() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, NoteContainer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(NoteContainer)).call.apply(_getPrototypeOf2, [this].concat(args)));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "focus", function () {
      _this.editor.focus();
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "render", function () {
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
          inlineEntities = _this$props$inlineEnt === void 0 ? [] : _this$props$inlineEnt,
          iconMap = _this$props.iconMap,
          inlineButtons = _this$props.inlineButtons,
          containerDimensions = _this$props.containerDimensions,
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
        return _react.default.createElement(Layout, {
          NoteLayout: NoteLayout,
          note: note,
          onHeaderClick: onHeaderClick,
          onDelete: onDelete,
          onClickScrollToNotePointerHandler: onClickScrollToNotePointerHandler
        }, _react.default.createElement(_BasicEditor.default, {
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
          containerDimensions: containerDimensions,
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
        }));
      }

      return null;
    });
    return _this;
  }

  return NoteContainer;
}(_react.Component);

(0, _defineProperty2.default)(NoteContainer, "propTypes", {
  note: _propTypes.default.object,
  assets: _propTypes.default.object,
  assetRequestPosition: _propTypes.default.object,
  assetRequestContentId: _propTypes.default.string,
  contentId: _propTypes.default.string,
  isActive: _propTypes.default.bool,
  messages: _propTypes.default.object,
  renderingMode: _propTypes.default.string,
  inlineButtons: _propTypes.default.array,
  editorPlaceholder: _propTypes.default.string,
  containerDimensions: _propTypes.default.object,
  addTextAtCurrentSelection: _propTypes.default.func,
  onEditorChange: _propTypes.default.func,
  onClickScrollToNotePointer: _propTypes.default.func,
  onAssetRequest: _propTypes.default.func,
  onAssetRequestCancel: _propTypes.default.func,
  onAssetChoice: _propTypes.default.func,
  onAssetChange: _propTypes.default.func,
  onClickDelete: _propTypes.default.func,
  onDrop: _propTypes.default.func,
  onDragOver: _propTypes.default.func,
  onBlur: _propTypes.default.func,
  onEditorClick: _propTypes.default.func,
  onAssetClick: _propTypes.default.func,
  onAssetMouseOver: _propTypes.default.func,
  onAssetMouseOut: _propTypes.default.func,
  handlePastedText: _propTypes.default.func,
  inlineAssetComponents: _propTypes.default.object,
  blockAssetComponents: _propTypes.default.object,
  AssetChoiceComponent: _propTypes.default.func,
  AssetButtonComponent: _propTypes.default.func,
  NoteButtonComponent: _propTypes.default.func,
  NoteLayout: _propTypes.default.func,
  editorStyle: _propTypes.default.object,
  inlineEntities: _propTypes.default.array,
  iconMap: _propTypes.default.object,
  assetChoiceProps: _propTypes.default.object,
  clipboard: _propTypes.default.object
});
var _default = NoteContainer;
exports.default = _default;
module.exports = exports.default;