'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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

var _lodash = require('lodash');

var _draftJsSimpledecorator = require('draft-js-simpledecorator');

var _draftJsSimpledecorator2 = _interopRequireDefault(_draftJsSimpledecorator);

var _draftJsMultidecorators = require('draft-js-multidecorators');

var _draftJsMultidecorators2 = _interopRequireDefault(_draftJsMultidecorators);

var _draftJs = require('draft-js');

var _adjustBlockDepth = require('../../modifiers/adjustBlockDepth');

var _adjustBlockDepth2 = _interopRequireDefault(_adjustBlockDepth);

var _handleBlockType = require('../../modifiers/handleBlockType');

var _handleBlockType2 = _interopRequireDefault(_handleBlockType);

var _handleInlineStyle = require('../../modifiers/handleInlineStyle');

var _handleInlineStyle2 = _interopRequireDefault(_handleInlineStyle);

var _handleNewCodeBlock = require('../../modifiers/handleNewCodeBlock');

var _handleNewCodeBlock2 = _interopRequireDefault(_handleNewCodeBlock);

var _insertEmptyBlock = require('../../modifiers/insertEmptyBlock');

var _insertEmptyBlock2 = _interopRequireDefault(_insertEmptyBlock);

var _leaveList = require('../../modifiers/leaveList');

var _leaveList2 = _interopRequireDefault(_leaveList);

var _insertText = require('../../modifiers/insertText');

var _insertText2 = _interopRequireDefault(_insertText);

var _constants = require('../../constants');

var _SideToolbar = require('../SideToolbar/SideToolbar');

var _SideToolbar2 = _interopRequireDefault(_SideToolbar);

var _InlineToolbar = require('../InlineToolbar/InlineToolbar');

var _InlineToolbar2 = _interopRequireDefault(_InlineToolbar);

var _InlineAssetContainer = require('../InlineAssetContainer/InlineAssetContainer');

var _InlineAssetContainer2 = _interopRequireDefault(_InlineAssetContainer);

var _BlockAssetContainer = require('../BlockAssetContainer/BlockAssetContainer');

var _BlockAssetContainer2 = _interopRequireDefault(_BlockAssetContainer);

var _QuoteContainer = require('../QuoteContainer/QuoteContainer');

var _QuoteContainer2 = _interopRequireDefault(_QuoteContainer);

var _NotePointer = require('../NotePointer/NotePointer');

var _NotePointer2 = _interopRequireDefault(_NotePointer);

var _defaultIconMap = require('../../icons/defaultIconMap');

var _defaultIconMap2 = _interopRequireDefault(_defaultIconMap);

