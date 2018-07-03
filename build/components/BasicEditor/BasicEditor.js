'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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

var _lodash = require('lodash');

var _draftJsSimpledecorator = require('draft-js-simpledecorator');

var _draftJsSimpledecorator2 = _interopRequireDefault(_draftJsSimpledecorator);

var _draftJsMultidecorators = require('draft-js-multidecorators');

var _draftJsMultidecorators2 = _interopRequireDefault(_draftJsMultidecorators);

var _draftJs = require('draft-js');

var _adjustBlockDepth = require('../../modifiers/adjustBlockDepth');

var _adjustBlockDepth2 = _interopRequireDefault(_adjustBlockDepth);

var _constants = require('../../constants');

var _utils = require('../../utils');

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


// constant entities type names


// draft-js EditorState decorators utils
var hasCommandModifier = _draftJs.KeyBindingUtil.hasCommandModifier;

// todo : store that somewhere else
/**
 * This module exports a component representing a single draft editor
 * with related interface and decorators.
 * Asset components must be provided through props
 * @module scholar-draft/BasicEditor
 */

var popoverSpacing = 50;

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
    var _this = (0, _possibleConstructorReturn3.default)(this, (BasicEditor.__proto__ || (0, _getPrototypeOf2.default)(BasicEditor)).call(this, props));

    _initialiseProps.call(_this);

    _this.debouncedUpdateSelection = (0, _lodash.debounce)(_this.updateSelection, 100);
    // undo stack is debounced to improve performance
    _this.feedUndoStack = (0, _lodash.debounce)(_this.feedUndoStack, 1000);
    // it is needed to bind this function right away for being able
    // to initialize the state
    _this.generateEmptyEditor = _this.generateEmptyEditor.bind(_this);

    _this.state = {
      // editor state is initialized with a decorated editorState (notes + assets + ...)
      editorState: _this.generateEmptyEditor(),
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
    _this.emitter = new _utils.Emitter();
    return _this;
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


  /**
   * Component livecycle hooks
   */

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
  customContext: _propTypes2.default.object,
  blockAssetComponents: _propTypes2.default.object,
  assetRequestPosition: _propTypes2.default.object,
  contentId: _propTypes2.default.string,
  isActive: _propTypes2.default.bool,
  isRequestingAssets: _propTypes2.default.bool,
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
  onFocus: _propTypes2.default.func,
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
  AssetButtonComponent: _propTypes2.default.func,
  NoteButtonComponent: _propTypes2.default.func,
  assetChoiceProps: _propTypes2.default.object,
  keyBindingFn: _propTypes2.default.func,
  inlineButtons: _propTypes2.default.array,
  NotePointerComponent: _propTypes2.default.func,
  BibliographyComponent: _propTypes2.default.func,
  inlineEntities: _propTypes2.default.array,
  messages: _propTypes2.default.object,

  renderingMode: _propTypes2.default.string,

  placeholder: _propTypes2.default.string,

  iconMap: _propTypes2.default.object,

  styles: _propTypes2.default.object };
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

  messages: _propTypes2.default.object,

  onFocus: _propTypes2.default.func,

  iconMap: _propTypes2.default.object };

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.getChildContext = function () {
    return {
      emitter: _this2.emitter,
      assets: _this2.props.assets,
      assetChoiceProps: _this2.props.assetChoiceProps,
      iconMap: _this2.props.iconMap,
      messages: _this2.props.messages,

      onAssetMouseOver: _this2.props.onAssetMouseOver,
      onAssetMouseOut: _this2.props.onAssetMouseOut,
      onAssetChange: _this2.props.onAssetChange,
      onAssetFocus: _this2.onAssetFocus,
      onAssetBlur: _this2.onAssetBlur,

      onNotePointerMouseOver: _this2.props.onNotePointerMouseOver,
      onNotePointerMouseOut: _this2.props.onNotePointerMouseOut,
      onNotePointerMouseClick: _this2.props.onNotePointerMouseClick,
      notes: _this2.props.notes
    };
  };

  this.componentDidMount = function () {
    _this2.setState({
      readOnly: false,
      editorState: _this2.props.editorState ? _draftJs.EditorState.createWithContent(_this2.props.editorState.getCurrentContent(), _this2.createDecorator()) : _this2.generateEmptyEditor()
    });
  };

  this.componentWillReceiveProps = function (nextProps, nextState) {
    // console.time(`editor ${this.props.contentId}`);

    var stateMods = {};

    if (_this2.props.isRequestingAssets && !nextProps.isRequestingAssets) {
      // console.log('hiding', this.props.contentId);
      stateMods = (0, _extends3.default)({}, stateMods, {
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
    // hiding the toolbars when editor is set to inactive
    if (_this2.props.isActive && !nextProps.isActive && !nextProps.assetRequestPosition) {
      // locking the draft-editor if asset choice component is not open
      // console.log('hding 2', this.props.contentId);
      stateMods = (0, _extends3.default)({}, stateMods, {
        readOnly: true,
        styles: {
          sideToolbar: {
            display: 'none'
          },
          inlineToolbar: {
            display: 'none'
          }
        }
      });
    } else if (!_this2.props.isActive && nextProps.isActive && !_this2.props.assetRequestPosition) {
      var selection = _this2.state.editorState.getSelection();
      stateMods = (0, _extends3.default)({}, stateMods, {
        readOnly: false
        // editorState: nextProps.editorState ? EditorState.createWithContent(
        //   nextProps.editorState.getCurrentContent(), 
        //   this.createDecorator()
        // ) : this.generateEmptyEditor(),
        // editorState: EditorState.acceptSelection(nextProps.editorState, selection),
      });

      if (_this2.state.lastClickCoordinates) {
        var _state$lastClickCoord = _this2.state.lastClickCoordinates,
            el = _state$lastClickCoord.el,
            pageX = _state$lastClickCoord.pageX,
            pageY = _state$lastClickCoord.pageY;


        stateMods.lastClickCoordinates = undefined;

        var _getEventTextRange = (0, _utils.getEventTextRange)(pageX, pageY),
            offset = _getEventTextRange.offset;

        var element = el;
        var parent = element.parentNode;

        // calculating the block-relative text offset of the selection
        var startOffset = offset;

        while (parent && !(parent.hasAttribute('data-block') && parent.attributes['data-offset-key']) && parent.tagName !== 'BODY') {
          var previousSibling = element.previousSibling;
          while (previousSibling) {
            // not counting inline assets contents and note pointers
            if (previousSibling.className.indexOf('scholar-draft-InlineAssetContainer') === -1) {
              startOffset += previousSibling.textContent.length;
            }
            previousSibling = previousSibling.previousSibling;
          }
          element = parent;
          parent = element.parentNode;
        }
        if (parent && parent.attributes['data-offset-key']) {
          var blockId = parent.attributes['data-offset-key'].value;
          blockId = blockId && blockId.split('-')[0];

          var newSelection = new _draftJs.SelectionState((0, _extends3.default)({}, selection.toJS(), {
            anchorKey: blockId,
            focusKey: blockId,
            anchorOffset: startOffset,
            focusOffset: startOffset
          }));
          var selectedEditorState = _draftJs.EditorState.acceptSelection(_this2.state.editorState, newSelection);
          stateMods = (0, _extends3.default)({}, stateMods, {
            editorState: selectedEditorState || _this2.generateEmptyEditor()
          });

          setTimeout(function () {
            _this2.onChange(selectedEditorState, false);
            _this2.forceRender((0, _extends3.default)({}, _this2.props, { editorState: selectedEditorState }));
          });
        }
      } else {
        stateMods.editorState = nextProps.editorState ? _draftJs.EditorState.createWithContent(nextProps.editorState.getCurrentContent(), _this2.createDecorator()) : _this2.generateEmptyEditor();
        setTimeout(function () {
          return _this2.forceRender(_this2.props);
        });
      }

      // updating locally stored editorState when the one given by props
      // has changed
    } else if (_this2.props.editorState !== nextProps.editorState) {
      // console.log('storing new editor state with selection', 
      // nextProps.editorState && nextProps.editorState.getSelection().getStartOffset())
      stateMods = (0, _extends3.default)({}, stateMods, {
        editorState: nextProps.editorState || _this2.generateEmptyEditor()
      });
    }

    // updating rendering mode
    if (_this2.props.customContext !== nextProps.customContext) {
      _this2.emitter.dispatchCustomContext(nextProps.customContext);
    }

    // updating rendering mode
    if (_this2.props.renderingMode !== nextProps.renderingMode) {
      _this2.emitter.dispatchRenderingMode(nextProps.renderingMode);
    }

    // trigger changes when assets are changed
    if (_this2.props.assets !== nextProps.assets) {
      // dispatch new assets through context's emitter
      _this2.emitter.dispatchAssets(nextProps.assets);
      // update state-stored assets
      // this.setState({ assets: nextProps.assets });/* eslint react/no-unused-state : 0 */
      // if the number of assets is changed it means
      // new entities might be present in the editor.
      // As, for optimizations reasons, draft-js editor does not update
      // its entity map in this case (did not exactly understand why)
      // it has to be forced to re-render itself
      if (!_this2.props.assets || !nextProps.assets || (0, _keys2.default)(_this2.props.assets).length !== (0, _keys2.default)(nextProps.assets).length) {
        // re-rendering after a timeout.
        // not doing that causes the draft editor not to update
        // before a new modification is applied to it
        // this is weird but it works
        setTimeout(function () {
          return _this2.forceRender(nextProps);
        });
      }
    }
    // trigger changes when notes are changed
    if (_this2.props.notes !== nextProps.notes) {
      // dispatch new notes through context's emitter
      _this2.emitter.dispatchNotes(nextProps.notes);
      // update state-stored notes
      stateMods = (0, _extends3.default)({}, stateMods, {
        notes: nextProps.notes
      }); /* eslint react/no-unused-state : 0 */
      // if the number of notes is changed it means
      // new entities might be present in the editor.
      // As, for optimizations reasons, draft-js editor does not update
      // its entity map in this case (did not exactly understand why)
      // it has to be forced to re-render itself
      if (!_this2.props.notes || !nextProps.notes || (0, _keys2.default)(_this2.props.notes).length !== (0, _keys2.default)(nextProps.notes).length) {
        // re-rendering after a timeout.
        // not doing that causes the draft editor not to update
        // before a new modification is applied to it
        setTimeout(function () {
          return _this2.forceRender(nextProps);
        });
      }
    }
    // trigger changes when notes are changed
    if (_this2.props.assetChoiceProps !== nextProps.assetChoiceProps) {
      // dispatch new notes through context's emitter
      _this2.emitter.dispatchAssetChoiceProps(nextProps.assetChoiceProps);
    }
    // apply state changes
    if ((0, _keys2.default)(stateMods).length > 0) {
      // console.log('update', nextProps.contentId);
      _this2.setState(stateMods);
    }
    // console.timeEnd(`editor ${this.props.contentId} receives props`);
  };

  this.shouldComponentUpdate = function (nextProps, nextState) {
    if (_this2.state.readOnly !== nextState.readOnly || _this2.props.isActive !== nextProps.isActive || _this2.state.styles !== nextState.styles || _this2.state.editorState !== nextProps.editorState || _this2.props.editorState !== nextProps.editorState || _this2.props.assetRequestPosition !== nextProps.assetRequestPosition) {
      return true;
    }
    return false;
  };

  this.componentWillUpdate = function () {
    // console.time(`rendering ${this.props.contentId}`)
  };

  this.componentDidUpdate = function (prevProps, prevState) {
    _this2.updateSelection();
    // console.timeEnd(`rendering ${this.props.contentId}`)
    if (
    /* (
    this.props.editorState !== prevProps.editorState && 
    this.editor &&
    !this.state.readOnly && 
    // this.props.isActive &&
    prevState.readOnly
    )
    ||
    */
    prevState.readOnly && !_this2.state.readOnly) {
      // draft triggers an unwanted onChange event when focusing
      _this2.setState({
        isFocusing: true
      });
      setTimeout(function () {
        if (_this2 && _this2.editor) {
          _this2.editor.focus();
          setTimeout(function () {
            return _this2.setState({
              isFocusing: false
            });
          });
        }
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

  this.onAssetBlur = function (event) {
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

    // calls onBlur callbacks if provided
    var onBlur = _this2.props.onBlur;

    if (typeof onBlur === 'function') {
      onBlur(event);
    }
  };

  this.onFocus = function (event) {
    event.stopPropagation();

    // calls onBlur callbacks if provided
    var onFocus = _this2.props.onFocus;


    if (typeof onFocus === 'function') {
      onFocus(event);
    }
  };

  this.onChange = function (editorState) {
    var feedUndoStack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    // console.log(this.props.contentId, 
    // ' on change', editorState.getSelection().getStartOffset(), 
    // 'is focusing', this.state.isFocusing)
    if (typeof _this2.props.onEditorChange === 'function' && !_this2.state.readOnly && !_this2.state.isFocusing) {
      if (feedUndoStack === true) {
        _this2.feedUndoStack(editorState);
      }
      _this2.props.onEditorChange(editorState);
    }
  };

  this.feedUndoStack = function (editorState) {
    var undoStack = _this2.state.undoStack;
    // max length for undo stack
    // todo: store that in props or in a variable

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
      _this2.onChange(newUndoStack[newUndoStack.length - 1], false);
      // draft-js won't notice the change of editorState
      // so we have to force it to re-render after having received
      // the new editorStaten
      setTimeout(function () {
        return _this2.forceRender(_this2.props);
      });
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
    var editorState = props.editorState || _this2.state.editorState || _this2.generateEmptyEditor();
    var content = editorState.getCurrentContent();
    var newEditorState = _draftJs.EditorState.createWithContent(content, _this2.createDecorator());
    var selectedEditorState = _draftJs.EditorState.forceSelection(newEditorState, editorState.getSelection());
    var inlineStyle = _this2.state.editorState.getCurrentInlineStyle();
    selectedEditorState = _draftJs.EditorState.setInlineStyleOverride(selectedEditorState, inlineStyle);
    // console.log('force editor state', selectedEditorState.getSelection().getStartOffset())
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
      var id = data && data.data && data.data.asset && data.data.asset.id;
      var asset = _this2.props.assets[id];
      if (!asset) {
        return;
      }
      var _props = _this2.props,
          blockAssetComponents = _props.blockAssetComponents,
          renderingMode = _props.renderingMode;

      var AssetComponent = blockAssetComponents[asset.type] || _react2.default.createElement('div', null);

      if (asset) {
        return { /* eslint consistent-return:0 */
          component: _BlockAssetContainer2.default,
          editable: false,
          props: {
            renderingMode: renderingMode,
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
        // `m`
        case 77:
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

  this._handleBeforeInput = function (character) {
    // todo : make that feature more subtle and customizable through props
    if (character === '@') {
      _this2.props.onAssetRequest();
      return 'handled';
    }
    if (character !== ' ') {
      return 'not-handled';
    }
    var editorState = _this2.props.editorState;

    var newEditorState = (0, _utils.checkCharacterForState)(editorState, character);
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

    var newEditorState = (0, _utils.checkReturnForState)(editorState, ev);
    if (editorState !== newEditorState) {
      _this2.onChange(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  };

  this._handleDrop = function (sel, dataTransfer, isInternal) {
    var payload = dataTransfer.data.getData('text');
    // Set timeout to allow cursor/selection to move to drop location before calling back onDrop
    setTimeout(function () {
      var selection = _this2.props.editorState.getSelection();
      var anchorOffset = selection.getEndOffset() - payload.length;
      anchorOffset = anchorOffset < 0 ? 0 : anchorOffset;
      var payloadSel = selection.merge({
        anchorOffset: anchorOffset
      });

      var newContentState = _draftJs.Modifier.replaceText(_this2.props.editorState.getCurrentContent(), payloadSel, ' ');
      var newEditorState = _draftJs.EditorState.createWithContent(newContentState, _this2.createDecorator());
      _this2.onChange(newEditorState);
      if (typeof _this2.props.onDrop === 'function') {
        _this2.props.onDrop(payload, selection);
        setTimeout(function () {
          _this2.forceRender(_this2.props);
        });
      }
    }, 1);
    return false;
  };

  this._handleDragOver = function (event) {
    if (_this2.state.readOnly) {
      _this2.setState({
        readOnly: false
      });
    }
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

    if (_this2.props.clipboard || text === _constants.SCHOLAR_DRAFT_CLIPBOARD_CODE) {
      _this2.editor.setClipboard(null);
      return true;
    }
    return false;
  };

  this.findInlineAsset = function (contentBlock, callback, inputContentState) {
    var contentState = inputContentState;
    if (contentState === undefined) {
      if (!_this2.props.editorState) {
        return callback(null);
      }
      contentState = _this2.props.editorState.getCurrentContent();
    }
    contentBlock.findEntityRanges(function (character) {
      var entityKey = character.getEntity();
      return entityKey !== null && contentState.getEntity(entityKey).getType() === _constants.INLINE_ASSET;
    }, function (start, end) {
      var _props2 = _this2.props,
          assets = _props2.assets,
          renderingMode = _props2.renderingMode,
          components = _props2.inlineAssetComponents;


      var entityKey = contentBlock.getEntityAt(start);
      var data = contentState.getEntity(entityKey).toJS();
      var id = data && data.data && data.data.asset && data.data.asset.id;
      var asset = assets[id];
      var AssetComponent = asset && components[asset.type] ? components[asset.type] : function () {
        return _react2.default.createElement('span', null);
      };

      var props = {};
      if (id) {
        props = {
          assetId: id,
          renderingMode: renderingMode,
          AssetComponent: AssetComponent
        };
      }
      callback(start, end, props);
    });
  };

  this.findNotePointer = function (contentBlock, callback, inputContentState) {
    var contentState = inputContentState;
    if (contentState === undefined) {
      if (!_this2.props.editorState) {
        return callback(null);
      }
      contentState = _this2.props.editorState.getCurrentContent();
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
    return new _draftJsMultidecorators2.default([new _draftJsSimpledecorator2.default(_this2.findInlineAsset, _InlineAssetContainer2.default), new _draftJsSimpledecorator2.default(_this2.findNotePointer, ActiveNotePointer), new _draftJsSimpledecorator2.default(_this2.findQuotes, _QuoteContainer2.default)].concat((0, _toConsumableArray3.default)((_this2.props.inlineEntities || []).map(function (entity) {
      return new _draftJsSimpledecorator2.default(entity.strategy, entity.component);
    }))));
  };

  this.updateSelection = function () {
    if (!(_this2.props.isRequestingAssets || _this2.props.isActive) && _this2.state.styles.sideToolbar.display !== 'none') {
      _this2.setState({
        styles: {
          sideToolbar: { display: 'none' },
          inlineToolbar: { display: 'none' }
        }
      });
      return;
    }
    var left = void 0;
    var sideToolbarTop = void 0;

    var selectionRange = (0, _utils.getSelectionRange)();

    var editorEle = _this2.editor;

    var styles = {
      sideToolbar: (0, _extends3.default)({}, _this2.state.styles.sideToolbar),
      inlineToolbar: (0, _extends3.default)({}, _this2.state.styles.inlineToolbar)
    };

    if (!selectionRange) return;

    if (!editorEle || !(0, _utils.isParentOf)(selectionRange.commonAncestorContainer, editorEle.editor)) {
      return;
    }

    var assetRequestPosition = _this2.props.assetRequestPosition;


    var sideToolbarEle = _this2.sideToolbar.toolbar;
    var inlineToolbarEle = _this2.inlineToolbar.toolbar;

    if (!sideToolbarEle) {
      return;
    }

    var rangeBounds = selectionRange.getBoundingClientRect();

    var selectedBlock = (0, _utils.getSelectedBlockElement)(selectionRange);
    if (selectedBlock && _this2.props.isActive) {
      var blockBounds = selectedBlock.getBoundingClientRect();
      var editorNode = _this2.editor && _this2.editor.editor;
      var editorBounds = editorNode.getBoundingClientRect();
      // const { editorBounds } = this.state;
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
        var inlineToolbarWidth = inlineToolbarEle.offsetWidth || 200;

        styles.inlineToolbar.position = 'fixed';
        styles.inlineToolbar.display = 'block';
        var startNode = selectionRange.startContainer;
        while (startNode.nodeType === 3) {
          startNode = startNode.parentNode;
        }
        var popTop = rangeBounds.top - popoverSpacing;
        left = rangeBounds.left - inlineToolbarWidth / 2; /* eslint prefer-destructuring:0 */
        // prevent inline toolbar collapse
        // left = left + inlineToolbarWidth / 2  > 
        // editorBounds.right ? editorBounds.right - inlineToolbarWidth : left;
        if (left + inlineToolbarWidth * 1.2 < editorBounds.right) {
          styles.inlineToolbar.left = left;
          styles.inlineToolbar.right = 'unset';
        } else {
          styles.inlineToolbar.right = 0;
          styles.inlineToolbar.left = 'unset';
        }
        styles.inlineToolbar.top = popTop;
      } else {
        styles.inlineToolbar.display = 'none';
      }
    } else if (!_this2.props.isRequestingAssets) {
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

    setTimeout(function () {
      if (!_this2.state.readOnly) {
        _this2.editor.focus();
      }
    });
  };

  this.render = function () {
    // props
    var _props3 = _this2.props,
        _props3$editorState = _props3.editorState,
        editorState = _props3$editorState === undefined ? _this2.generateEmptyEditor() : _props3$editorState,
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
        onAssetRequestUpstream = _props3.onAssetRequest,
        assetRequestPosition = _props3.assetRequestPosition,
        onAssetRequestCancel = _props3.onAssetRequestCancel,
        onAssetChoice = _props3.onAssetChoice,
        editorStyle = _props3.editorStyle,
        onClick = _props3.onClick,
        AssetChoiceComponent = _props3.AssetChoiceComponent,
        assetChoiceProps = _props3.assetChoiceProps,
        AssetButtonComponent = _props3.AssetButtonComponent,
        NoteButtonComponent = _props3.NoteButtonComponent,
        BibliographyComponent = _props3.BibliographyComponent,
        isActive = _props3.isActive,
        inlineButtons = _props3.inlineButtons,
        otherProps = (0, _objectWithoutProperties3.default)(_props3, ['editorState', 'editorClass', 'contentId', 'placeholder', 'allowNotesInsertion', 'allowInlineAsset', 'allowBlockAsset', 'onAssetRequest', 'assetRequestPosition', 'onAssetRequestCancel', 'onAssetChoice', 'editorStyle', 'onClick', 'AssetChoiceComponent', 'assetChoiceProps', 'AssetButtonComponent', 'NoteButtonComponent', 'BibliographyComponent', 'isActive', 'inlineButtons']);


    var messages = {
      addNote: _this2.props.messages && _this2.props.messages.addNote ? _this2.props.messages.addNote : 'add a note (shortcut: "cmd + m")',
      summonAsset: _this2.props.messages && _this2.props.messages.summonAsset ? _this2.props.messages.summonAsset : 'add an asset (shortcut: "@")',
      cancel: _this2.props.messages && _this2.props.messages.cancel ? _this2.props.messages.cancel : 'cancel'
    };

    // internal state
    var _state3 = _this2.state,
        readOnly = _state3.readOnly,
        stateEditorState = _state3.editorState,
        styles = _state3.styles;

    // class functions

    var _handleKeyCommand = _this2._handleKeyCommand,
        _handleBeforeInput = _this2._handleBeforeInput,
        _blockRenderer = _this2._blockRenderer,
        _handleReturn = _this2._handleReturn,
        _onTab = _this2._onTab,
        _handleDrop = _this2._handleDrop,
        _handleDragOver = _this2._handleDragOver,
        _handlePastedText = _this2._handlePastedText,
        onChange = _this2.onChange,
        onNoteAdd = _this2.onNoteAdd,
        _defaultKeyBindingFn = _this2._defaultKeyBindingFn;

    // console.time(`preparing rendering ${contentId}`)


    /**
     * Functions handling draft editor locking/unlocking
     * and callbacks related to inline asset choices with asset choice component
     */

    // locking draft-js editor when asset choice component is summoned

    var onAssetRequest = function onAssetRequest(selection) {
      if (typeof onAssetRequestUpstream === 'function') {
        onAssetRequestUpstream(selection);
        _this2.setState({
          readOnly: true
        });
      }
    };

    // unlocking draft-js editor when clicked
    var onMainClick = function onMainClick(event) {
      event.stopPropagation();
      var stateMods = {};
      if (typeof onClick === 'function') {
        onClick(event);
      }
      if (_this2.state.readOnly) {
        var coordinates = {
          clientX: event.clientX,
          clientY: event.clientY,
          el: event.target,
          pageX: event.pageX,
          pageY: event.pageY
        };
        stateMods.lastClickCoordinates = coordinates;
      }
      if (_this2.props.isActive && _this2.state.readOnly) {
        stateMods.readOnly = false;
      }
      if ((0, _keys2.default)(stateMods).length > 0) {
        _this2.setState(stateMods);
      }
      // this.focus(event);
    };

    // locking draft-js editor when user interacts with asset-choice component
    var onAssetChoiceFocus = function onAssetChoiceFocus() {
      _this2.setState({
        readOnly: true
      });
    };

    // unlocking draft-js editor when asset choice is abandonned
    var onOnAssetRequestCancel = function onOnAssetRequestCancel() {
      onAssetRequestCancel();

      _this2.forceRender(_this2.props);

      _this2.setState({
        readOnly: false
      });
    };

    // unlocking draft-js editor when asset is choosen
    var onOnAssetChoice = function onOnAssetChoice(asset) {
      onAssetChoice(asset);
      // this.setState({
      //   readOnly: false
      // });
    };

    /**
     * component bindings and final props definitions
     */

    var realEditorState = editorState || _this2.generateEmptyEditor(); /* eslint no-unused-vars : 0 */

    var bindEditorRef = function bindEditorRef(editor) {
      _this2.editor = editor;
    };
    var bindSideToolbarRef = function bindSideToolbarRef(sideToolbar) {
      _this2.sideToolbar = sideToolbar;
    };

    var bindInlineToolbar = function bindInlineToolbar(inlineToolbar) {
      _this2.inlineToolbar = inlineToolbar;
    };

    // key binding can be provided through props
    var keyBindingFn = typeof _this2.props.keyBindingFn === 'function' ? _this2.props.keyBindingFn : _defaultKeyBindingFn;
    // props-provided iconMap can be merged with defaultIconMap for displaying custom icons
    var iconMap = _this2.props.iconMap ? (0, _extends3.default)({}, _defaultIconMap2.default, _this2.props.iconMap) : _defaultIconMap2.default;

    // console.timeEnd(`preparing rendering ${contentId}`)
    // console.log(this.props.contentId, 
    // 'render with selection', stateEditorState.getSelection().getStartOffset());
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
        buttons: inlineButtons,
        editorState: stateEditorState,
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
        AssetButtonComponent: AssetButtonComponent,
        NoteButtonComponent: NoteButtonComponent,
        iconMap: iconMap,

        messages: messages,

        contentId: contentId,

        onNoteAdd: onNoteAdd
      }),
      _react2.default.createElement(_draftJs.Editor, (0, _extends3.default)({
        editorState: stateEditorState,
        onChange: onChange,

        blockRendererFn: _blockRenderer,
        spellCheck: true,
        readOnly: isActive ? readOnly : true,
        placeholder: placeholder,

        keyBindingFn: keyBindingFn,

        handlePastedText: _handlePastedText,
        handleKeyCommand: _handleKeyCommand,
        handleBeforeInput: _handleBeforeInput,
        handleReturn: _handleReturn,
        onFocus: _this2.onFocus,
        onBlur: _this2.onBlur,
        onTab: _onTab,

        handleDrop: _handleDrop,

        ref: bindEditorRef

      }, otherProps)),
      BibliographyComponent && _react2.default.createElement(BibliographyComponent, null)
    );
  };
};

exports.default = BasicEditor;
module.exports = exports['default'];