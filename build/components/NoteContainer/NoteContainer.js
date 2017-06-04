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

var NoteContainer = function (_Component) {
  (0, _inherits3.default)(NoteContainer, _Component);

  function NoteContainer() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, NoteContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = NoteContainer.__proto__ || (0, _getPrototypeOf2.default)(NoteContainer)).call.apply(_ref, [this].concat(args))), _this), _this.focus = function () {
      _this.editor.focus();
    }, _this.render = function () {
      var _this$props = _this.props,
          note = _this$props.note,
          assets = _this$props.assets,
          notes = _this$props.notes,
          assetRequestPosition = _this$props.assetRequestPosition,
          addTextAtCurrentSelection = _this$props.addTextAtCurrentSelection,
          contentId = _this$props.contentId,
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
          onAssetClick = _this$props.onAssetClick,
          onAssetMouseOver = _this$props.onAssetMouseOver,
          onAssetMouseOut = _this$props.onAssetMouseOut,
          inlineAssetComponents = _this$props.inlineAssetComponents,
          blockAssetComponents = _this$props.blockAssetComponents,
          AssetChoiceComponent = _this$props.AssetChoiceComponent,
          iconMap = _this$props.iconMap,
          assetChoiceProps = _this$props.assetChoiceProps,
          clipboard = _this$props.clipboard,
          readOnly = _this$props.readOnly,
          editorStyle = _this$props.editorStyle;


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

      return _react2.default.createElement(
        'section',
        {
          className: 'scholar-draft-NoteContainer'
        },
        _react2.default.createElement(
          'div',
          { className: 'note-header', onClick: onHeaderClick },
          _react2.default.createElement(
            'button',
            { onClick: onClickDelete },
            'x'
          ),
          _react2.default.createElement(
            'h3',
            null,
            'Note ',
            note.order
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'note-body' },
          _react2.default.createElement(_BasicEditor2.default, {
            editorState: note.editorState,
            contentId: contentId,
            assets: assets,
            notes: notes,
            readOnly: readOnly,
            ref: bindRef,
            onClick: onClick,
            onDrop: onDrop,
            onDragOver: onDragOver,
            onBlur: onBlur,
            addTextAtCurrentSelection: addTextAtCurrentSelection,
            clipboard: clipboard,

            assetRequestPosition: assetRequestPosition,
            onAssetRequestCancel: onAssetRequestCancel,
            AssetChoiceComponent: AssetChoiceComponent,
            assetChoiceProps: assetChoiceProps,

            onEditorChange: onEditorChange,
            onAssetRequest: onAssetRequest,
            onAssetChange: onAssetChange,
            onAssetChoice: onAssetChoice,

            onAssetClick: onAssetClick,
            onAssetMouseOver: onAssetMouseOver,
            onAssetMouseOut: onAssetMouseOut,

            inlineAssetComponents: inlineAssetComponents,
            blockAssetComponents: blockAssetComponents,
            iconMap: iconMap,
            allowNotesInsertion: false,
            editorStyle: editorStyle
          })
        )
      );
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return NoteContainer;
}(_react.Component);

NoteContainer.propTypes = {
  note: _propTypes2.default.object,
  assets: _propTypes2.default.object,
  notes: _propTypes2.default.object,
  assetRequestPosition: _propTypes2.default.object,
  contentId: _propTypes2.default.string,

  addTextAtCurrentSelection: _propTypes2.default.func,
  onEditorChange: _propTypes2.default.func,
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

  inlineAssetComponents: _propTypes2.default.object,
  blockAssetComponents: _propTypes2.default.object,
  AssetChoiceComponent: _propTypes2.default.func,
  editorStyle: _propTypes2.default.object,
  iconMap: _propTypes2.default.object,

  assetChoiceProps: _propTypes2.default.object,
  clipboard: _propTypes2.default.object,

  readOnly: _propTypes2.default.bool
};
exports.default = NoteContainer;
module.exports = exports['default'];