require('./BasicEditor.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hasCommandModifier = _draftJs.KeyBindingUtil.hasCommandModifier;


var getSelectedBlockElement = function getSelectedBlockElement(range) {
  var node = range.startContainer;
  do {
    if (node.getAttribute && (node.getAttribute('data-block') == 'true' || node.getAttribute('data-contents') == 'true')) {
      return node;
    }
    node = node.parentNode;
  } while (node != null);
  return null;
};

var getSelectionRange = function getSelectionRange() {
  var selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  return selection.getRangeAt(0);
};

var isParentOf = function isParentOf(inputEle, maybeParent) {
  var ele = inputEle;
  while (ele.parentNode != null && ele.parentNode != document.body) {
    /* eslint eqeqeq:0 */
    if (ele.parentNode === maybeParent) return true;
    ele = ele.parentNode;
  }
  return false;
};

var popoverSpacing = 50;

function checkCharacterForState(editorState, character) {
  var newEditorState = (0, _handleBlockType2.default)(editorState, character);
  // this is commented because links and images should be handled upstream as resources
  // if (editorState === newEditorState) {
  //   newEditorState = handleImage(editorState, character);
  // }
  // if (editorState === newEditorState) {
  //   newEditorState = handleLink(editorState, character);
  // }
  if (editorState === newEditorState) {
    newEditorState = (0, _handleInlineStyle2.default)(editorState, character);
  }
  return newEditorState;
}

function checkReturnForState(editorState, ev) {
  var newEditorState = editorState;
  var contentState = editorState.getCurrentContent();
  var selection = editorState.getSelection();
  var key = selection.getStartKey();
  var currentBlock = contentState.getBlockForKey(key);
  var type = currentBlock.getType();
  var text = currentBlock.getText();
  if (/-list-item$/.test(type) && text === '') {
    newEditorState = (0, _leaveList2.default)(editorState);
  }
  if (newEditorState === editorState && (ev.ctrlKey || ev.shiftKey || ev.metaKey || ev.altKey || /^header-/.test(type))) {
    newEditorState = (0, _insertEmptyBlock2.default)(editorState);
  }
  if (newEditorState === editorState && type === 'code-block') {
    newEditorState = (0, _insertText2.default)(editorState, '\n');
  }
  if (newEditorState === editorState) {
    newEditorState = (0, _handleNewCodeBlock2.default)(editorState);
  }

  return newEditorState;
}

var BasicEditor = function (_Component) {
  (0, _inherits3.default)(BasicEditor, _Component);

  function BasicEditor(props) {
    (0, _classCallCheck3.default)(this, BasicEditor);

    // this.onChange = debounce(this.onChange, 200);
    var _this = (0, _possibleConstructorReturn3.default)(this, (BasicEditor.__proto__ || (0, _getPrototypeOf2.default)(BasicEditor)).call(this, props));

    _initialiseProps.call(_this);

    _this.debouncedUpdateSelection = (0, _lodash.debounce)(_this.updateSelection, 100);
    _this.forceRenderDebounced = (0, _lodash.debounce)(_this.forceRender, 200);

    _this.feedUndoStack = (0, _lodash.debounce)(_this.feedUndoStack, 1000);
    return _this;
  }

  (0, _createClass3.default)(BasicEditor, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (
      // !nextProps.readOnly ||
      this.state.editorState !== nextProps.editorState || this.state.assets !== nextProps.assets) {
        return true;
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      this.debouncedUpdateSelection();
      // force render of inline and atomic block elements
      var forceRender = this.forceRender;


      if (this.props.editorState !== prevProps.editorState || prevProps.assets !== this.props.assets || prevProps.readOnly !== this.props.readOnly || prevProps.notes !== this.props.notes) {
        forceRender(this.props);
      }

      if (this.props.editorState !== prevProps.editorState && this.editor) {
        this.editor.focus();
      }
    }
    /**
     * Draft.js strategy for finding inline assets and loading them with relevant props
     */

    /**
     * Draft.js strategy for finding inline note pointers and loading them with relevant props
     */

    /**
     * Draft.js strategy for finding quotes statements
     */
    // todo: improve with all lang./typography 
    // quotes configurations (french quotes, english quotes, ...)


    /**
     * Util for Draft.js strategies building
     */


    /**
     * updates the positions of toolbars relatively to current draft selection
     */

  }]);
  return BasicEditor;
}(_react.Component);

