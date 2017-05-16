'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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

var _Style = require('fbjs/lib/Style.js');

var _Style2 = _interopRequireDefault(_Style);

var _immutable = require('immutable');

var _draftJsSimpledecorator = require('draft-js-simpledecorator');

var _draftJsSimpledecorator2 = _interopRequireDefault(_draftJsSimpledecorator);

var _draftJsMultidecorators = require('draft-js-multidecorators');

var _draftJsMultidecorators2 = _interopRequireDefault(_draftJsMultidecorators);

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

var _handleLink = require('../../modifiers/handleLink');

var _handleLink2 = _interopRequireDefault(_handleLink);

var _handleImage = require('../../modifiers/handleImage');

var _handleImage2 = _interopRequireDefault(_handleImage);

var _leaveList = require('../../modifiers/leaveList');

var _leaveList2 = _interopRequireDefault(_leaveList);

var _insertText = require('../../modifiers/insertText');

var _insertText2 = _interopRequireDefault(_insertText);

var _utils = require('../../utils');

var _draftJs = require('draft-js');

var _constants = require('../../constants');

var _SideControl = require('../SideControl/SideControl');

var _SideControl2 = _interopRequireDefault(_SideControl);

var _PopoverControl = require('../PopoverControl/PopoverControl');

var _PopoverControl2 = _interopRequireDefault(_PopoverControl);

var _InlineAssetContainer = require('../InlineAssetContainer/InlineAssetContainer');

var _InlineAssetContainer2 = _interopRequireDefault(_InlineAssetContainer);

var _BlockAssetContainer = require('../BlockAssetContainer/BlockAssetContainer');

var _BlockAssetContainer2 = _interopRequireDefault(_BlockAssetContainer);

var _NotePointer = require('../NotePointer/NotePointer');

var _NotePointer2 = _interopRequireDefault(_NotePointer);

