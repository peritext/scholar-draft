'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _getUnboundedScrollPosition = require('fbjs/lib/getUnboundedScrollPosition.js');

var _getUnboundedScrollPosition2 = _interopRequireDefault(_getUnboundedScrollPosition);

var _Style = require('fbjs/lib/Style.js');

var _Style2 = _interopRequireDefault(_Style);

var _immutable = require('immutable');

var _SideToolbar = require('./components/SideToolbar');

var _SideToolbar2 = _interopRequireDefault(_SideToolbar);

var _PopoverControl = require('./components/PopoverControl/PopoverControl');

var _PopoverControl2 = _interopRequireDefault(_PopoverControl);

var _InlinePointer = require('./components/InlinePointer/InlinePointer');

var _InlinePointer2 = _interopRequireDefault(_InlinePointer);

var _NotePointer = require('./components/NotePointer/NotePointer');

var _NotePointer2 = _interopRequireDefault(_NotePointer);

var _draftJsSimpledecorator = require('draft-js-simpledecorator');

var _draftJsSimpledecorator2 = _interopRequireDefault(_draftJsSimpledecorator);

require('./ContentEditor.scss');

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getSelectedBlockElement = function getSelectedBlockElement(range) {
  var node = range.startContainer;
  do {
    if (node.getAttribute && node.getAttribute('data-block') == 'true') {
      return node;
    }
    node = node.parentNode;
  } while (node != null);
  return null;
  /* const currentContent = this.props.editorState.getCurrentContent()
  const selection = this.props.editorState.getSelection()
  return currentContent.getBlockForKey(selection.getStartKey())*/
};

var getSelectionRange = function getSelectionRange() {
  var selection = window.getSelection();
  if (selection.rangeCount == 0) return null;
  return selection.getRangeAt(0);
};

var isParentOf = function isParentOf(ele, maybeParent) {

  while (ele.parentNode != null && ele.parentNode != document.body) {
    if (ele.parentNode == maybeParent) return true;
    ele = ele.parentNode;
  }
  return false;
};

var styles = {
  // editorContainer: {
  //   position: 'relative',
  //   // paddingLeft: 48,
  // },
  // popOverControl: {
  //   // width: 78, // Height and width are needed to compute the position
  //   // height: 24,
  //   display: 'none', 
  //   position: 'absolute',
  //   zIndex: 999,
  // },
  // sideControl: {
  //   height: 24, // Required to figure out positioning
  //   // width: 48, // Needed to figure out how much to offset the sideControl left
  //   left: -92,
  //   right: '100%',
  //   display: 'none',
  //   textAlign: 'right',
  // }
};

var popoverSpacing = 3; // The distance above the selection that popover 


var ContentEditor = function (_Component) {
  _inherits(ContentEditor, _Component);

  function ContentEditor(props) {
    _classCallCheck(this, ContentEditor);

    var _this = _possibleConstructorReturn(this, (ContentEditor.__proto__ || Object.getPrototypeOf(ContentEditor)).call(this, props));

    _initialiseProps.call(_this);

    return _this;
  }

  // componentDidUpdate = () => this.updateSelection();

  /*{
    strategy: this.findInlineContextualizations,
    component: InlinePointer
  }*/
  // ,
  // {
  //   strategy: this.findNotePointers,
  //   component: NotePointer
  // }
  // ])

  _createClass(ContentEditor, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      this.updateSelection();
      // force render of inline and atomic block elements
      var forceRender = this.forceRender;

      if (this.props.editorState !== prevProps.editorState || prevProps.contextualizers !== this.props.contextualizers || prevProps.contextualizations !== this.props.contextualizations || prevProps.resources !== this.props.resources || prevProps.readOnly !== this.props.readOnly) {
        forceRender(this.props);
      }

      // force focus if last insertion type is inline
      if (this.props.editorState !== prevProps.editorState && this.editor && this.props.lastInsertionType === 'inlineContextualization') {
        this.editor.focus();
      }
    }
  }]);

  return ContentEditor;
}(_react.Component);

