'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Emitter = undefined;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _uuid = require('uuid');

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

// default icon map (exposes a map of img components - overriden by props-provided icon map)


// subcomponents


// modifiers helping to modify editorState
var hasCommandModifier = _draftJs.KeyBindingUtil.hasCommandModifier;

/**
 * Gets the block element corresponding to a given range of selection
 * @param {object} range - the input range to look in
 * @return {object} node
 */


// constant entities type names


// draft-js EditorState decorators utils
/**
 * This module exports a component representing a single draft editor
 * with related interface and decorators.
 * Asset components must be provided through props
 * @module scholar-draft/BasicEditor
 */

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

/**
 * Gets the current window's selection range (start and end)
 * @return {object} selection range
 */
var getSelectionRange = function getSelectionRange() {
  var selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  return selection.getRangeAt(0);
};

/**
 * Checks if a DOM element is parent of another one
 * @param {inputEle} DOMEl - the presumed child
 * @param {inputEle} DOMEl - the presumed parent
 * @return {boolean} isParent - whether yes or no
 */
var isParentOf = function isParentOf(inputEle, maybeParent) {
  var ele = inputEle;
  while (ele.parentNode != null && ele.parentNode != document.body) {
    /* eslint eqeqeq:0 */
    if (ele.parentNode === maybeParent) return true;
    ele = ele.parentNode;
  }
  return false;
};

// todo : store that somewhere else
var popoverSpacing = 50;

/**
 * Handles a character's style
 * @param {ImmutableRecord} editorState - the input editor state
 * @param {ImmutableRecord} character - the character to check
 * @return {ImmutableRecord} newEditorState - the new editor state
 */
function checkCharacterForState(editorState, character) {
  var newEditorState = (0, _handleBlockType2.default)(editorState, character);
  if (editorState === newEditorState) {
    newEditorState = (0, _handleInlineStyle2.default)(editorState, character);
  }
  return newEditorState;
}

// todo : this function is a perf bottleneck
/**
 * Resolves return key hit
 * @param {ImmutableRecord} editorState - the input editor state
 * @param {object} ev - the original key event
 * @return {ImmutableRecord} newEditorState - the new editor state
 */
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

/**
 * This class allows to produce event emitters
 * that will be used to dispatch assets changes 
 * and notes changes through context
 */

var Emitter = exports.Emitter = function Emitter() {
  var _this = this;

  (0, _classCallCheck3.default)(this, Emitter);
  this.assetsListeners = new _map2.default();
  this.notesListeners = new _map2.default();
  this.assetChoicePropsListeners = new _map2.default();

  this.subscribeToAssets = function (listener) {
    var id = (0, _uuid.v4)();
    _this.assetsListeners.set(id, listener);
    return function () {
      return _this.assetsListeners.delete(id);
    };
  };

  this.subscribeToNotes = function (listener) {
    var id = (0, _uuid.v4)();
    _this.notesListeners.set(id, listener);
    return function () {
      return _this.notesListeners.delete(id);
    };
  };

  this.subscribeToAssetChoiceProps = function (listener) {
    var id = (0, _uuid.v4)();
    _this.assetChoicePropsListeners.set(id, listener);
    return function () {
      return _this.assetChoicePropsListeners.delete(id);
    };
  };

  this.dispatchAssets = function (assets) {
    _this.assetsListeners.forEach(function (listener) {
      listener(assets);
    });
  };

  this.dispatchNotes = function (notes) {
    _this.notesListeners.forEach(function (listener) {
      listener(notes);
    });
  };

  this.dispatchAssetChoiceProps = function (props) {
    _this.assetChoicePropsListeners.forEach(function (listener) {
      listener(props);
    });
  };
};

