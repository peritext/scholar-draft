'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

require('./SideToolbar.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SideToolbar = function (_Component) {
  (0, _inherits3.default)(SideToolbar, _Component);

  function SideToolbar(props) {
    (0, _classCallCheck3.default)(this, SideToolbar);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SideToolbar.__proto__ || (0, _getPrototypeOf2.default)(SideToolbar)).call(this, props));

    _this.shouldComponentUpdate = function (nextProps, nextState) {
      return _this.props.editorState !== nextProps.editorState || _this.props.assetRequestPosition !== nextProps.assetRequestPosition || _this.props.allowNotesInsertion !== nextProps.allowNotesInsertion || _this.props.AssetButtonComponent !== nextProps.AssetButtonComponent || _this.props.style !== nextProps.style || _this.state.assetChoiceStyle !== nextState.assetChoiceStyle;
    };

    _this.componentDidUpdate = function () {
      setTimeout(function () {
        var containerDimensions = _this.props.containerDimensions;

        var assetChoiceStyle = void 0;
        if (_this.assetChoiceComponent && _this.assetButton && _this.assetButton.element && _this.assetChoiceComponent.element && containerDimensions) {
          var _this$assetChoiceComp = _this.assetChoiceComponent.element.getBoundingClientRect(),
              width = _this$assetChoiceComp.width,
              height = _this$assetChoiceComp.height;

          var _this$assetButton$ele = _this.assetButton.element.getBoundingClientRect(),
              btnX = _this$assetButton$ele.x,
              btnY = _this$assetButton$ele.y,
              assetButtonWidth = _this$assetButton$ele.width,
              assetButtonHeight = _this$assetButton$ele.height;

          var rightExtremity = btnX + assetButtonWidth + width;
          var bottomExtremity = btnY + height;
          var rightBoundary = containerDimensions.x + containerDimensions.width;
          var bottomBoundary = containerDimensions.y + containerDimensions.height;

          if (
          // (
          rightExtremity > rightBoundary && bottomExtremity > bottomBoundary
          // )
          // ||
          // (
          //   rightExtremity > rightBoundary 
          //   && bottomExtremity + (assetButtonHeight * 2) + height > bottomBoundary
          // )
          ) {
              assetChoiceStyle = {
                left: -(width + assetButtonWidth),
                top: -(assetButtonHeight + height)
              };
            } else if (rightExtremity > rightBoundary) {
            assetChoiceStyle = {
              left: -(width + assetButtonWidth),
              top: assetButtonWidth
            };
          } else if (bottomExtremity > bottomBoundary) {
            assetChoiceStyle = {
              // left: -(width + assetButtonWidth * 2),
              top: -(assetButtonHeight + height)
            };
          }
        }
        if (!(_this.state.assetChoiceStyle === assetChoiceStyle || _this.state.assetChoiceStyle && assetChoiceStyle && (0, _stringify2.default)(_this.state.assetChoiceStyle) === (0, _stringify2.default)(assetChoiceStyle))) {
          _this.setState({ assetChoiceStyle: assetChoiceStyle });
        }
      }, 500);
    };

    _this.render = function () {
      var _this$props = _this.props,
          editorState = _this$props.editorState,
          contentId = _this$props.contentId,
          onAssetRequest = _this$props.onAssetRequest,
          onAssetRequestCancel = _this$props.onAssetRequestCancel,
          onAssetChoice = _this$props.onAssetChoice,
          onAssetChoiceFocus = _this$props.onAssetChoiceFocus,
          _this$props$assetChoi = _this$props.assetChoiceProps,
          assetChoiceProps = _this$props$assetChoi === undefined ? {} : _this$props$assetChoi,
          onNoteAdd = _this$props.onNoteAdd,
          _this$props$allowAsse = _this$props.allowAssets,
          allowAssets = _this$props$allowAsse === undefined ? {
        // inline: true,
        // block: true
      } : _this$props$allowAsse,
          messages = _this$props.messages,
          iconMap = _this$props.iconMap,
          assetRequestPosition = _this$props.assetRequestPosition,
          AssetChoiceComponent = _this$props.AssetChoiceComponent,
          AssetButtonComponent = _this$props.AssetButtonComponent,
          NoteButtonComponent = _this$props.NoteButtonComponent,
          _this$props$allowNote = _this$props.allowNotesInsertion,
          allowNotesInsertion = _this$props$allowNote === undefined ? false : _this$props$allowNote,
          style = _this$props.style;
      var assetChoiceStyle = _this.state.assetChoiceStyle;


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
      var bindAssetChoiceComponentRef = function bindAssetChoiceComponentRef(assetChoiceComponent) {
        _this.assetChoiceComponent = assetChoiceComponent;
      };
      var bindAssetButton = function bindAssetButton(assetButton) {
        _this.assetButton = assetButton;
      };
      var stopEventPropagation = function stopEventPropagation(event) {
        return event.stopPropagation();
      };
      var assetSelectorActive = assetRequestPosition !== undefined;

      var AssetButton = AssetButtonComponent || _AssetButton2.default;
      var NoteButton = NoteButtonComponent || _NoteButton2.default;

      return _react2.default.createElement(
        'div',
        {
          className: 'scholar-draft-SideToolbar',
          ref: bindToolbar,
          style: style
        },
        allowNotesInsertion && !assetRequestPosition && _react2.default.createElement(NoteButton, {
          onClick: onNoteAdd,
          iconMap: iconMap,
          message: messages && messages.addNote
        }),
        (allowAssets.inline || allowAssets.block) && _react2.default.createElement(AssetButton, {
          onClick: onAssetButtonClick,
          active: assetSelectorActive,
          iconMap: iconMap,
          ref: bindAssetButton,
          message: messages && assetSelectorActive ? messages.cancel : messages.summonAsset
        }),
        assetRequestPosition && _react2.default.createElement(
          'span',
          {
            className: 'block-asset-choice-container',
            onClick: stopEventPropagation,
            style: assetChoiceStyle
          },
          _react2.default.createElement(AssetChoiceComponent, (0, _extends3.default)({}, assetChoiceProps, {
            ref: bindAssetChoiceComponentRef,
            contentId: contentId,
            onAssetChoice: onAssetChoice,
            onAssetRequestCancel: onAssetRequestCancel,
            onAssetChoiceFocus: onAssetChoiceFocus

          }))
        )
      );
    };

    _this.state = {
      assetChoiceStyle: undefined
    };
    return _this;
  }

  return SideToolbar;
}(_react.Component); /**
                      * This module exports a react component for editors' side tool bar
                      * @module scholar-draft/SideToolbar
                      */


SideToolbar.propTypes = {
  editorState: _propTypes2.default.object,
  assetChoiceProps: _propTypes2.default.object,
  contentId: _propTypes2.default.string,

  iconMap: _propTypes2.default.object,
  assetRequestPosition: _propTypes2.default.object,

  style: _propTypes2.default.object,

  messages: _propTypes2.default.object,

  onAssetChoiceFocus: _propTypes2.default.func,

  allowNotesInsertion: _propTypes2.default.bool,
  allowAssets: _propTypes2.default.shape({
    inline: _propTypes2.default.bool,
    block: _propTypes2.default.bool
  }),

  AssetChoiceComponent: _propTypes2.default.func,
  AssetButtonComponent: _propTypes2.default.func,
  NoteButtonComponent: _propTypes2.default.func,
  onNoteAdd: _propTypes2.default.func,
  onAssetChoice: _propTypes2.default.func,
  onAssetRequest: _propTypes2.default.func,
  onAssetRequestCancel: _propTypes2.default.func,
  containerDimensions: _propTypes2.default.object

};
exports.default = SideToolbar;
module.exports = exports['default'];