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

require('./NoteContainer.scss');

var _BasicEditor = require('../BasicEditor/BasicEditor');

var _BasicEditor2 = _interopRequireDefault(_BasicEditor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NoteContainer = function (_Component) {
  (0, _inherits3.default)(NoteContainer, _Component);

  function NoteContainer(props) {
    (0, _classCallCheck3.default)(this, NoteContainer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (NoteContainer.__proto__ || (0, _getPrototypeOf2.default)(NoteContainer)).call(this, props));

    _this.focus = function () {
      _this.editor.focus();
    };

    _this.render = function () {
      var _this$props = _this.props,
          note = _this$props.note,
          assets = _this$props.assets,
          assetRequestPosition = _this$props.assetRequestPosition,
          addTextAtCurrentSelection = _this$props.addTextAtCurrentSelection,
          onEditorChange = _this$props.onEditorChange,
          onAssetRequest = _this$props.onAssetRequest,
          onAssetRequestCancel = _this$props.onAssetRequestCancel,
          onAssetChoice = _this$props.onAssetChoice,
          onAssetChange = _this$props.onAssetChange,
          onClickDelete = _this$props.onClickDelete,
          onDrop = _this$props.onDrop,
          onBlur = _this$props.onBlur,
          onEditorClick = _this$props.onEditorClick,
          onAssetClick = _this$props.onAssetClick,
          onAssetMouseOver = _this$props.onAssetMouseOver,
          onAssetMouseOut = _this$props.onAssetMouseOut,
          inlineAssetComponents = _this$props.inlineAssetComponents,
          blockAssetComponents = _this$props.blockAssetComponents,
          AssetChoiceComponent = _this$props.AssetChoiceComponent,
          assetChoiceProps = _this$props.assetChoiceProps,
          readOnly = _this$props.readOnly,
          editorStyle = _this$props.editorStyle;


      var bindRef = function bindRef(editor) {
        _this.editor = editor;
      };

      var onClick = function onClick(e) {
        e.stopPropagation();
        onEditorClick(e);
      };

      var onHeaderClick = function onHeaderClick(e) {
        e.stopPropagation();
        onEditorClick(e);
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
            assets: assets,
            readOnly: readOnly,
            ref: bindRef,
            onClick: onClick,
            onDrop: onDrop,
            onBlur: onBlur,
            addTextAtCurrentSelection: addTextAtCurrentSelection,

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
            allowNotesInsertion: false,
            editorStyle: editorStyle
          })
        )
      );
    };

    return _this;
  }

  return NoteContainer;
}(_react.Component);

exports.default = NoteContainer;
module.exports = exports['default'];