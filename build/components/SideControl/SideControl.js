'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _AssetButton = require('../ToolbarButtons/AssetButton');

var _AssetButton2 = _interopRequireDefault(_AssetButton);

var _NoteButton = require('../ToolbarButtons/NoteButton');

var _NoteButton2 = _interopRequireDefault(_NoteButton);

require('./SideControl.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SideControl = function (_Component) {
  (0, _inherits3.default)(SideControl, _Component);

  function SideControl() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, SideControl);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = SideControl.__proto__ || (0, _getPrototypeOf2.default)(SideControl)).call.apply(_ref, [this].concat(args))), _this), _this.shouldComponentUpdate = function (nextProps, nextState) {
      return _this.props.editorState !== nextProps.editorState || _this.props.assetRequestPosition !== nextProps.assetRequestPosition || _this.props.allowNotesInsertion !== nextProps.allowNotesInsertion;
    }, _this.render = function () {
      var _this$props = _this.props,
          editorState = _this$props.editorState,
          onAssetRequest = _this$props.onAssetRequest,
          onAssetRequestCancel = _this$props.onAssetRequestCancel,
          onAssetChoice = _this$props.onAssetChoice,
          _this$props$assetChoi = _this$props.assetChoiceProps,
          assetChoiceProps = _this$props$assetChoi === undefined ? {} : _this$props$assetChoi,
          onNoteAdd = _this$props.onNoteAdd,
          _this$props$allowAsse = _this$props.allowAssets,
          allowAssets = _this$props$allowAsse === undefined ? {
        // inline: true,
        // block: true
      } : _this$props$allowAsse,
          iconMap = _this$props.iconMap,
          assetRequestPosition = _this$props.assetRequestPosition,
          AssetChoiceComponent = _this$props.AssetChoiceComponent,
          _this$props$allowNote = _this$props.allowNotesInsertion,
          allowNotesInsertion = _this$props$allowNote === undefined ? false : _this$props$allowNote;


      var onAssetButtonClick = function onAssetButtonClick(event) {
        event.stopPropagation();
        if (assetRequestPosition) {
          onAssetRequestCancel();
        } else {
          var currentSelection = editorState && editorState.getSelection();
          onAssetRequest(currentSelection);
        }
      };

      var bindToolbar = function bindToolbar(toolbar) {
        _this.toolbar = toolbar;
      };
      var stopEventPropagation = function stopEventPropagation(event) {
        return event.stopPropagation();
      };
      return _react2.default.createElement(
        'div',
        {
          className: 'scholar-draft-SideControl',
          ref: bindToolbar
        },
        allowNotesInsertion && !assetRequestPosition && _react2.default.createElement(_NoteButton2.default, {
          onClick: onNoteAdd,
          iconMap: iconMap
        }),
        (allowAssets.inline || allowAssets.block) && _react2.default.createElement(_AssetButton2.default, {
          onClick: onAssetButtonClick,
          active: assetRequestPosition !== undefined,
          iconMap: iconMap
        }),
        assetRequestPosition && _react2.default.createElement(
          'span',
          {
            className: 'block-asset-choice-container',
            onClick: stopEventPropagation
          },
          _react2.default.createElement(AssetChoiceComponent, (0, _extends3.default)({}, assetChoiceProps, {
            onAssetChoice: onAssetChoice,
            onAssetRequestCancel: onAssetRequestCancel
          }))
        )
      );
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return SideControl;
}(_react.Component);

SideControl.propTypes = {
  editorState: _propTypes2.default.object,
  assetChoiceProps: _propTypes2.default.object,

  iconMap: _propTypes2.default.object,
  assetRequestPosition: _propTypes2.default.object,

  allowNotesInsertion: _propTypes2.default.bool,
  allowAssets: _propTypes2.default.shape({
    inline: _propTypes2.default.bool,
    block: _propTypes2.default.bool
  }),

  AssetChoiceComponent: _propTypes2.default.func,
  onNoteAdd: _propTypes2.default.func,
  onAssetChoice: _propTypes2.default.func,
  onAssetRequest: _propTypes2.default.func,
  onAssetRequestCancel: _propTypes2.default.func

};
exports.default = SideControl;
module.exports = exports['default'];