BasicEditor.propTypes = {
  /*
   * State-related props
   */
  editorState: _propTypes2.default.object,
  readOnly: _propTypes2.default.bool,
  assets: _propTypes2.default.object,
  notes: _propTypes2.default.object,
  clipboard: _propTypes2.default.object,
  inlineAssetComponents: _propTypes2.default.object,
  blockAssetComponents: _propTypes2.default.object,
  assetRequestPosition: _propTypes2.default.object,
  contentId: _propTypes2.default.string,
  messages: _propTypes2.default.object,
  /*
   * Method props
   */
  onEditorChange: _propTypes2.default.func,
  onNotesOrderChange: _propTypes2.default.func,
  onAssetRequest: _propTypes2.default.func,
  onNoteAdd: _propTypes2.default.func,
  onAssetClick: _propTypes2.default.func,
  onAssetMouseOver: _propTypes2.default.func,
  onAssetMouseOut: _propTypes2.default.func,
  onDrop: _propTypes2.default.func,
  onDragOver: _propTypes2.default.func,
  onClick: _propTypes2.default.func,
  onBlur: _propTypes2.default.func,
  onAssetChoice: _propTypes2.default.func,
  onAssetChange: _propTypes2.default.func,
  onAssetRequestCancel: _propTypes2.default.func,
  onNotePointerMouseClick: _propTypes2.default.func,
  onNotePointerMouseOver: _propTypes2.default.func,
  onNotePointerMouseOut: _propTypes2.default.func,
  /*
   * Parametrization props
   */
  editorClass: _propTypes2.default.string,
  editorStyle: _propTypes2.default.object,
  allowNotesInsertion: _propTypes2.default.bool,
  allowInlineAsset: _propTypes2.default.bool,
  allowBlockAsset: _propTypes2.default.bool,
  AssetChoiceComponent: _propTypes2.default.func,
  assetChoiceProps: _propTypes2.default.object,
  keyBindingFn: _propTypes2.default.func,
  inlineButtons: _propTypes2.default.object,
  NotePointerComponent: _propTypes2.default.object,

  placeholder: _propTypes2.default.string,

  iconMap: _propTypes2.default.object
};
BasicEditor.defaultProps = {
  blockAssetComponents: {}
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.state = {
    editorState: _draftJs.EditorState.createEmpty(),
    undoStack: [],
    redoStack: [],
    styles: {
      inlineToolbar: {},
      sideToolbar: {}
    }
  };

  this.componentWillReceiveProps = function (nextProps) {
    if (!_this2.props.readOnly && nextProps.readOnly) {
      _this2.setState({
        styles: {
          sideToolbar: {
            display: 'none'
          },
          inlineToolbar: {
            display: 'none'
          }
        }
      });
    }
    if (_this2.state.readOnly !== nextProps.readOnly) {
      _this2.setState({
        readOnly: nextProps.readOnly
      });
      setTimeout(function () {
        return _this2.updateSelection();
      });
    }
    if (_this2.state.editorState !== nextProps.editorState) {
      _this2.setState({
        editorState: nextProps.editorState || _draftJs.EditorState.createEmpty(_this2.createDecorator())
      });
    }
  };

  this.onNoteAdd = function () {
    if (typeof _this2.props.onNoteAdd === 'function') {
      _this2.props.onNoteAdd();
    }
    if (typeof _this2.props.onEditorChange === 'function') {
      setTimeout(function () {
        _this2.props.onEditorChange(_this2.props.editorState);
      }, 1);
    }
  };

  this.onAssetFocus = function (event) {
    event.stopPropagation();
    _this2.setState({
      readOnly: true
    });
  };

  this.onInputBlur = function (event) {
    event.stopPropagation();
    _this2.setState({
      readOnly: false
    });
  };

  this.onBlur = function (event) {
    _this2.setState({
      readOnly: true,
      styles: {
        inlineToolbar: {
          display: 'none'
        },
        sideToolbar: {
          display: 'none'
        }
      }
    });

    var onBlur = _this2.props.onBlur;

    if (onBlur) {
      onBlur(event);
    }
  };

  this.onChange = function (editorState) {
    if (typeof _this2.props.onEditorChange === 'function' && !_this2.props.readOnly) {
      _this2.props.onEditorChange(editorState);
    }
  };

  this.feedUndoStack = function (editorState) {
    var undoStack = _this2.state.undoStack;
    // max length for undo stack

    var newUndoStack = undoStack.length > 50 ? undoStack.slice(undoStack.length - 50) : undoStack;
    _this2.setState({
      undoStack: [].concat((0, _toConsumableArray3.default)(newUndoStack), [editorState])
    });
  };

  this.undo = function () {
    var _state = _this2.state,
        undoStack = _state.undoStack,
        redoStack = _state.redoStack;

    var newUndoStack = [].concat((0, _toConsumableArray3.default)(undoStack));
    if (undoStack.length > 1) {
      var last = newUndoStack.pop();
      _this2.setState({
        redoStack: [].concat((0, _toConsumableArray3.default)(redoStack), [last]),
        undoStack: newUndoStack
      });
      _this2.onChange(newUndoStack[newUndoStack.length - 1]);
    }
  };

  this.redo = function () {
    var _state2 = _this2.state,
        undoStack = _state2.undoStack,
        redoStack = _state2.redoStack;

    var newRedoStack = [].concat((0, _toConsumableArray3.default)(redoStack));
    if (redoStack.length) {
      var last = newRedoStack.pop();
      _this2.setState({
        undoStack: [].concat((0, _toConsumableArray3.default)(undoStack), [last]),
        redoStack: newRedoStack
      });
      _this2.onChange(last);
    }
  };

  this.forceRender = function (props) {
    var editorState = props.editorState || _this2.generateEmptyEditor();
    var content = editorState.getCurrentContent();

    var newEditorState = _draftJs.EditorState.createWithContent(content, _this2.createDecorator());

    var inlineStyle = _this2.state.editorState.getCurrentInlineStyle();
    var selectedEditorState = _draftJs.EditorState.acceptSelection(newEditorState, editorState.getSelection());
    selectedEditorState = _draftJs.EditorState.setInlineStyleOverride(selectedEditorState, inlineStyle);

    _this2.feedUndoStack(_this2.state.editorState);
    _this2.setState({
      editorState: selectedEditorState
    });
  };

  this._blockRenderer = function (contentBlock) {
    var type = contentBlock.getType();

    if (type === 'atomic') {
      var entityKey = contentBlock.getEntityAt(0);
      var contentState = _this2.state.editorState.getCurrentContent();
      var data = void 0;
      try {
        data = contentState.getEntity(entityKey).toJS();
      } catch (error) {
        return undefined;
      }
      var id = data.data.asset.id;
      var asset = _this2.props.assets[id];
      if (!asset) {
        return;
      }
      var blockAssetComponents = _this2.props.blockAssetComponents;

      var AssetComponent = blockAssetComponents[asset.type] || _react2.default.createElement('div', null);
      var _props = _this2.props,
          onChange = _props.onAssetChange,
          onMouseOver = _props.onAssetMouseOver,
          onMouseOut = _props.onAssetMouseOut,
          iconMap = _props.iconMap;
      var onFocus = _this2.onAssetFocus,
          onBlur = _this2.onInputBlur;

      if (asset) {
        return { /* eslint consistent-return:0 */
          component: _BlockAssetContainer2.default,
          editable: false,
          props: {
            assetId: id,
            asset: asset,
            onFocus: onFocus,
            onBlur: onBlur,
            onChange: onChange,
            onMouseOver: onMouseOver,
            onMouseOut: onMouseOut,
            AssetComponent: AssetComponent,
            iconMap: iconMap
          }
        };
      }
    }
  };

  this.defaultKeyBindingFn = function (event) {
    if (event && hasCommandModifier(event)) {
      switch (event.keyCode) {
        // `^`
        case 229:
          return 'add-note';
        // `z`
        case 90:
          return 'editor-undo';
        // `y`
        case 89:
          return 'editor-redo';

        default:
          break;
      }
    }
    return (0, _draftJs.getDefaultKeyBinding)(event);
  };

  this._handleKeyCommand = function (command) {
    if (command === 'add-note' && _this2.props.allowNotesInsertion && typeof _this2.props.onNoteAdd === 'function') {
      _this2.onNoteAdd();
      return 'handled';
    } else if (command === 'editor-undo') {
      _this2.undo();
    } else if (command === 'editor-redo') {
      _this2.redo();
    }
    var editorState = _this2.props.editorState;

    var newState = _draftJs.RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      _this2.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  this._handleBeforeInput = function (character, props) {
    // todo : make that feature more subtle
    if (character === '@') {
      _this2.props.onAssetRequest();
      return 'handled';
    }
    if (character !== ' ') {
      return 'not-handled';
    }
    var editorState = _this2.props.editorState;
    var newEditorState = checkCharacterForState(editorState, character);
    if (editorState !== newEditorState) {
      _this2.onChange(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  };

  this._onTab = function (ev) {
    var editorState = _this2.props.editorState;
    var newEditorState = (0, _adjustBlockDepth2.default)(editorState, ev);
    if (newEditorState !== editorState) {
      _this2.onChange(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  };

  this._handleReturn = function (ev) {
    var editorState = _this2.props.editorState;
    var newEditorState = checkReturnForState(editorState, ev);
    if (editorState !== newEditorState) {
      _this2.onChange(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  };

  this._handleDrop = function (sel, dataTransfer, isInternal) {
    var payload = dataTransfer.data.getData('text');
    // Set timeout to allow cursor/selection to move to drop location
    setTimeout(function () {
      var selection = _this2.props.editorState.getSelection();
      var anchorOffset = selection.getEndOffset() - payload.length;
      anchorOffset = anchorOffset < 0 ? 0 : anchorOffset;
      var payloadSel = selection.merge({
        anchorOffset: anchorOffset
      });

      var newContentState = _draftJs.Modifier.replaceText(_this2.props.editorState.getCurrentContent(), payloadSel, ' ');
      _this2.onChange(_draftJs.EditorState.createWithContent(newContentState));
      if (typeof _this2.props.onDrop === 'function') {
        _this2.props.onDrop(payload, selection);
      }
    }, 1);
    return false;
  };

  this._handleDragOver = function (event) {
    event.preventDefault();
    if (typeof _this2.props.onDragOver === 'function') {
      _this2.props.onDragOver(event);
    }
    return false;
  };

  this._handlePastedText = function (text, html) {

    setTimeout(function () {
      _this2.feedUndoStack(_this2.state.editorState);
    }, 1);

    if (_this2.props.clipboard) {
      _this2.editor.setClipboard(null);
      return true;
    }
    return false;
  };

  this.findInlineAsset = function (contentBlock, callback, inputContentState) {
    var contentState = inputContentState;
    if (!_this2.props.editorState) {
      callback(null);
    }
    if (contentState === undefined) {
      contentState = _this2.props.editorState.getCurrentContent();
    }
    contentBlock.findEntityRanges(function (character) {
      var entityKey = character.getEntity();
      return entityKey !== null && contentState.getEntity(entityKey).getType() === _constants.INLINE_ASSET;
    }, function (start, end) {
      var _props2 = _this2.props,
          assets = _props2.assets,
          onMouseOver = _props2.onAssetMouseOver,
          onMouseOut = _props2.onAssetMouseOut,
          onAssetChange = _props2.onAssetChange,
          components = _props2.inlineAssetComponents;
      var onFocus = _this2.onAssetFocus,
          onBlur = _this2.onInputBlur;

      var entityKey = contentBlock.getEntityAt(start);
      var data = _this2.state.editorState.getCurrentContent().getEntity(entityKey).toJS();
      var id = data.data.asset.id;
      var asset = assets[id];
      var props = {};
      if (asset) {
        props = {
          assetId: id,
          asset: asset,
          onMouseOver: onMouseOver,
          onMouseOut: onMouseOut,
          components: components,
          onChange: onAssetChange,
          onFocus: onFocus,
          onBlur: onBlur
        };
      }
      callback(start, end, props);
    });
  };

  this.findNotePointers = function (contentBlock, callback, inputContentState) {
    var contentState = inputContentState;
    if (contentState === undefined) {
      contentState = _this2.props.editorState.getCurrentContent();
    }
    contentBlock.findEntityRanges(function (character) {
      var entityKey = character.getEntity();
      return entityKey !== null && contentState.getEntity(entityKey).getType() === _constants.NOTE_POINTER;
    }, function (start, end) {
      var entityKey = contentBlock.getEntityAt(start);
      var data = _this2.state.editorState.getCurrentContent().getEntity(entityKey).toJS();
      var noteId = data.data.noteId;
      var onMouseOver = function onMouseOver(event) {
        if (typeof _this2.props.onNotePointerMouseOver === 'function') {
          _this2.props.onNotePointerMouseOver(noteId, event);
        }
      };
      var onMouseOut = function onMouseOut(event) {
        if (typeof _this2.props.onNotePointerMouseOut === 'function') {
          _this2.props.onNotePointerMouseOut(noteId, event);
        }
      };
      var onMouseClick = function onMouseClick(event) {
        if (typeof _this2.props.onNotePointerMouseClick === 'function') {
          _this2.props.onNotePointerMouseClick(noteId, event);
        }
      };
      var note = _this2.props.notes && _this2.props.notes[noteId];
      var props = (0, _extends3.default)({}, data.data, {
        note: note,
        onMouseOver: onMouseOver,
        onMouseOut: onMouseOut,
        onMouseClick: onMouseClick
      });
      callback(start, end, props);
    });
  };

  this.findQuotes = function (contentBlock, callback, contentState) {
    var QUOTE_REGEX = /("[^"]+")/gi;
    _this2.findWithRegex(QUOTE_REGEX, contentBlock, callback);
  };

  this.findWithRegex = function (regex, contentBlock, callback) {
    var text = contentBlock.getText();
    var matchArr = void 0;
    var start = void 0;
    while ((matchArr = regex.exec(text)) !== null) {
      start = matchArr.index;
      callback(start, start + matchArr[0].length);
    }
  };

  this.generateEmptyEditor = function () {
    return _draftJs.EditorState.createEmpty(_this2.createDecorator());
  };

  this.createDecorator = function () {
    var ActiveNotePointer = _this2.props.NotePointerComponent || _NotePointer2.default;
    return new _draftJsMultidecorators2.default([new _draftJsSimpledecorator2.default(_this2.findInlineAsset, _InlineAssetContainer2.default), new _draftJsSimpledecorator2.default(_this2.findNotePointers, ActiveNotePointer), new _draftJsSimpledecorator2.default(_this2.findQuotes, _QuoteContainer2.default)]);
  };

  this.updateSelection = function () {
    var left = void 0;
    var sideToolbarTop = void 0;

    var selectionRange = getSelectionRange();

    var editorEle = _this2.editor;

    var styles = {
      sideToolbar: (0, _extends3.default)({}, _this2.state.styles.sideToolbar),
      inlineToolbar: (0, _extends3.default)({}, _this2.state.styles.inlineToolbar)
    };

    if (!selectionRange) return;

    if (!editorEle || !isParentOf(selectionRange.commonAncestorContainer, editorEle.refs.editor)) {
      return;
    }

    var assetRequestPosition = _this2.props.assetRequestPosition;


    var sideToolbarEle = _this2.sideToolbar.toolbar;
    var rangeBounds = selectionRange.getBoundingClientRect();

    var selectedBlock = getSelectedBlockElement(selectionRange);
    if (selectedBlock) {
      var blockBounds = selectedBlock.getBoundingClientRect();
      var editorBounds = _this2.state.editorBounds;
      if (!editorBounds) return;
      sideToolbarTop = rangeBounds.top || blockBounds.top;
      styles.sideToolbar.top = sideToolbarTop; // `${sideToolbarTop}px`;
      // position at begining of the line if no asset requested or block asset requested
      // else position after selection
      var controlWidth = sideToolbarEle.offsetWidth || 50;
      left = assetRequestPosition ? (rangeBounds.right || editorBounds.left) + controlWidth : editorBounds.left - controlWidth;
      styles.sideToolbar.left = left;
      styles.sideToolbar.display = 'block';

      if (!selectionRange.collapsed) {
        styles.inlineToolbar.position = 'fixed';
        styles.inlineToolbar.display = 'block';
        var startNode = selectionRange.startContainer;
        while (startNode.nodeType === 3) {
          startNode = startNode.parentNode;
        }
        var popTop = rangeBounds.top /* - editorBounds.top + displaceY */ - popoverSpacing;
        left = rangeBounds.left;
        styles.inlineToolbar.left = left;
        styles.inlineToolbar.top = popTop;
      } else {
        styles.inlineToolbar.display = 'none';
      }
    } else {
      styles.sideToolbar.display = 'none';
      styles.inlineToolbar.display = 'none';
    }

    if ((0, _stringify2.default)(styles) !== (0, _stringify2.default)(_this2.state.styles)) {
      _this2.setState({
        styles: styles
      });
    }
  };

  this.focus = function (event) {
    if (_this2.props.readOnly) return;

    var stateMods = {};
    if (!_this2.props.readOnly && _this2.state.readOnly) {
      stateMods.readOnly = true;
    }

    var editorNode = _this2.editor && _this2.editor.refs.editor;
    stateMods.editorBounds = editorNode.getBoundingClientRect();

    if ((0, _keys2.default)(stateMods).length) {
      _this2.setState(stateMods);
    }

    setTimeout(function () {
      if (!_this2.state.readOnly) {
        editorNode.focus();
      }
    }, 1);
  };

  this.render = function () {
    var _props3 = _this2.props,
        _props3$editorState = _props3.editorState,
        editorState = _props3$editorState === undefined ? _draftJs.EditorState.createEmpty(_this2.createDecorator()) : _props3$editorState,
        _props3$editorClass = _props3.editorClass,
        editorClass = _props3$editorClass === undefined ? 'scholar-draft-BasicEditor' : _props3$editorClass,
        contentId = _props3.contentId,
        _props3$placeholder = _props3.placeholder,
        placeholder = _props3$placeholder === undefined ? 'write your text' : _props3$placeholder,
        _props3$allowNotesIns = _props3.allowNotesInsertion,
        allowNotesInsertion = _props3$allowNotesIns === undefined ? false : _props3$allowNotesIns,
        _props3$allowInlineAs = _props3.allowInlineAsset,
        allowInlineAsset = _props3$allowInlineAs === undefined ? true : _props3$allowInlineAs,
        _props3$allowBlockAss = _props3.allowBlockAsset,
        allowBlockAsset = _props3$allowBlockAss === undefined ? true : _props3$allowBlockAss,
        _props3$messages = _props3.messages,
        messages = _props3$messages === undefined ? {
      tooltips: {
        addNote: 'add a note (shortcut: "cmd + ^")',
        addAsset: 'add an asset (shortcut: "@")',
        cancel: 'cancel'
      }
    } : _props3$messages,
        onAssetRequestUpstream = _props3.onAssetRequest,
        assetRequestPosition = _props3.assetRequestPosition,
        onAssetRequestCancel = _props3.onAssetRequestCancel,
        onAssetChoice = _props3.onAssetChoice,
        editorStyle = _props3.editorStyle,
        onClick = _props3.onClick,
        AssetChoiceComponent = _props3.AssetChoiceComponent,
        assetChoiceProps = _props3.assetChoiceProps,
        otherProps = (0, _objectWithoutProperties3.default)(_props3, ['editorState', 'editorClass', 'contentId', 'placeholder', 'allowNotesInsertion', 'allowInlineAsset', 'allowBlockAsset', 'messages', 'onAssetRequest', 'assetRequestPosition', 'onAssetRequestCancel', 'onAssetChoice', 'editorStyle', 'onClick', 'AssetChoiceComponent', 'assetChoiceProps']);
    var _state3 = _this2.state,
        readOnly = _state3.readOnly,
        stateEditorState = _state3.editorState,
        styles = _state3.styles;
    var _handleKeyCommand = _this2._handleKeyCommand,
        _handleBeforeInput = _this2._handleBeforeInput,
        onChange = _this2.onChange,
        _blockRenderer = _this2._blockRenderer,
        _handleReturn = _this2._handleReturn,
        _onTab = _this2._onTab,
        _handleDrop = _this2._handleDrop,
        _handleDragOver = _this2._handleDragOver,
        _handlePastedText = _this2._handlePastedText,
        onNoteAdd = _this2.onNoteAdd,
        defaultKeyBindingFn = _this2.defaultKeyBindingFn;


    var realEditorState = editorState || _this2.generateEmptyEditor();

    var bindEditorRef = function bindEditorRef(editor) {
      _this2.editor = editor;
    };
    var bindSideToolbarRef = function bindSideToolbarRef(sideToolbar) {
      _this2.sideToolbar = sideToolbar;
    };

    var bindInlineToolbar = function bindInlineToolbar(inlineToolbar) {
      _this2.inlineToolbar = inlineToolbar;
    };

    var onAssetRequest = function onAssetRequest(selection) {
      if (typeof onAssetRequestUpstream === 'function') {
        onAssetRequestUpstream(selection);
      }
    };

    var onMainClick = function onMainClick(event) {
      if (typeof onClick === 'function') {
        onClick(event);
      }
      _this2.focus(event);
    };

    var keyBindingFn = typeof _this2.props.keyBindingFn === 'function' ? _this2.props.keyBindingFn : defaultKeyBindingFn;
    var iconMap = _this2.props.iconMap ? _this2.props.iconMap : _defaultIconMap2.default;
    return _react2.default.createElement(
      'div',
      {
        className: editorClass + (readOnly ? '' : ' active'),
        onClick: onMainClick,
        style: editorStyle,

        onDragOver: _handleDragOver
      },
      _react2.default.createElement(_InlineToolbar2.default, {
        ref: bindInlineToolbar,
        editorState: realEditorState,
        updateEditorState: onChange,
        iconMap: iconMap,
        style: styles.inlineToolbar
      }),
      _react2.default.createElement(_SideToolbar2.default, {
        ref: bindSideToolbarRef,

        allowAssets: {
          inline: allowInlineAsset,
          block: allowBlockAsset
        },
        allowNotesInsertion: allowNotesInsertion,

        style: styles.sideToolbar,

        onAssetRequest: onAssetRequest,
        onAssetRequestCancel: onAssetRequestCancel,
        onAssetChoice: onAssetChoice,
        assetRequestPosition: assetRequestPosition,
        assetChoiceProps: assetChoiceProps,

        AssetChoiceComponent: AssetChoiceComponent,
        iconMap: iconMap,

        messages: messages,

        contentId: contentId,

        onNoteAdd: onNoteAdd
      }),
      _react2.default.createElement(_draftJs.Editor, (0, _extends3.default)({
        blockRendererFn: _blockRenderer,
        spellCheck: true,
        readOnly: readOnly,
        placeholder: placeholder,

        keyBindingFn: keyBindingFn,

        handlePastedText: _handlePastedText,
        handleKeyCommand: _handleKeyCommand,
        handleBeforeInput: _handleBeforeInput,
        handleReturn: _handleReturn,
        onTab: _onTab,

        editorState: stateEditorState,

        handleDrop: _handleDrop,

        onChange: onChange,
        ref: bindEditorRef,
        onBlur: _this2.onBlur

      }, otherProps))
    );
  };
};

exports.default = BasicEditor;
module.exports = exports['default'];