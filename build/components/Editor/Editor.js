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

var _reactCustomScrollbars = require("react-custom-scrollbars");

var _d3Ease = require("d3-ease");

var _draftJs = require("draft-js");

var _BasicEditor = _interopRequireDefault(require("../BasicEditor/BasicEditor"));

var _NoteContainer = _interopRequireDefault(require("../NoteContainer/NoteContainer"));

require("./Editor.scss");

/**
 * This module exports a component representing an editor with main editor and footnotes,
 * with related interface and decorators.
 * Asset components must be provided through props
 * @module scholar-draft/Editor
 */
// import { getOffsetRelativeToContainer, } from '../../utils';
var DefaultElementLayout = function DefaultElementLayout(_ref) {
  var children = _ref.children,
      style = _ref.style,
      className = _ref.className;
  return _react.default.createElement("div", {
    style: style,
    className: className
  }, children);
};

DefaultElementLayout.propTypes = {
  children: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.element, _propTypes.default.func]),
  style: _propTypes.default.string,
  className: _propTypes.default.string
};

var Editor =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(Editor, _Component);

  function Editor(props) {
    var _this;

    (0, _classCallCheck2.default)(this, Editor);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Editor).call(this, props));
    /*
     * this is used as a map of refs
     * to interact with note components
     */

    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "componentDidMount", function () {
      if (_this.props.focusedEditorId) {
        _this.updateFocusedEditorId(_this.props.focusedEditorId);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "componentWillReceiveProps", function (nextProps) {
      if (_this.props.focusedEditorId !== nextProps.focusedEditorId) {
        _this.updateFocusedEditorId(nextProps.focusedEditorId);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "updateFocusedEditorId", function (focusedEditorId) {
      // dirty workaround for a firefox-specific bug - related to https://github.com/facebook/draft-js/issues/1812
      if (navigator.userAgent.search('Firefox')) {
        _this.setState({
          focusedEditorId: undefined
        });

        setTimeout(function () {
          _this.setState({
            focusedEditorId: focusedEditorId
          });

          if (focusedEditorId === 'main' && _this.editor) {
            _this.editor.focus();
          } else if (focusedEditorId && _this.notes[focusedEditorId]) {
            _this.notes[focusedEditorId].editor.focus();
          }
        }, 500);
      } else {
        _this.setState({
          focusedEditorId: focusedEditorId
        });
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "focus", function (contentId, selection) {
      if (contentId === 'main' && _this.mainEditor) {
        if (selection) {
          _this.mainEditor.setState({
            readOnly: false,
            editorState: _draftJs.EditorState.acceptSelection(_this.mainEditor.state.editorState, selection)
          });
        }

        setTimeout(function () {
          return _this.mainEditor.focus();
        });
      } else if (_this.notes[contentId]) {
        setTimeout(function () {
          return _this.notes[contentId].editor.focus();
        });

        if (selection) {
          _this.notes[contentId].editor.setState({
            readOnly: false,
            editorState: _draftJs.EditorState.acceptSelection(_this.notes[contentId].editor.state.editorState, selection)
          });
        }
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "generateEmptyEditor", function () {
      if (_this.mainEditor) {
        return _this.mainEditor.generateEmptyEditor();
      }

      return null;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "scrollToNote", function (thatNoteId) {
      var notePointer = document.getElementById("note-container-".concat(thatNoteId));
      var scrollTo = notePointer && notePointer.offsetTop;

      if (scrollTo) {
        _this.scrollTop(scrollTo);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "scrollToNotePointer", function (thatNoteId) {
      var notePointer = document.getElementById("note-pointer-".concat(thatNoteId));
      var scrollTo = notePointer && notePointer.offsetTop;

      if (scrollTo) {
        _this.scrollTop(scrollTo);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "renderNoteEditor", function (noteId, order) {
      var _this$props = _this.props,
          notes = _this$props.notes,
          assets = _this$props.assets,
          customContext = _this$props.customContext,
          editorPlaceholder = _this$props.editorPlaceholder,
          messages = _this$props.messages,
          onEditorChange = _this$props.onEditorChange,
          onAssetChange = _this$props.onAssetChange,
          onAssetRequest = _this$props.onAssetRequest,
          onAssetRequestCancel = _this$props.onAssetRequestCancel,
          onAssetChoice = _this$props.onAssetChoice,
          onAssetClick = _this$props.onAssetClick,
          onAssetMouseOver = _this$props.onAssetMouseOver,
          onAssetMouseOut = _this$props.onAssetMouseOut,
          handlePastedText = _this$props.handlePastedText,
          onNoteDelete = _this$props.onNoteDelete,
          onDrop = _this$props.onDrop,
          onDragOver = _this$props.onDragOver,
          onClick = _this$props.onClick,
          onBlur = _this$props.onBlur,
          assetRequestPosition = _this$props.assetRequestPosition,
          assetRequestContentId = _this$props.assetRequestContentId,
          assetChoiceProps = _this$props.assetChoiceProps,
          inlineAssetComponents = _this$props.inlineAssetComponents,
          blockAssetComponents = _this$props.blockAssetComponents,
          AssetChoiceComponent = _this$props.AssetChoiceComponent,
          inlineEntities = _this$props.inlineEntities,
          iconMap = _this$props.iconMap,
          keyBindingFn = _this$props.keyBindingFn,
          editorStyles = _this$props.editorStyles,
          NoteContainerComponent = _this$props.NoteContainerComponent,
          AssetButtonComponent = _this$props.AssetButtonComponent,
          NoteButtonComponent = _this$props.NoteButtonComponent,
          inlineButtons = _this$props.inlineButtons,
          renderingMode = _this$props.renderingMode,
          NoteLayout = _this$props.NoteLayout;
      var focusedEditorId = _this.state.focusedEditorId;
      var containerDimensions;

      if (_this.editor) {
        containerDimensions = _this.editor.getBoundingClientRect();
      }

      var onThisNoteEditorChange = function onThisNoteEditorChange(editor) {
        return onEditorChange(noteId, editor);
      };

      var onNoteAssetRequest = function onNoteAssetRequest(selection) {
        onAssetRequest(noteId, selection);
      };

      var onClickDelete = function onClickDelete() {
        if (typeof onNoteDelete === 'function') {
          _this.props.onNoteDelete(noteId);
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
        _this.notes[noteId] = thatNote;
      };

      var onNoteBlur = function onNoteBlur(event) {
        onBlur(event, noteId);
      };

      var onClickScrollToNotePointer = function onClickScrollToNotePointer(thatNoteId) {
        var notePointer = document.getElementById("note-pointer-".concat(thatNoteId));
        var scrollTo = notePointer && notePointer.offsetTop;

        if (scrollTo) {
          _this.scrollTop(scrollTo);
        }
      };

      var NoteContainer = NoteContainerComponent || _NoteContainer.default;
      return _react.default.createElement(NoteContainer, {
        key: noteId,
        note: note,
        notes: notes,
        assets: assets,
        customContext: customContext,
        editorPlaceholder: editorPlaceholder,
        ref: bindNote,
        messages: messages,
        contentId: noteId,
        assetRequestPosition: assetRequestPosition,
        assetRequestContentId: assetRequestContentId,
        assetChoiceProps: assetChoiceProps,
        isActive: noteId === focusedEditorId,
        onEditorClick: onNoteEditorClick,
        onBlur: onNoteBlur,
        renderingMode: renderingMode,
        onEditorChange: onThisNoteEditorChange,
        onClickScrollToNotePointer: onClickScrollToNotePointer,
        onAssetRequest: onNoteAssetRequest,
        onAssetRequestCancel: onAssetRequestCancel,
        onAssetChange: onAssetChange,
        onAssetChoice: onAssetChoice,
        handlePastedText: handlePastedText,
        onDrop: onNoteDrop,
        onDragOver: onNoteDragOver,
        onClickDelete: onClickDelete,
        onAssetClick: onAssetClick,
        onAssetMouseOver: onAssetMouseOver,
        onAssetMouseOut: onAssetMouseOut,
        containerDimensions: containerDimensions,
        inlineButtons: inlineButtons,
        inlineAssetComponents: inlineAssetComponents,
        blockAssetComponents: blockAssetComponents,
        AssetChoiceComponent: AssetChoiceComponent,
        inlineEntities: inlineEntities,
        iconMap: iconMap,
        keyBindingFn: keyBindingFn,
        NoteLayout: NoteLayout,
        AssetButtonComponent: AssetButtonComponent,
        NoteButtonComponent: NoteButtonComponent,
        editorStyle: editorStyles && editorStyles.noteEditor
      });
    });
    _this.notes = {};
    _this.state = {
      focusedEditorId: undefined
    };
    return _this;
  }
  /**
   * Executes code on instance after the component is mounted
   */


  (0, _createClass2.default)(Editor, [{
    key: "scrollTop",

    /**
     * Programmatically modifies the scroll state of the component
     * so that it transitions to a specific point in the page
     * @param {number} top - the position to scroll to in pixels
     */
    value: function scrollTop(initialTop) {
      var _this2 = this;

      var scrollbars = this.globalScrollbar;
      var scrollTop = scrollbars.getScrollTop();
      var scrollHeight = scrollbars.getScrollHeight();
      var top = initialTop > scrollHeight ? scrollHeight : initialTop;
      top = top < 0 ? 0 : top;
      var ANIMATION_DURATION = 1000;
      var ANIMATION_STEPS = 10;
      var animationTick = 1 / ANIMATION_STEPS;
      var diff = top - scrollTop;

      var _loop = function _loop(currentTime) {
        var to = (0, _d3Ease.easeCubic)(currentTime);
        setTimeout(function () {
          _this2.globalScrollbar.scrollTop(scrollTop + diff * to);
        }, ANIMATION_DURATION * currentTime);
      };

      for (var currentTime = 0; currentTime <= 1; currentTime += animationTick) {
        _loop(currentTime);
      }
    }
    /**
     * manages imperative focus on one of the editors
     * @param {string} contentId - 'main' or note uuid
     * @param {ImmutableRecord} selection - the selection to focus on
     */

  }, {
    key: "render",

    /**
     * Renders the component
     * @return {ReactMarkup} component - the output component
     */
    value: function render() {
      var _this3 = this;

      var _this$props2 = this.props,
          mainEditorState = _this$props2.mainEditorState,
          notes = _this$props2.notes,
          notesOrder = _this$props2.notesOrder,
          assets = _this$props2.assets,
          customContext = _this$props2.customContext,
          editorPlaceholder = _this$props2.editorPlaceholder,
          messages = _this$props2.messages,
          _this$props2$editorCl = _this$props2.editorClass,
          editorClass = _this$props2$editorCl === void 0 ? 'scholar-draft-Editor' : _this$props2$editorCl,
          onEditorChange = _this$props2.onEditorChange,
          onNoteAdd = _this$props2.onNoteAdd,
          onAssetChange = _this$props2.onAssetChange,
          onAssetRequest = _this$props2.onAssetRequest,
          onAssetRequestCancel = _this$props2.onAssetRequestCancel,
          onAssetChoice = _this$props2.onAssetChoice,
          onAssetClick = _this$props2.onAssetClick,
          onAssetMouseOver = _this$props2.onAssetMouseOver,
          onAssetMouseOut = _this$props2.onAssetMouseOut,
          onAssetBlur = _this$props2.onAssetBlur,
          handlePastedText = _this$props2.handlePastedText,
          onNotePointerMouseOver = _this$props2.onNotePointerMouseOver,
          onNotePointerMouseOut = _this$props2.onNotePointerMouseOut,
          onNotePointerMouseClick = _this$props2.onNotePointerMouseClick,
          onDrop = _this$props2.onDrop,
          onDragOver = _this$props2.onDragOver,
          onClick = _this$props2.onClick,
          onBlur = _this$props2.onBlur,
          assetRequestPosition = _this$props2.assetRequestPosition,
          assetRequestContentId = _this$props2.assetRequestContentId,
          assetChoiceProps = _this$props2.assetChoiceProps,
          inlineButtons = _this$props2.inlineButtons,
          inlineAssetComponents = _this$props2.inlineAssetComponents,
          blockAssetComponents = _this$props2.blockAssetComponents,
          AssetChoiceComponent = _this$props2.AssetChoiceComponent,
          NotePointerComponent = _this$props2.NotePointerComponent,
          AssetButtonComponent = _this$props2.AssetButtonComponent,
          NoteButtonComponent = _this$props2.NoteButtonComponent,
          ElementLayoutComponent = _this$props2.ElementLayoutComponent,
          _this$props2$inlineEn = _this$props2.inlineEntities,
          inlineEntities = _this$props2$inlineEn === void 0 ? [] : _this$props2$inlineEn,
          iconMap = _this$props2.iconMap,
          editorStyles = _this$props2.editorStyles,
          renderingMode = _this$props2.renderingMode;
      var focusedEditorId = this.state.focusedEditorId;
      var ElementLayout = ElementLayoutComponent || DefaultElementLayout;
      /**
       * bindings
       */

      var bindMainEditor = function bindMainEditor(editor) {
        _this3.mainEditor = editor;
      };
      /**
       * callbacks
       */


      var onMainEditorChange = function onMainEditorChange(editor) {
        onEditorChange('main', editor);
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

      var onNotePointerMouseClickHandler = function onNotePointerMouseClickHandler(event) {
        var noteContainer = document.getElementById("note-container-".concat(event));

        if (noteContainer) {
          var offsetTop = noteContainer.offsetTop;

          _this3.scrollTop(offsetTop);
        }

        if (typeof onNotePointerMouseClick === 'function') {
          onNotePointerMouseClick(event, 'main');
        }
      };

      var bindGlobalScrollbarRef = function bindGlobalScrollbarRef(scrollbar) {
        _this3.globalScrollbar = scrollbar;
      };

      var activeNotes = notesOrder || Object.keys(notes || {}).sort(function (first, second) {
        if (notes[first].order > notes[second].order) {
          return 1;
        }

        return -1;
      });

      var bindEditorRef = function bindEditorRef(editor) {
        _this3.editor = editor;
      };

      var containerDimensions;

      if (this.editor) {
        containerDimensions = this.editor.getBoundingClientRect();
      }

      var handleScrollUpdate = this.onScrollUpdate;
      return _react.default.createElement("div", {
        ref: bindEditorRef,
        className: editorClass
      }, _react.default.createElement(_reactCustomScrollbars.Scrollbars, {
        ref: bindGlobalScrollbarRef,
        className: 'custom-scrollbars',
        autoHide: true,
        onUpdate: handleScrollUpdate,
        universal: true
      }, _react.default.createElement(ElementLayout, {
        className: 'main-container-editor'
      }, _react.default.createElement(_BasicEditor.default, {
        editorState: mainEditorState,
        assets: assets,
        ref: bindMainEditor,
        customContext: customContext,
        messages: messages,
        editorPlaceholder: editorPlaceholder,
        notes: notes,
        contentId: 'main',
        assetRequestPosition: assetRequestPosition,
        isRequestingAssets: assetRequestContentId === 'main',
        assetChoiceProps: assetChoiceProps,
        isActive: focusedEditorId === 'main',
        onClick: onMainEditorClick,
        onBlur: onMainBlur,
        renderingMode: renderingMode,
        handlePastedText: handlePastedText,
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
        onAssetBlur: onAssetBlur,
        onNotePointerMouseOver: onNotePointerMouseOver,
        onNotePointerMouseOut: onNotePointerMouseOut,
        onNotePointerMouseClick: onNotePointerMouseClickHandler,
        inlineButtons: inlineButtons,
        inlineAssetComponents: inlineAssetComponents,
        blockAssetComponents: blockAssetComponents,
        AssetChoiceComponent: AssetChoiceComponent,
        NotePointerComponent: NotePointerComponent,
        AssetButtonComponent: AssetButtonComponent,
        NoteButtonComponent: NoteButtonComponent,
        inlineEntities: inlineEntities,
        iconMap: iconMap,
        containerDimensions: containerDimensions,
        allowNotesInsertion: true,
        editorStyle: editorStyles && editorStyles.mainEditor
      })), _react.default.createElement(ElementLayout, {
        className: 'notes-container'
      }, activeNotes.map(this.renderNoteEditor))));
    }
  }]);
  return Editor;
}(_react.Component);

exports.default = Editor;
(0, _defineProperty2.default)(Editor, "propTypes", {
  /**
   * EDITOR STATE
   */
  // draft-js immutable object representing the main editor state
  mainEditorState: _propTypes.default.object,
  // map of immutable objects representing the notes editor state
  notes: _propTypes.default.object,
  // array of ids for representing the order of notes
  notesOrder: _propTypes.default.array,
  assetRequestPosition: _propTypes.default.object,
  assetRequestContentId: _propTypes.default.string,
  assetChoiceProps: _propTypes.default.object,
  focusedEditorId: _propTypes.default.string,
  // custom context object that will be passed to downstream entity decoration components
  customContext: _propTypes.default.object,
  // list of objects possibly embeddable inside the editor
  assets: _propTypes.default.object,

  /**
   * CALLBACKS
   */
  onEditorChange: _propTypes.default.func,
  onNoteAdd: _propTypes.default.func,
  onAssetChange: _propTypes.default.func,
  onAssetRequest: _propTypes.default.func,
  onAssetRequestCancel: _propTypes.default.func,
  onAssetChoice: _propTypes.default.func,
  onAssetClick: _propTypes.default.func,
  onAssetMouseOver: _propTypes.default.func,
  onAssetMouseOut: _propTypes.default.func,
  onAssetBlur: _propTypes.default.func,
  handlePastedText: _propTypes.default.func,
  onNotePointerMouseOver: _propTypes.default.func,
  onNotePointerMouseOut: _propTypes.default.func,
  onNotePointerMouseClick: _propTypes.default.func,
  onNoteDelete: _propTypes.default.func,
  onDrop: _propTypes.default.func,
  onDragOver: _propTypes.default.func,
  onClick: _propTypes.default.func,
  onBlur: _propTypes.default.func,

  /**
   * CUSTOMIZATION
   */
  // (translated) messages to provide to the editor for displaying
  messages: _propTypes.default.shape({
    addNote: _propTypes.default.string,
    summonAsset: _propTypes.default.string,
    cancel: _propTypes.default.string
  }),
  // custom class for the editor
  editorClass: _propTypes.default.string,
  // editor placeholder text
  editorPlaceholder: _propTypes.default.string,
  inlineAssetComponents: _propTypes.default.object,
  blockAssetComponents: _propTypes.default.object,
  AssetChoiceComponent: _propTypes.default.func,
  NotePointerComponent: _propTypes.default.func,
  AssetButtonComponent: _propTypes.default.func,
  NoteButtonComponent: _propTypes.default.func,
  NoteLayout: _propTypes.default.func,
  inlineEntities: _propTypes.default.array,
  iconMap: _propTypes.default.object,
  inlineButtons: _propTypes.default.array,
  NoteContainerComponent: _propTypes.default.func,
  ElementLayoutComponent: _propTypes.default.func,
  // rendering mode to provide to entity decoration components
  renderingMode: _propTypes.default.string,
  keyBindingFn: _propTypes.default.func,
  // custom inline styles
  editorStyles: _propTypes.default.object
  /**
   * component contructor
   * @param {object} props - initializing props
   */

});
module.exports = exports.default;