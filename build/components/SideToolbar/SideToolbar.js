"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _AssetButton = _interopRequireDefault(require("../ToolbarButtons/AssetButton"));

var _NoteButton = _interopRequireDefault(require("../ToolbarButtons/NoteButton"));

require("./SideToolbar.scss");

/**
 * This module exports a react component for editors' side tool bar
 * @module scholar-draft/SideToolbar
 */
var SideToolbar =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(SideToolbar, _Component);

  function SideToolbar(props) {
    var _this;

    (0, _classCallCheck2.default)(this, SideToolbar);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(SideToolbar).call(this, props));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "shouldComponentUpdate", function (nextProps, nextState) {
      return _this.props.editorState !== nextProps.editorState || _this.props.assetRequestPosition !== nextProps.assetRequestPosition || _this.props.allowNotesInsertion !== nextProps.allowNotesInsertion || _this.props.AssetButtonComponent !== nextProps.AssetButtonComponent || _this.props.style !== nextProps.style || _this.state.assetChoiceStyle !== nextState.assetChoiceStyle;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "componentDidUpdate", function () {
      setTimeout(function () {
        var containerDimensions = _this.props.containerDimensions;
        var assetChoiceStyle;

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

          if ( // (
          rightExtremity > rightBoundary && bottomExtremity > bottomBoundary // )
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

        if (!(_this.state.assetChoiceStyle === assetChoiceStyle || _this.state.assetChoiceStyle && assetChoiceStyle && JSON.stringify(_this.state.assetChoiceStyle) === JSON.stringify(assetChoiceStyle))) {
          _this.setState({
            assetChoiceStyle: assetChoiceStyle
          });
        }
      }, 500);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "render", function () {
      var _this$props = _this.props,
          editorState = _this$props.editorState,
          contentId = _this$props.contentId,
          onAssetRequest = _this$props.onAssetRequest,
          onAssetRequestCancel = _this$props.onAssetRequestCancel,
          onAssetChoice = _this$props.onAssetChoice,
          onAssetChoiceFocus = _this$props.onAssetChoiceFocus,
          _this$props$assetChoi = _this$props.assetChoiceProps,
          assetChoiceProps = _this$props$assetChoi === void 0 ? {} : _this$props$assetChoi,
          onNoteAdd = _this$props.onNoteAdd,
          _this$props$allowAsse = _this$props.allowAssets,
          allowAssets = _this$props$allowAsse === void 0 ? {} : _this$props$allowAsse,
          messages = _this$props.messages,
          iconMap = _this$props.iconMap,
          assetRequestPosition = _this$props.assetRequestPosition,
          AssetChoiceComponent = _this$props.AssetChoiceComponent,
          AssetButtonComponent = _this$props.AssetButtonComponent,
          NoteButtonComponent = _this$props.NoteButtonComponent,
          _this$props$allowNote = _this$props.allowNotesInsertion,
          allowNotesInsertion = _this$props$allowNote === void 0 ? false : _this$props$allowNote,
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
      var AssetButton = AssetButtonComponent || _AssetButton.default;
      var NoteButton = NoteButtonComponent || _NoteButton.default;
      return _react.default.createElement("div", {
        className: "scholar-draft-SideToolbar",
        ref: bindToolbar,
        style: style
      }, allowNotesInsertion && !assetRequestPosition && _react.default.createElement(NoteButton, {
        onClick: onNoteAdd,
        iconMap: iconMap,
        message: messages && messages.addNote
      }), (allowAssets.inline || allowAssets.block) && _react.default.createElement(AssetButton, {
        onClick: onAssetButtonClick,
        active: assetSelectorActive,
        iconMap: iconMap,
        ref: bindAssetButton,
        message: messages && assetSelectorActive ? messages.cancel : messages.summonAsset
      }), assetRequestPosition && _react.default.createElement("span", {
        className: "block-asset-choice-container",
        onClick: stopEventPropagation,
        style: assetChoiceStyle
      }, _react.default.createElement(AssetChoiceComponent, (0, _extends2.default)({}, assetChoiceProps, {
        ref: bindAssetChoiceComponentRef,
        contentId: contentId,
        onAssetChoice: onAssetChoice,
        onAssetRequestCancel: onAssetRequestCancel,
        onAssetChoiceFocus: onAssetChoiceFocus
      }))));
    });
    _this.state = {
      assetChoiceStyle: undefined
    };
    return _this;
  }

  return SideToolbar;
}(_react.Component);

exports.default = SideToolbar;
(0, _defineProperty2.default)(SideToolbar, "propTypes", {
  editorState: _propTypes.default.object,
  assetChoiceProps: _propTypes.default.object,
  contentId: _propTypes.default.string,
  iconMap: _propTypes.default.object,
  assetRequestPosition: _propTypes.default.object,
  style: _propTypes.default.object,
  messages: _propTypes.default.object,
  onAssetChoiceFocus: _propTypes.default.func,
  allowNotesInsertion: _propTypes.default.bool,
  allowAssets: _propTypes.default.shape({
    inline: _propTypes.default.bool,
    block: _propTypes.default.bool
  }),
  AssetChoiceComponent: _propTypes.default.func,
  AssetButtonComponent: _propTypes.default.func,
  NoteButtonComponent: _propTypes.default.func,
  onNoteAdd: _propTypes.default.func,
  onAssetChoice: _propTypes.default.func,
  onAssetRequest: _propTypes.default.func,
  onAssetRequestCancel: _propTypes.default.func,
  containerDimensions: _propTypes.default.object
});
module.exports = exports.default;