var BasicEditor = function (_Component) {
  (0, _inherits3.default)(BasicEditor, _Component);

  /**
   * Component class's constructor
   * @param {object} props - props received at initialization
   */


  /**
   * Component class's default properties
   */
  function BasicEditor(props) {
    (0, _classCallCheck3.default)(this, BasicEditor);

    // selection positionning is debounced to improve performance
    var _this2 = (0, _possibleConstructorReturn3.default)(this, (BasicEditor.__proto__ || (0, _getPrototypeOf2.default)(BasicEditor)).call(this, props));

    _initialiseProps.call(_this2);

    _this2.debouncedUpdateSelection = (0, _lodash.debounce)(_this2.updateSelection, 100);
    // undo stack is debounced to improve performance
    _this2.feedUndoStack = (0, _lodash.debounce)(_this2.feedUndoStack, 1000);
    // it is needed to bind this function right away for being able
    // to initialize the state
    _this2.generateEmptyEditor = _this2.generateEmptyEditor.bind(_this2);

    _this2.state = {
      // editor state is initialized with a decorated editorState (notes + assets + ...)
      editorState: _this2.generateEmptyEditor(),
      // editor states undo and redo stacks
      undoStack: [],
      redoStack: [],
      // toolbars styles are represented as css-in-js
      styles: {
        inlineToolbar: {},
        sideToolbar: {}
      },
      readOnly: true
    };
    // the emitter allows to let custom components know when data is changed
    _this2.emitter = new Emitter();
    return _this2;
  }

  /**
   * Binds component's data to its context
   */


  /**
   * Component class's context properties types
   */


  /**
   * Component class's properties accepted types
   */


  (0, _createClass3.default)(BasicEditor, [{
    key: 'componentDidMount',


    /**
     * Component livecycle hooks
     */

    value: function componentDidMount() {
      var _this3 = this;

      setTimeout(function () {
        _this3.setState({
          readOnly: false
        });
        _this3.forceRender(_this3.props);
      });
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return true;
      // if (
      //   this.state.readOnly !== nextState.readOnly ||
      //   this.state.editorState !== nextProps.editorState ||
      //   this.state.assets !== nextProps.assets
      // ) {
      //   return true;
      // }
      // return false;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      this.debouncedUpdateSelection();
      if (this.props.editorState !== prevProps.editorState && this.editor && !this.state.readOnly && this.props.isActive) {
        this.editor.focus();
      }
    }

    /**
     * Handles note addition in a secured and appropriate way
     */


    /**
     * Locks draft js editor when an asset is focused
     * @param {object} event - the input event
     */


    /**
     * Unlocks draft js editor when an asset is unfocused
     * @param {object} event - the input event
     */


    /**
     * Locks draft js editor and hides the toolbars when editor is blured
     * @param {object} event - the input event
     */


    /**
     * Fires onEditorChange callback if provided 
     * @param {ImmutableRecord} editorState - the new editor state
     */


    /**
     * Stores previous editor states in an undo stack
     * @param {ImmutableRecord} editorState - the input editor state
     */


    /**
     * Manages relevant state changes and callbacks when undo is called
     */


    /**
     * Manages relevant state changes and callbacks when redo is called
     */


    /**
     * tricks draftJs editor component by forcing it to re-render
     * without changing anything to its state.
     * To do so editor state is recreated with a different selection's reference, which makes
     * a new editorState object and related js reference, therefore forcing the component
     * to render in the render() method
     * @params {object} props - the component's props to manipulate
     */


    /**
     * Custom draft-js renderer handling atomic blocks with library's BlockAssetContainer component
     * and user-provided assets components
     * @param {ImmutableRecord} contentBlock - the content block to render
     */


    /**
     * Binds custom key commands to editorState commands
     * @param {object} event - the key event
     * @return {string} operation - the command to perform
     */


    /**
     * Handles component's custom command
     * @param {string} command - the command input to change the editor state
     * @param {string} handled - whether the command has been handled or not
     */


    /**
     * Draft-js event hook triggered before every key event
     * @param {string} character - the character input through the key event
     */


    /**
     * Handles tab hit
     * @param {obj} ev - the key event
     * @param {string} handled - whether the command has been handled or not
     */

    /**
     * Handles return hit
     * @param {obj} ev - the key event
     * @param {string} handled - whether the command has been handled or not
     */

    /**
     * Handles drop on component
     * @param {ImmutableRecord} sel - the selection on which the drop is set
     * @param {object} dataTransfer - the js dataTransfer object storing data about the drop
     * @param {boolean} isInternal - whether the drop is draft-to-draft or exterior-to-draft
     */


    /**
     * Handles when a dragged object is dragged over the component
     * @param {obj} ev - the key event
     * @param {bool} handled - whether is handled
     */


    /**
     * Handles paste command
     * @param {string} text - the text representation of pasted content
     * @param {string} html - the html representation of pasted content
     */

    /**
     * Draft.js strategy for finding inline assets and loading them with relevant props
     * @param {ImmutableRecord} contentBlock - the content block in which entities are searched
     * @param {function} callback - callback with arguments (startRange, endRange, props to pass)
     * @param {ImmutableRecord} inputContentState - the content state to parse
     */

    /**
     * Draft.js strategy for finding inline note pointers and loading them with relevant props
     * @param {ImmutableRecord} contentBlock - the content block in which entities are searched
     * @param {function} callback - callback with arguments (startRange, endRange, props to pass)
     * @param {ImmutableRecord} inputContentState - the content state to parse
     */

    /**
     * Draft.js strategy for finding quotes statements
     * @param {ImmutableRecord} contentBlock - the content block in which entities are searched
     * @param {function} callback - callback with arguments (startRange, endRange, props to pass)
     * @param {ImmutableRecord} inputContentState - the content state to parse
     */
    // todo: improve with all lang./typography 
    // quotes configurations (french quotes, english quotes, ...)


    /**
     * Util for Draft.js strategies building
     */


    /**
     * updates the positions of toolbars relatively to current draft selection
     */


    /*
     * Triggers component focus
     * @param {event} object - the input event
     */


    /**
     * Renders the component
     * @return {ReactMarkup} component - the component as react markup
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
  isActive: _propTypes2.default.bool,
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
  onNotePointerMouseOver: _propTypes2.default.func,
  onNotePointerMouseOut: _propTypes2.default.func,
  onNotePointerMouseClick: _propTypes2.default.func,
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
  NotePointerComponent: _propTypes2.default.func,
  BibliographyComponent: _propTypes2.default.func,
  inlineEntities: _propTypes2.default.array,

  placeholder: _propTypes2.default.string,

  iconMap: _propTypes2.default.object };
BasicEditor.defaultProps = {
  blockAssetComponents: {}
};
BasicEditor.childContextTypes = {
  emitter: _propTypes2.default.object,
  assets: _propTypes2.default.object,
  notes: _propTypes2.default.object,
  assetChoiceProps: _propTypes2.default.object,
  onAssetMouseOver: _propTypes2.default.func,
  onAssetMouseOut: _propTypes2.default.func,
  onAssetChange: _propTypes2.default.func,
  onAssetFocus: _propTypes2.default.func,
  onAssetBlur: _propTypes2.default.func,

  onNotePointerMouseOver: _propTypes2.default.func,
  onNotePointerMouseOut: _propTypes2.default.func,
  onNotePointerMouseClick: _propTypes2.default.func,

  iconMap: _propTypes2.default.object };

var _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.getChildContext = function () {
    return {
      emitter: _this4.emitter,
      assets: _this4.props.assets,
      assetChoiceProps: _this4.props.assetChoiceProps,
      iconMap: _this4.props.iconMap,

      onAssetMouseOver: _this4.props.onAssetMouseOver,
      onAssetMouseOut: _this4.props.onAssetMouseOut,
      onAssetChange: _this4.props.onAssetChange,
      onAssetFocus: _this4.onAssetFocus,
      onAssetBlur: _this4.onAssetBlur,

      onNotePointerMouseOver: _this4.props.onNotePointerMouseOver,
      onNotePointerMouseOut: _this4.props.onNotePointerMouseOut,
      onNotePointerMouseClick: _this4.props.onNotePointerMouseClick,
      notes: _this4.props.notes
    };
  };

  this.componentWillReceiveProps = function (nextProps) {
    // hiding the toolbars when editor is set to inactive
    if (_this4.props.isActive && !nextProps.isActive) {
      _this4.setState({
        styles: {
          sideToolbar: {
            display: 'none'
          },
          inlineToolbar: {
            display: 'none'
          }
        }
      });
      // locking the draft-editor if asset choice component is not open
      if (!nextProps.assetRequestPosition) {
        _this4.setState({
          readOnly: true
        });
      }
    }
    // updating locally stored editorState when the one given by props
    // has changed
    if (_this4.props.editorState !== nextProps.editorState) {
      _this4.setState({
        editorState: nextProps.editorState || _this4.generateEmptyEditor()
      });
    }

    // trigger changes when assets are changed
    if (_this4.props.assets !== nextProps.assets) {
      // dispatch new assets through context's emitter
      _this4.emitter.dispatchAssets(nextProps.assets);
      // update state-stored assets
      _this4.setState({ assets: nextProps.assets });
      // if the number of assets is changed it means
      // new entities might be present in the editor.
      // As, for optimizations reasons, draft-js editor does not update
      // its entity map in this case (did not exactly understand why)
      // it has to be forced to re-render itself
      if (!_this4.props.assets || !nextProps.assets || (0, _keys2.default)(_this4.props.assets).length !== (0, _keys2.default)(nextProps.assets).length) {
        // re-rendering after a timeout.
        // not doing that causes the draft editor not to update
        // before a new modification is applied to it
        // this is weird but it works
        setTimeout(function () {
          return _this4.forceRender(nextProps);
        });
        // setTimeout(() => this.forceRender(nextProps), 500);
      }
    }
    // trigger changes when notes are changed
    if (_this4.props.notes !== nextProps.notes) {
      // dispatch new notes through context's emitter
      _this4.emitter.dispatchNotes(nextProps.notes);
      // update state-stored notes
      _this4.setState({ notes: nextProps.notes });
      // if the number of notes is changed it means
      // new entities might be present in the editor.
      // As, for optimizations reasons, draft-js editor does not update
      // its entity map in this case (did not exactly understand why)
      // it has to be forced to re-render itself
      if (!_this4.props.notes || !nextProps.notes || (0, _keys2.default)(_this4.props.notes).length !== (0, _keys2.default)(nextProps.notes).length) {
        // re-rendering after a timeout.
        // not doing that causes the draft editor not to update
        // before a new modification is applied to it
        _this4.forceRender(nextProps);
      }
    }
    // trigger changes when notes are changed
    if (_this4.props.assetChoiceProps !== nextProps.assetChoiceProps) {
      // dispatch new notes through context's emitter
      _this4.emitter.dispatchAssetChoiceProps(nextProps.assetChoiceProps);
    }
  };

  this.onNoteAdd = function () {
    if (typeof _this4.props.onNoteAdd === 'function') {
      _this4.props.onNoteAdd();
    }
    if (typeof _this4.props.onEditorChange === 'function') {
      setTimeout(function () {
        _this4.props.onEditorChange(_this4.props.editorState);
      }, 1);
    }
  };

  this.onAssetFocus = function (event) {
    event.stopPropagation();
    _this4.setState({
      readOnly: true
    });
  };

  this.onAssetBlur = function (event) {
    event.stopPropagation();
    _this4.setState({
      readOnly: false
    });
  };

  this.onBlur = function (event) {
    _this4.setState({
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

    // calls onBlur callbacks if provided
    var onBlur = _this4.props.onBlur;

    if (typeof onBlur === 'function') {
      onBlur(event);
    }
  };

  this.onChange = function (editorState) {
    var feedUndoStack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (feedUndoStack === true) {
      _this4.feedUndoStack(editorState);
    }
    if (typeof _this4.props.onEditorChange === 'function' /* && !this.props.readOnly */) {
        _this4.props.onEditorChange(editorState);
      }
  };

  this.feedUndoStack = function (editorState) {
    var undoStack = _this4.state.undoStack;
    // max length for undo stack
    // todo: store that in props or in a variable

    var newUndoStack = undoStack.length > 50 ? undoStack.slice(undoStack.length - 50) : undoStack;
    _this4.setState({
      undoStack: [].concat((0, _toConsumableArray3.default)(newUndoStack), [editorState])
    });
  };

  this.undo = function () {
    var _state = _this4.state,
        undoStack = _state.undoStack,
        redoStack = _state.redoStack;

    var newUndoStack = [].concat((0, _toConsumableArray3.default)(undoStack));
    if (undoStack.length > 1) {
      var last = newUndoStack.pop();
      _this4.setState({
        redoStack: [].concat((0, _toConsumableArray3.default)(redoStack), [last]),
        undoStack: newUndoStack
      });
      _this4.onChange(newUndoStack[newUndoStack.length - 1], false);
      // draft-js won't notice the change of editorState
      // so we have to force it to re-render after having received
      // the new editorStaten
      setTimeout(function () {
        return _this4.forceRender(_this4.props);
      });
    }
  };

  this.redo = function () {
    var _state2 = _this4.state,
        undoStack = _state2.undoStack,
        redoStack = _state2.redoStack;

    var newRedoStack = [].concat((0, _toConsumableArray3.default)(redoStack));
    if (redoStack.length) {
      var last = newRedoStack.pop();
      _this4.setState({
        undoStack: [].concat((0, _toConsumableArray3.default)(undoStack), [last]),
        redoStack: newRedoStack
      });
      _this4.onChange(last);
    }
  };

  this.forceRender = function (props) {
    var editorState = props.editorState || _this4.generateEmptyEditor();
    var content = editorState.getCurrentContent();
    var newEditorState = _draftJs.EditorState.createWithContent(content, _this4.createDecorator());
    var selectedEditorState = _draftJs.EditorState.acceptSelection(newEditorState, editorState.getSelection());
    var inlineStyle = _this4.state.editorState.getCurrentInlineStyle();
    selectedEditorState = _draftJs.EditorState.setInlineStyleOverride(selectedEditorState, inlineStyle);

    _this4.setState({
      editorState: selectedEditorState
    });
  };

  this._blockRenderer = function (contentBlock) {
    var type = contentBlock.getType();

    if (type === 'atomic') {
      var entityKey = contentBlock.getEntityAt(0);
      var contentState = _this4.state.editorState.getCurrentContent();
      var data = void 0;
      try {
        data = contentState.getEntity(entityKey).toJS();
      } catch (error) {
        return undefined;
      }
      var id = data && data.data && data.data.asset && data.data.asset.id;
      var asset = _this4.props.assets[id];
      if (!asset) {
        return;
      }
      var blockAssetComponents = _this4.props.blockAssetComponents;

      var AssetComponent = blockAssetComponents[asset.type] || _react2.default.createElement('div', null);

      if (asset) {
        return { /* eslint consistent-return:0 */
          component: _BlockAssetContainer2.default,
          editable: false,
          props: {
            assetId: id,
            AssetComponent: AssetComponent
          }
        };
      }
    }
  };

  this._defaultKeyBindingFn = function (event) {
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
    if (command === 'add-note' && _this4.props.allowNotesInsertion && typeof _this4.props.onNoteAdd === 'function') {
      _this4.onNoteAdd();
      return 'handled';
    } else if (command === 'editor-undo') {
      _this4.undo();
    } else if (command === 'editor-redo') {
      _this4.redo();
    }
    var editorState = _this4.props.editorState;

    var newState = _draftJs.RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      _this4.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  this._handleBeforeInput = function (character) {
    // todo : make that feature more subtle and customizable through props
    if (character === '@') {
      _this4.props.onAssetRequest();
      return 'handled';
    }
    if (character !== ' ') {
      return 'not-handled';
    }
    var editorState = _this4.props.editorState;
    var newEditorState = checkCharacterForState(editorState, character);
    if (editorState !== newEditorState) {
      _this4.onChange(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  };

  this._onTab = function (ev) {
    var editorState = _this4.props.editorState;
    var newEditorState = (0, _adjustBlockDepth2.default)(editorState, ev);
    if (newEditorState !== editorState) {
      _this4.onChange(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  };

  this._handleReturn = function (ev) {
    var editorState = _this4.props.editorState;
    var newEditorState = checkReturnForState(editorState, ev);
    if (editorState !== newEditorState) {
      _this4.onChange(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  };

  this._handleDrop = function (sel, dataTransfer, isInternal) {
    var payload = dataTransfer.data.getData('text');
    // Set timeout to allow cursor/selection to move to drop location before calling back onDrop
    setTimeout(function () {
      var selection = _this4.props.editorState.getSelection();
      var anchorOffset = selection.getEndOffset() - payload.length;
      anchorOffset = anchorOffset < 0 ? 0 : anchorOffset;
      var payloadSel = selection.merge({
        anchorOffset: anchorOffset
      });

      var newContentState = _draftJs.Modifier.replaceText(_this4.props.editorState.getCurrentContent(), payloadSel, ' ');
      var newEditorState = _draftJs.EditorState.createWithContent(newContentState, _this4.createDecorator());
      _this4.onChange(newEditorState);
      if (typeof _this4.props.onDrop === 'function') {
        _this4.props.onDrop(payload, selection);
        setTimeout(function () {
          _this4.forceRender(_this4.props);
        });
      }
    }, 1);
    return false;
  };

  this._handleDragOver = function (event) {
    if (_this4.state.readOnly) {
      _this4.setState({
        readOnly: false
      });
    }
    event.preventDefault();
    if (typeof _this4.props.onDragOver === 'function') {
      _this4.props.onDragOver(event);
    }
    return false;
  };

  this._handlePastedText = function (text, html) {
    setTimeout(function () {
      _this4.feedUndoStack(_this4.state.editorState);
    }, 1);

    if (_this4.props.clipboard || text === _constants.SCHOLAR_DRAFT_CLIPBOARD_CODE) {
      _this4.editor.setClipboard(null);
      return true;
    }
    return false;
  };

  this.findInlineAsset = function (contentBlock, callback, inputContentState) {
    var contentState = inputContentState;
    if (contentState === undefined) {
      if (!_this4.props.editorState) {
        return callback(null);
      }
      contentState = _this4.props.editorState.getCurrentContent();
    }
    contentBlock.findEntityRanges(function (character) {
      var entityKey = character.getEntity();
      return entityKey !== null && contentState.getEntity(entityKey).getType() === _constants.INLINE_ASSET;
    }, function (start, end) {
      var _props = _this4.props,
          assets = _props.assets,
          components = _props.inlineAssetComponents;


      var entityKey = contentBlock.getEntityAt(start);
      var data = contentState.getEntity(entityKey).toJS();
      var id = data && data.data && data.data.asset && data.data.asset.id;
      var asset = assets[id];
      var AssetComponent = asset && components[asset.type] ? components[asset.type] : function () {
        return _react2.default.createElement('div', null);
      };

      var props = {};
      if (id) {
        props = {
          assetId: id,
          AssetComponent: AssetComponent
        };
      }
      callback(start, end, props);
    });
  };

  this.findNotePointer = function (contentBlock, callback, inputContentState) {
    var contentState = inputContentState;
    if (contentState === undefined) {
      if (!_this4.props.editorState) {
        return callback(null);
      }
      contentState = _this4.props.editorState.getCurrentContent();
    }
    contentBlock.findEntityRanges(function (character) {
      var entityKey = character.getEntity();
      return entityKey !== null && contentState.getEntity(entityKey).getType() === _constants.NOTE_POINTER;
    }, function (start, end) {
      var entityKey = contentBlock.getEntityAt(start);
      var data = contentState.getEntity(entityKey).toJS();

      var props = (0, _extends3.default)({}, data.data);
      callback(start, end, props);
    });
  };

  this.findQuotes = function (contentBlock, callback, contentState) {
    var QUOTE_REGEX = /("[^"]+")/gi;
    _this4.findWithRegex(QUOTE_REGEX, contentBlock, callback);
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
    return _draftJs.EditorState.createEmpty(_this4.createDecorator());
  };

  this.createDecorator = function () {
    var ActiveNotePointer = _this4.props.NotePointerComponent || _NotePointer2.default;
    return new _draftJsMultidecorators2.default([new _draftJsSimpledecorator2.default(_this4.findInlineAsset, _InlineAssetContainer2.default), new _draftJsSimpledecorator2.default(_this4.findNotePointer, ActiveNotePointer), new _draftJsSimpledecorator2.default(_this4.findQuotes, _QuoteContainer2.default)].concat((0, _toConsumableArray3.default)((_this4.props.inlineEntities || []).map(function (entity) {
      return new _draftJsSimpledecorator2.default(entity.strategy, entity.component);
    }))));
  };

  this.updateSelection = function () {
    if (!_this4.props.isActive) {
      return;
    }
    var left = void 0;
    var sideToolbarTop = void 0;

    var selectionRange = getSelectionRange();

    var editorEle = _this4.editor;

    var styles = {
      sideToolbar: (0, _extends3.default)({}, _this4.state.styles.sideToolbar),
      inlineToolbar: (0, _extends3.default)({}, _this4.state.styles.inlineToolbar)
    };

    if (!selectionRange) return;

    if (!editorEle || !isParentOf(selectionRange.commonAncestorContainer, editorEle.refs.editor)) {
      return;
    }

    var assetRequestPosition = _this4.props.assetRequestPosition;


    var sideToolbarEle = _this4.sideToolbar.toolbar;

    if (!sideToolbarEle) {
      return;
    }
    var rangeBounds = selectionRange.getBoundingClientRect();

    var selectedBlock = getSelectedBlockElement(selectionRange);
    if (selectedBlock) {
      var blockBounds = selectedBlock.getBoundingClientRect();
      var editorBounds = _this4.state.editorBounds;
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
        var popTop = rangeBounds.top - popoverSpacing;
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

    if ((0, _stringify2.default)(styles) !== (0, _stringify2.default)(_this4.state.styles)) {
      _this4.setState({
        styles: styles
      });
    }
  };

  this.focus = function (event) {

    var stateMods = {};

    var editorNode = _this4.editor && _this4.editor.refs.editor;
    stateMods.editorBounds = editorNode.getBoundingClientRect();

    if ((0, _keys2.default)(stateMods).length) {
      _this4.setState(stateMods);
    }

    setTimeout(function () {
      if (!_this4.state.readOnly) {
        editorNode.focus();
      }
    }, 1);
  };

  this.render = function () {
    // props
    var _props2 = _this4.props,
        _props2$editorState = _props2.editorState,
        editorState = _props2$editorState === undefined ? _this4.generateEmptyEditor() : _props2$editorState,
        _props2$editorClass = _props2.editorClass,
        editorClass = _props2$editorClass === undefined ? 'scholar-draft-BasicEditor' : _props2$editorClass,
        contentId = _props2.contentId,
        _props2$placeholder = _props2.placeholder,
        placeholder = _props2$placeholder === undefined ? 'write your text' : _props2$placeholder,
        _props2$allowNotesIns = _props2.allowNotesInsertion,
        allowNotesInsertion = _props2$allowNotesIns === undefined ? false : _props2$allowNotesIns,
        _props2$allowInlineAs = _props2.allowInlineAsset,
        allowInlineAsset = _props2$allowInlineAs === undefined ? true : _props2$allowInlineAs,
        _props2$allowBlockAss = _props2.allowBlockAsset,
        allowBlockAsset = _props2$allowBlockAss === undefined ? true : _props2$allowBlockAss,
        _props2$messages = _props2.messages,
        messages = _props2$messages === undefined ? {
      tooltips: {
        addNote: 'add a note (shortcut: "cmd + ^")',
        addAsset: 'add an asset (shortcut: "@")',
        cancel: 'cancel'
      }
    } : _props2$messages,
        onAssetRequestUpstream = _props2.onAssetRequest,
        assetRequestPosition = _props2.assetRequestPosition,
        onAssetRequestCancel = _props2.onAssetRequestCancel,
        onAssetChoice = _props2.onAssetChoice,
        editorStyle = _props2.editorStyle,
        onClick = _props2.onClick,
        AssetChoiceComponent = _props2.AssetChoiceComponent,
        assetChoiceProps = _props2.assetChoiceProps,
        BibliographyComponent = _props2.BibliographyComponent,
        isActive = _props2.isActive,
        otherProps = (0, _objectWithoutProperties3.default)(_props2, ['editorState', 'editorClass', 'contentId', 'placeholder', 'allowNotesInsertion', 'allowInlineAsset', 'allowBlockAsset', 'messages', 'onAssetRequest', 'assetRequestPosition', 'onAssetRequestCancel', 'onAssetChoice', 'editorStyle', 'onClick', 'AssetChoiceComponent', 'assetChoiceProps', 'BibliographyComponent', 'isActive']);

    // internal state

    var _state3 = _this4.state,
        readOnly = _state3.readOnly,
        stateEditorState = _state3.editorState,
        styles = _state3.styles;

    // class functions

    var _handleKeyCommand = _this4._handleKeyCommand,
        _handleBeforeInput = _this4._handleBeforeInput,
        _blockRenderer = _this4._blockRenderer,
        _handleReturn = _this4._handleReturn,
        _onTab = _this4._onTab,
        _handleDrop = _this4._handleDrop,
        _handleDragOver = _this4._handleDragOver,
        _handlePastedText = _this4._handlePastedText,
        onChange = _this4.onChange,
        onNoteAdd = _this4.onNoteAdd,
        _defaultKeyBindingFn = _this4._defaultKeyBindingFn;

    /**
     * Functions handling draft editor locking/unlocking
     * and callbacks related to inline asset choices with asset choice component
     */

    // locking draft-js editor when asset choice component is summoned

    var onAssetRequest = function onAssetRequest(selection) {
      if (typeof onAssetRequestUpstream === 'function') {
        onAssetRequestUpstream(selection);
        _this4.setState({
          readOnly: true
        });
      }
    };

    // unlocking draft-js editor when clicked
    var onMainClick = function onMainClick(event) {
      if (typeof onClick === 'function') {
        onClick(event);
      }
      if (_this4.state.readOnly) {
        _this4.setState({
          readOnly: false
        });
      }
      _this4.focus(event);
    };

    // locking draft-js editor when user interacts with asset-choice component
    var onAssetChoiceFocus = function onAssetChoiceFocus() {
      _this4.setState({
        readOnly: true
      });
    };

    // unlocking draft-js editor when asset choice is abandonned
    var onOnAssetRequestCancel = function onOnAssetRequestCancel() {
      onAssetRequestCancel();
      _this4.setState({
        readOnly: false
      });
    };

    // unlocking draft-js editor when asset is choosen
    var onOnAssetChoice = function onOnAssetChoice(asset) {
      onAssetChoice(asset);
      _this4.setState({
        readOnly: false
      });
    };

    /**
     * component bindings and final props definitions
     */

    var realEditorState = editorState || _this4.generateEmptyEditor();

    var bindEditorRef = function bindEditorRef(editor) {
      _this4.editor = editor;
    };
    var bindSideToolbarRef = function bindSideToolbarRef(sideToolbar) {
      _this4.sideToolbar = sideToolbar;
    };

    var bindInlineToolbar = function bindInlineToolbar(inlineToolbar) {
      _this4.inlineToolbar = inlineToolbar;
    };

    // key binding can be provided through props
    var keyBindingFn = typeof _this4.props.keyBindingFn === 'function' ? _this4.props.keyBindingFn : _defaultKeyBindingFn;
    // props-provided iconMap can be merged with defaultIconMap for displaying custom icons
    var iconMap = _this4.props.iconMap ? (0, _extends3.default)({}, _defaultIconMap2.default, _this4.props.iconMap) : _defaultIconMap2.default;

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
        onAssetRequestCancel: onOnAssetRequestCancel,
        onAssetChoice: onOnAssetChoice,
        assetRequestPosition: assetRequestPosition,
        assetChoiceProps: assetChoiceProps,
        onAssetChoiceFocus: onAssetChoiceFocus,

        AssetChoiceComponent: AssetChoiceComponent,
        iconMap: iconMap,

        messages: messages,

        contentId: contentId,

        onNoteAdd: onNoteAdd
      }),
      _react2.default.createElement(_draftJs.Editor, (0, _extends3.default)({
        blockRendererFn: _blockRenderer,
        spellCheck: true,
        readOnly: isActive ? readOnly : true,
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
        onBlur: _this4.onBlur

      }, otherProps)),
      BibliographyComponent && _react2.default.createElement(BibliographyComponent, null)
    );
  };
};

exports.default = BasicEditor;