ContentEditor.propTypes = {
  /*
   * State-related props
   */
  editorState: _propTypes2.default.object,
  contextualizations: _propTypes2.default.object,
  resources: _propTypes2.default.object,
  contextualizers: _propTypes2.default.object,
  inlineContextualizationComponents: _propTypes2.default.object,
  blockContextualizationComponents: _propTypes2.default.object,
  /*
   * Method props
   */
  onEditorChange: _propTypes2.default.func,
  onNotesOrderChange: _propTypes2.default.func,
  onContextualizationRequest: _propTypes2.default.func,
  onAddNote: _propTypes2.default.func,
  onContextualizationClick: _propTypes2.default.func,
  onContextualizationMouseOver: _propTypes2.default.func,
  onContextualizationMouseOut: _propTypes2.default.func,
  /*
   * Parametrization props
   */
  editorClass: _propTypes2.default.string,
  editorStyles: _propTypes2.default.object,
  allowFootnotesInsertion: _propTypes2.default.bool,
  allowInlineContextualizationInsertion: _propTypes2.default.bool,
  allowBlockContextualizationInsertion: _propTypes2.default.bool
};
ContentEditor.defaultProps = {
  blockContextualizationComponents: {},
  iconColor: '#000000',
  iconSelectedColor: '#2000FF'
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this,
      _arguments = arguments;

  this.focus = function () {
    if (_this2.props.readOnly) return;

    var editorNode = _this2.editor.refs.editor;
    var editorBounds = editorNode.getBoundingClientRect();
    _this2.setState({
      editorBounds: editorBounds
    });

    var scrollParent = _Style2.default.getScrollParent(editorNode);
    // console.log(`focus called: ${require('util').inspect(getUnboundedScrollPosition(scrollParent))}`)
    editorNode.focus((0, _getUnboundedScrollPosition2.default)(scrollParent));
    // this.refs.editor.focus();
  };

  this.updateSelection = function () {

    var selectionRangeIsCollapsed = null;
    var sideControlVisible = false;
    var sideControlTop = null;
    var sideControlLeft = -92; // styles.sideControl.left;
    var popoverControlVisible = false;
    var popoverControlTop = null;
    var popoverControlLeft = null;

    var selectionRange = getSelectionRange();
    if (!selectionRange) return;

    var editorEle = _this2.editor;
    if (!isParentOf(selectionRange.commonAncestorContainer, editorEle.refs.editor)) {
      return;
    }

    var popoverControlEle = _this2.inlineToolbar.toolbar;
    var sideControlEle = _this2.sideToolbar.toolbar;

    var rangeBounds = selectionRange.getBoundingClientRect();
    var selectedBlock = getSelectedBlockElement(selectionRange);
    if (selectedBlock) {
      var blockBounds = selectedBlock.getBoundingClientRect();
      sideControlVisible = true;
      // sideControlTop = this.state.selectedBlock.offsetTop
      var editorBounds = _this2.state.editorBounds;
      if (!editorBounds) return;
      sideControlTop = blockBounds.top - editorBounds.top + (blockBounds.bottom - blockBounds.top) / 2 + 24 /*styles.sideControl.height*/ / 2;

      // sideControlEle.style.left = `${sideControlLeft}px`;
      sideControlEle.style.top = sideControlTop + 'px';
      sideControlEle.style.display = 'block';

      if (!selectionRange.collapsed) {
        // The control needs to be visible so that we can get it's width
        popoverControlEle.style.display = 'block';
        var popoverWidth = popoverControlEle.clientWidth;

        popoverControlVisible = true;
        var rangeWidth = rangeBounds.right - rangeBounds.left,
            rangeHeight = rangeBounds.bottom - rangeBounds.top;
        popoverControlTop = rangeBounds.top - editorBounds.top - styles.popOverControl.height - popoverSpacing;
        popoverControlLeft = 0 + (rangeBounds.left - editorBounds.left) + rangeWidth / 2 - /* styles.popOverControl.width*/popoverWidth / 2;

        // console.log(popoverControlEle)
        // console.log(popoverControlEle.style)
        popoverControlEle.style.left = popoverControlLeft + 'px';
        popoverControlEle.style.top = popoverControlTop + 'px';
      } else {
        popoverControlEle.style.display = 'none';
      }
    } else {
      sideControlEle.style.display = 'none';
      popoverControlEle.style.display = 'none';
    }
  };

  this.findInlineContextualizations = function (contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(function (character) {
      var entityKey = character.getEntity();
      return entityKey !== null && contentState.getEntity(entityKey).getType() === 'inlineContextualization';
    }, function (start, end) {
      var _props = _this2.props,
          resources = _props.resources,
          contextualizers = _props.contextualizers,
          contextualizations = _props.contextualizations,
          onContextualizationMouseOver = _props.onContextualizationMouseOver,
          onContextualizationMouseOut = _props.onContextualizationMouseOut,
          onDataChange = _props.onDataChange;
      var onInputFocus = _this2.onInputFocus,
          onInputBlur = _this2.onInputBlur;


      var entityKey = contentBlock.getEntityAt(start);
      var data = _this2.state.editorState.getCurrentContent().getEntity(entityKey).toJS();

      var id = data.data.contextualization.id;
      var contextualization = contextualizations[id];
      var props = {};
      if (contextualization) {
        props = _extends({}, data, {
          resource: resources[contextualization.resourceId],
          contextualizer: contextualizers[contextualization.contextualizerId],
          resourceId: contextualization.resourceId,
          contextualizerId: contextualization.contextualizerId,
          onContextualizationMouseOver: onContextualizationMouseOver,
          onContextualizationMouseOut: onContextualizationMouseOut,
          onDataChange: onDataChange,
          onInputFocus: onInputFocus,
          onInputBlur: onInputBlur
        });
      }
      callback(start, end, props);
    });
  };

  this.findNotePointers = function (contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(function (character) {
      var entityKey = character.getEntity();
      return entityKey !== null && contentState.getEntity(entityKey).getType() === 'note-pointer';
    }, callback);
  };

  this.createDecorator = function () {
    // new SimpleDecorator(this.findInlineContextualizations, InlinePointer)
    // new CompositeDecorator([
    return new _draftJsSimpledecorator2.default(_this2.findInlineContextualizations, _InlinePointer2.default);
  };

  this.forceRender = function (props) {
    var editorState = props.editorState || _this2.generateEmptyEditor();
    var content = editorState.getCurrentContent();
    var contextualizers = props.contextualizers;
    // console.log('force render', contextualizers[Object.keys(contextualizers)[0]].pages);

    var newEditorState = _draftJs.EditorState.createWithContent(content, _this2.createDecorator());
    var selectedEditorState = _draftJs.EditorState.acceptSelection(newEditorState, editorState.getSelection());
    _this2.setState({ editorState: selectedEditorState });
  };

  this.generateEmptyEditor = function () {
    return _draftJs.EditorState.createEmpty(_this2.createDecorator());
  };

  this.state = {
    editorState: this.generateEmptyEditor()
  };

  this.onInputFocus = function () {
    _this2.setState({
      readOnly: true
    });
  };

  this.onInputBlur = function () {
    _this2.setState({
      readOnly: false
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
      } catch (e) {
        return;
      }
      var blockContextualizationComponents = _this2.props.blockContextualizationComponents;

      var component = blockContextualizationComponents[data.type];

      var _props2 = _this2.props,
          resources = _props2.resources,
          contextualizers = _props2.contextualizers,
          contextualizations = _props2.contextualizations,
          onDataChange = _props2.onDataChange,
          onContextualizationMouseOver = _props2.onContextualizationMouseOver,
          onContextualizationMouseOut = _props2.onContextualizationMouseOut;
      var onInputFocus = _this2.onInputFocus,
          onInputBlur = _this2.onInputBlur;


      var id = data.data.contextualization.id;
      var contextualization = contextualizations[id];
      if (contextualization) {
        return {
          component: component,
          editable: false,
          props: _extends({}, data, {
            resource: resources[contextualization.resourceId],
            contextualizer: contextualizers[contextualization.contextualizerId],
            resourceId: contextualization.resourceId,
            contextualizerId: contextualization.contextualizerId,
            onDataChange: onDataChange,
            onInputFocus: onInputFocus,
            onInputBlur: onInputBlur,
            onContextualizationMouseOver: onContextualizationMouseOver,
            onContextualizationMouseOut: onContextualizationMouseOut
          })
        };
      }
    }
  };

  this.onBlur = function () {

    // this.inlineBar.style.display = 'none';
    // this.sideBar.style.display = 'none';

    var onBlur = _this2.props.onBlur;

    if (onBlur) {
      onBlur.apply(_this2, _arguments);
    }

    // const popoverControlEle = ReactDOM.findDOMNode(this.refs.popoverControl);
    // const sideControlEle = ReactDOM.findDOMNode(this.refs.sideControl);
    // popoverControlEle.style.display = 'none';
    // sideControlEle.style.display = 'none';
    // const { onBlur } = this.props;
    // if (onBlur) { onBlur.apply(this, arguments); }
  };

  this._handleKeyCommand = function (command) {
    var editorState = _this2.props.editorState;

    var newState = _draftJs.RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      console.log('applying new state');
      _this2._onChange(newState);
      return true;
    }
    return false;
  };

  this._onChange = function (editorState) {
    _this2.props.onEditorChange(editorState);
  };

  this.render = function () {
    var _props3 = _this2.props,
        editorState = _props3.editorState,
        _props3$editorClass = _props3.editorClass,
        editorClass = _props3$editorClass === undefined ? '' : _props3$editorClass,
        _props3$editorStyles = _props3.editorStyles,
        editorStyles = _props3$editorStyles === undefined ? {} : _props3$editorStyles,
        _props3$placeholder = _props3.placeholder,
        placeholder = _props3$placeholder === undefined ? 'write your text' : _props3$placeholder,
        contextualizations = _props3.contextualizations,
        contextualizers = _props3.contextualizers,
        resources = _props3.resources,
        _props3$allowNotesIns = _props3.allowNotesInsertion,
        allowNotesInsertion = _props3$allowNotesIns === undefined ? false : _props3$allowNotesIns,
        _props3$allowInlineCo = _props3.allowInlineContextualization,
        allowInlineContextualization = _props3$allowInlineCo === undefined ? true : _props3$allowInlineCo,
        _props3$allowBlockCon = _props3.allowBlockContextualization,
        allowBlockContextualization = _props3$allowBlockCon === undefined ? true : _props3$allowBlockCon,
        blockContextualizationComponents = _props3.blockContextualizationComponents,
        blockButtons = _props3.blockButtons,
        inlineButtons = _props3.inlineButtons,
        onContextualizationRequest = _props3.onContextualizationRequest,
        onContextualizationClick = _props3.onContextualizationClick,
        onContextualizationMouseOver = _props3.onContextualizationMouseOver,
        onContextualizationMouseOut = _props3.onContextualizationMouseOut,
        onNoteAdd = _props3.onNoteAdd,
        iconColor = _props3.iconColor,
        iconSelectedColor = _props3.iconSelectedColor,
        popOverStyle = _props3.popOverStyle,
        otherProps = _objectWithoutProperties(_props3, ['editorState', 'editorClass', 'editorStyles', 'placeholder', 'contextualizations', 'contextualizers', 'resources', 'allowNotesInsertion', 'allowInlineContextualization', 'allowBlockContextualization', 'blockContextualizationComponents', 'blockButtons', 'inlineButtons', 'onContextualizationRequest', 'onContextualizationClick', 'onContextualizationMouseOver', 'onContextualizationMouseOut', 'onNoteAdd', 'iconColor', 'iconSelectedColor', 'popOverStyle']);

    var readOnly = _this2.state.readOnly;


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

    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'div',
        {
          className: 'ContentEditor',
          onClick: _this2.focus
        },
        _react2.default.createElement(_PopoverControl2.default, {
          ref: bindInlineToolbar,
          editorState: realEditorState,
          updateEditorState: _this2._onChange
        }),
        _react2.default.createElement(_SideToolbar2.default, {
          iconSelectedColor: iconSelectedColor,
          iconColor: iconColor,
          ref: bindSideToolbarRef,
          buttons: blockButtons,
          editorState: realEditorState,
          updateEditorState: _this2._onChange,

          allowContextualizations: {
            inline: allowInlineContextualization,
            block: allowBlockContextualization
          },
          allowNotesInsertion: allowNotesInsertion,
          onContextualizationClick: onContextualizationRequest,
          onNoteAdd: onNoteAdd
        }),
        _react2.default.createElement(_draftJs.Editor, _extends({
          blockRendererFn: _this2._blockRenderer,
          spellCheck: true,
          readOnly: readOnly,
          placeholder: placeholder,

          handleKeyCommand: _this2._handleKeyCommand,
          editorState: _this2.state.editorState,
          onChange: _this2._onChange,
          ref: bindEditorRef,
          onBlur: _this2.onBlur
        }, otherProps))
      )
    );
  };
};

exports.default = ContentEditor;
module.exports = exports['default'];