require('./BasicEditor.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
// import createLinkDecorator from './decorators/link';
// import createImageDecorator from './decorators/image';


var getSelectionRange = function getSelectionRange() {
  var selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  return selection.getRangeAt(0);
};

var isParentOf = function isParentOf(ele, maybeParent) {

  while (ele.parentNode != null && ele.parentNode != document.body) {
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

var ContentEditor = function (_Component) {
  (0, _inherits3.default)(ContentEditor, _Component);

  function ContentEditor(props) {
    (0, _classCallCheck3.default)(this, ContentEditor);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ContentEditor.__proto__ || (0, _getPrototypeOf2.default)(ContentEditor)).call(this, props));

    _initialiseProps.call(_this);

    return _this;
  }

  (0, _createClass3.default)(ContentEditor, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      // console.log('will update selection in component did update');
      this.updateSelection();
      // console.log('side control display after selection update: ', this.sideControl.toolbar.style.display);
      // force render of inline and atomic block elements
      var forceRender = this.forceRender;


      if (this.props.editorState !== prevProps.editorState || prevProps.assets !== this.props.assets || prevProps.readOnly !== this.props.readOnly || prevProps.notes !== this.props.notes) {
        forceRender(this.props);
      }

      if (this.props.editorState !== prevProps.editorState && this.editor) {
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
  assets: _propTypes2.default.object,
  inlineAssetComponents: _propTypes2.default.object,
  blockAssetComponents: _propTypes2.default.object,
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
  /*
   * Parametrization props
   */
  editorClass: _propTypes2.default.string,
  editorStyle: _propTypes2.default.object,
  allowFootnotesInsertion: _propTypes2.default.bool,
  allowInlineAssetInsertion: _propTypes2.default.bool,
  allowBlockAssetInsertion: _propTypes2.default.bool
};
ContentEditor.defaultProps = {
  blockAssetComponents: {}
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.componentWillReceiveProps = function (nextProps) {
    // console.log('receiving asset request position', nextProps.assetRequestPosition);
    // console.log('readonlies', this.props.readOnly, nextProps.readOnly);
    if (!_this2.props.readOnly && nextProps.readOnly) {
      _this2.inlineToolbar.toolbar.style.display = 'none';
      _this2.sideControl.toolbar.style.display = 'none';
      // console.log('hide side control', this.sideControl.toolbar.style.display);
    }
    if (_this2.state.readOnly !== nextProps.readOnly) {
      _this2.setState({
        readOnly: nextProps.readOnly
      });
    }
    if (_this2.state.editorState !== nextProps.editorState) {
      _this2.setState({
        editorState: nextProps.editorState
      });
    }
  };

  this.focus = function (e) {
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

  this.updateSelection = function () {
    var selectionRangeIsCollapsed = null;
    var sideControlLeft = -92;
    var sideControlVisible = false;
    var sideControlTop = null;
    var popoverControlVisible = false;
    var popoverControlTop = null;
    var popoverControlLeft = null;

    var selectionRange = getSelectionRange();
    // console.log('selection range', selectionRange);
    if (!selectionRange) return;

    var editorEle = _this2.editor;
    // console.log('isparentof truc', isParentOf(selectionRange.commonAncestorContainer, editorEle.refs.editor), selectionRange.commonAncestorContainer, editorEle.refs.editor);
    if (!isParentOf(selectionRange.commonAncestorContainer, editorEle.refs.editor)) {
      return;
    }
    var assetRequestType = void 0;
    var assetRequestPosition = _this2.props.assetRequestPosition;


    if (assetRequestPosition) {
      var currentContent = _this2.props.editorState.getCurrentContent();
      var positionBlockKey = assetRequestPosition.getAnchorKey();
      var positionBlock = currentContent.getBlockForKey(positionBlockKey);
      var isEmpty = positionBlock && positionBlock.toJS().text.length === 0;
      assetRequestType = isEmpty ? 'block' : 'inline';
    }

    var inlineToolbarEle = _this2.inlineToolbar.toolbar;
    var sideControlEle = _this2.sideControl.toolbar;
    var rangeBounds = selectionRange.getBoundingClientRect();

    var displaceY = _this2.editor.refs.editorContainer.parentNode.offsetTop;
    var selectedBlock = getSelectedBlockElement(selectionRange);
    var offsetTop = selectionRange.startContainer.parentNode.offsetTop || 0;
    var top = displaceY + offsetTop;
    // console.log('selected block', selectedBlock, selectionRange);
    if (selectedBlock) {
      var blockBounds = selectedBlock.getBoundingClientRect();
      sideControlVisible = true;
      // sideControlTop = this.state.selectedBlock.offsetTop
      var editorBounds = _this2.state.editorBounds;
      if (!editorBounds) return;
      // const top = displaceY + offsetTop;
      sideControlTop = rangeBounds.top || blockBounds.top;
      // sideControlTop = assetRequestType === 'inline' ? rangeBounds.top : blockBounds.top; // top;
      sideControlEle.style.top = sideControlTop + 'px';
      // position at begining of the line if no asset requested or block asset requested
      // else position after selection
      var left = assetRequestType === 'inline' ? rangeBounds.right : editorBounds.left - sideControlEle.offsetWidth;
      // let left =  editorEle.refs.editorContainer.parentNode.offsetLeft - sideControlEle.offsetWidth; //  blockBounds.left - sideControlEle.offsetWidth - editorEle.refs.editorContainer.parentNode.offsetLeft;
      // left = assetRequestType === 'inline' ? left + rangeBounds.left : left;
      sideControlEle.style.left = left + 'px';
      sideControlEle.style.display = 'block';

      if (!selectionRange.collapsed) {
        // The control needs to be visible so that we can get it's width
        inlineToolbarEle.style.position = 'fixed';
        inlineToolbarEle.style.display = 'block';
        var popoverWidth = inlineToolbarEle.clientWidth;

        popoverControlVisible = true;
        var rangeWidth = rangeBounds.right - rangeBounds.left,
            rangeHeight = rangeBounds.bottom - rangeBounds.top;
        popoverControlTop = top;

        popoverControlLeft = 0;
        var startNode = selectionRange.startContainer;
        while (startNode.nodeType === 3) {
          startNode = startNode.parentNode;
        }
        var height = rangeBounds.bottom - rangeBounds.top;
        var popTop = rangeBounds.top /* - editorBounds.top + displaceY */ - popoverSpacing;
        var _left = rangeBounds.left;
        inlineToolbarEle.style.left = _left + 'px';
        inlineToolbarEle.style.top = popTop + 'px';
      } else {
        inlineToolbarEle.style.display = 'none';
      }
    } else {
      sideControlEle.style.display = 'none';
      inlineToolbarEle.style.display = 'none';
    }
    // console.log('after update: ', sideControlEle.style.display);
  };

  this.findInlineAsset = function (contentBlock, callback, contentState) {
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
      var _props = _this2.props,
          resources = _props.resources,
          assets = _props.assets,
          onMouseOver = _props.onAssetMouseOver,
          onMouseOut = _props.onAssetMouseOut,
          onAssetChange = _props.onAssetChange,
          components = _props.inlineAssetComponents;
      var onFocus = _this2.onAssetFocus,
          onBlur = _this2.onInputBlur;

      var entityKey = contentBlock.getEntityAt(start);
      var data = _this2.state.editorState.getCurrentContent().getEntity(entityKey).toJS();
      var id = data.data.asset.id;
      var asset = assets[id];
      var props = {};
      if (asset) {
        props = {
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

  this.findNotePointers = function (contentBlock, callback, contentState) {
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
      var onMouseOver = function onMouseOver(e) {
        if (typeof _this2.props.onNotePointerMouseOver === 'function') {
          _this2.props.onNotePointerMouseOver(noteId, e);
        }
      };
      var onMouseOut = function onMouseOut(e) {
        if (typeof _this2.props.onNotePointerMouseOut === 'function') {
          _this2.props.onNotePointerMouseOut(noteId, e);
        }
      };
      var onMouseClick = function onMouseClick(e) {
        if (typeof _this2.props.onNotePointerMouseClick === 'function') {
          _this2.props.onNotePointerMouseClick(noteId, e);
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

  this.createDecorator = function () {
    return new _draftJsMultidecorators2.default([new _draftJsSimpledecorator2.default(_this2.findInlineAsset, _InlineAssetContainer2.default), new _draftJsSimpledecorator2.default(_this2.findNotePointers, _NotePointer2.default)]);
  };

  this.forceRender = function (props) {
    var editorState = props.editorState || _this2.generateEmptyEditor();
    var content = editorState.getCurrentContent();

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

  this.onAssetFocus = function (e) {
    e.stopPropagation();
    _this2.setState({
      readOnly: true
    });
  };

  this.onInputBlur = function (e) {
    e.stopPropagation();
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
      var id = data.data.asset.id;
      var asset = _this2.props.assets[id];
      if (!asset) {
        return;
      }
      var blockAssetComponents = _this2.props.blockAssetComponents;

      var AssetComponent = blockAssetComponents[asset.type] || _react2.default.createElement('div', null);
      var _props2 = _this2.props,
          assets = _props2.assets,
          onChange = _props2.onAssetChange,
          onMouseOver = _props2.onAssetMouseOver,
          onMouseOut = _props2.onAssetMouseOut;
      var onFocus = _this2.onAssetFocus,
          onBlur = _this2.onInputBlur;

      if (asset) {
        return {
          component: _BlockAssetContainer2.default,
          editable: false,
          props: {
            asset: asset,
            onFocus: onFocus,
            onBlur: onBlur,
            onChange: onChange,
            onMouseOver: onMouseOver,
            onMouseOut: onMouseOut,
            AssetComponent: AssetComponent
          }
        };
      }
    }
  };

  this.onBlur = function (e) {

    if (_this2.inlineToolbar) {
      _this2.inlineToolbar.toolbar.display = 'none';
    }
    if (_this2.sideControl) {
      _this2.sideControl.toolbar.display = 'none';
    }

    _this2.setState({
      readOnly: true
    });

    var onBlur = _this2.props.onBlur;

    if (onBlur) {
      onBlur(e);
    }
  };

  this._handleKeyCommand = function (command) {
    var editorState = _this2.props.editorState;

    var newState = _draftJs.RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      _this2.onChange(newState);
      return true;
    }
    return false;
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

  this._handleDrop = function (e) {
    var payload = e.dataTransfer.getData('text');
    e.preventDefault();
    e.stopPropagation();

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

  this._handleDragOver = function (e) {
    e.preventDefault();
    return false;
  };

  this.onChange = function (editorState) {
    if (typeof _this2.props.onEditorChange === 'function' && !_this2.props.readOnly) {
      _this2.props.onEditorChange(editorState);
    }
  };

  this.render = function () {
    var _props3 = _this2.props,
        _props3$editorState = _props3.editorState,
        editorState = _props3$editorState === undefined ? _draftJs.EditorState.createEmpty(_this2.createDecorator()) : _props3$editorState,
        _props3$editorClass = _props3.editorClass,
        editorClass = _props3$editorClass === undefined ? 'scholar-draft-BasicEditor' : _props3$editorClass,
        _props3$placeholder = _props3.placeholder,
        placeholder = _props3$placeholder === undefined ? 'write your text' : _props3$placeholder,
        _props3$allowNotesIns = _props3.allowNotesInsertion,
        allowNotesInsertion = _props3$allowNotesIns === undefined ? false : _props3$allowNotesIns,
        _props3$allowInlineAs = _props3.allowInlineAsset,
        allowInlineAsset = _props3$allowInlineAs === undefined ? true : _props3$allowInlineAs,
        _props3$allowBlockAss = _props3.allowBlockAsset,
        allowBlockAsset = _props3$allowBlockAss === undefined ? true : _props3$allowBlockAss,
        blockAssetComponents = _props3.blockAssetComponents,
        inlineButtons = _props3.inlineButtons,
        onAssetRequestUpstream = _props3.onAssetRequest,
        assetRequestPosition = _props3.assetRequestPosition,
        onAssetRequestCancel = _props3.onAssetRequestCancel,
        onAssetChoice = _props3.onAssetChoice,
        editorStyle = _props3.editorStyle,
        onClick = _props3.onClick,
        AssetChoiceComponent = _props3.AssetChoiceComponent,
        assetChoiceProps = _props3.assetChoiceProps,
        otherProps = (0, _objectWithoutProperties3.default)(_props3, ['editorState', 'editorClass', 'placeholder', 'allowNotesInsertion', 'allowInlineAsset', 'allowBlockAsset', 'blockAssetComponents', 'inlineButtons', 'onAssetRequest', 'assetRequestPosition', 'onAssetRequestCancel', 'onAssetChoice', 'editorStyle', 'onClick', 'AssetChoiceComponent', 'assetChoiceProps']);
    var _state = _this2.state,
        readOnly = _state.readOnly,
        stateEditorState = _state.editorState;
    var _handleKeyCommand = _this2._handleKeyCommand,
        _handleBeforeInput = _this2._handleBeforeInput,
        onChange = _this2.onChange,
        _blockRenderer = _this2._blockRenderer,
        _handleReturn = _this2._handleReturn,
        _onTab = _this2._onTab,
        _handleDrop = _this2._handleDrop,
        _handleDragOver = _this2._handleDragOver;


    var realEditorState = editorState || _this2.generateEmptyEditor();

    var bindEditorRef = function bindEditorRef(editor) {
      _this2.editor = editor;
    };
    var bindSideControlRef = function bindSideControlRef(sideControl) {
      _this2.sideControl = sideControl;
    };

    var bindInlineToolbar = function bindInlineToolbar(inlineToolbar) {
      _this2.inlineToolbar = inlineToolbar;
    };

    var onNoteAdd = function onNoteAdd() {
      if (typeof _this2.props.onNoteAdd === 'function') {
        _this2.props.onNoteAdd();
      }
      if (typeof _this2.props.onEditorChange === 'function') {
        setTimeout(function () {
          _this2.props.onEditorChange(_this2.props.editorState);
        }, 1);
      }
    };

    var onAssetRequest = function onAssetRequest(selection) {
      if (typeof onAssetRequestUpstream === 'function') {
        onAssetRequestUpstream(selection);
      }
    };

    var onMainClick = function onMainClick(e) {
      if (typeof onClick === 'function') {
        onClick(e);
      }
      _this2.focus(e);
    };
    var assetRequestType = void 0;
    if (assetRequestPosition) {
      var currentContent = realEditorState.getCurrentContent();
      var positionBlockKey = assetRequestPosition.getAnchorKey();
      var positionBlock = currentContent.getBlockForKey(positionBlockKey);
      var isEmpty = positionBlock && positionBlock.toJS().text.length === 0;
      assetRequestType = isEmpty ? 'block' : 'inline';
    }
    return _react2.default.createElement(
      'div',
      {
        className: editorClass,
        onClick: onMainClick,
        style: editorStyle,

        onDrop: _handleDrop,
        onDragOver: _handleDragOver
      },
      _react2.default.createElement(_PopoverControl2.default, {
        ref: bindInlineToolbar,
        editorState: realEditorState,
        updateEditorState: onChange
      }),
      _react2.default.createElement(_SideControl2.default, {
        ref: bindSideControlRef,

        allowAssets: {
          inline: allowInlineAsset,
          block: allowBlockAsset
        },
        allowNotesInsertion: allowNotesInsertion,

        onAssetRequest: onAssetRequest,
        onAssetRequestCancel: onAssetRequestCancel,
        onAssetChoice: onAssetChoice,
        assetRequestPosition: assetRequestPosition,
        assetRequestType: assetRequestType,
        assetChoiceProps: assetChoiceProps,

        AssetChoiceComponent: AssetChoiceComponent,

        onNoteAdd: onNoteAdd
      }),
      _react2.default.createElement(_draftJs.Editor, (0, _extends3.default)({
        blockRendererFn: _blockRenderer,
        spellCheck: true,
        readOnly: readOnly,
        placeholder: placeholder,

        handleKeyCommand: _handleKeyCommand,
        handleBeforeInput: _handleBeforeInput,
        handleReturn: _handleReturn,
        onTab: _onTab,

        editorState: stateEditorState,

        onChange: onChange,
        ref: bindEditorRef,
        onBlur: _this2.onBlur

      }, otherProps))
    );
  };
};

exports.default = ContentEditor;
module.exports = exports['default'];