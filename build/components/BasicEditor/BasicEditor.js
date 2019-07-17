"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = require("lodash");

var _draftJs = require("draft-js");

var _adjustBlockDepth = _interopRequireDefault(require("../../modifiers/adjustBlockDepth"));

var _utils = require("../../utils");

var _constants = require("../../constants");

var _SideToolbar = _interopRequireDefault(require("../SideToolbar/SideToolbar"));

var _InlineToolbar = _interopRequireDefault(require("../InlineToolbar/InlineToolbar"));

var _InlineAssetContainer = _interopRequireDefault(require("../InlineAssetContainer/InlineAssetContainer"));

var _BlockAssetContainer = _interopRequireDefault(require("../BlockAssetContainer/BlockAssetContainer"));

var _QuoteContainer = _interopRequireDefault(require("../QuoteContainer/QuoteContainer"));

var _NotePointer = _interopRequireDefault(require("../NotePointer/NotePointer"));

var _defaultIconMap = _interopRequireDefault(require("../../icons/defaultIconMap"));

require("./BasicEditor.scss");

/**
 * This module exports a component representing a single draft editor
 * with related interface and decorators.
 * Asset components must be provided through props
 * @module scholar-draft/BasicEditor
 */

/*
 * draft-js EditorState decorators utils
 * import SimpleDecorator from 'draft-js-simpledecorator';
 */
// constant entities type names
// subcomponents
// default icon map (exposes a map of img components - overriden by props-provided icon map)
var hasCommandModifier = _draftJs.KeyBindingUtil.hasCommandModifier; // todo : store that somewhere else

var popoverSpacing = 50;

var BasicEditor =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(BasicEditor, _Component);

  /**
   * Component class's properties accepted types
   */

  /**
   * Component class's context properties types
   */
  function BasicEditor(_props) {
    var _this;

    (0, _classCallCheck2.default)(this, BasicEditor);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(BasicEditor).call(this, _props)); // selection positionning is debounced to improve performance

    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "getChildContext", function () {
      return {
        emitter: _this.emitter,
        assets: _this.props.assets,
        assetChoiceProps: _this.props.assetChoiceProps,
        iconMap: _this.props.iconMap,
        messages: _this.props.messages,
        onAssetMouseOver: _this.props.onAssetMouseOver,
        onAssetMouseOut: _this.props.onAssetMouseOut,
        onAssetChange: _this.props.onAssetChange,
        onAssetFocus: _this.onAssetFocus,
        onAssetBlur: _this.onAssetBlur,
        onNotePointerMouseOver: _this.props.onNotePointerMouseOver,
        onNotePointerMouseOut: _this.props.onNotePointerMouseOut,
        onNotePointerMouseClick: _this.props.onNotePointerMouseClick,
        notes: _this.props.notes
      };
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "componentDidMount", function () {
      _this.setState({
        readOnly: false
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "componentWillReceiveProps", function (nextProps, nextState) {
      // console.time(`editor ${this.props.contentId}`);
      var stateMods = {};

      if (_this.props.isRequestingAssets && !nextProps.isRequestingAssets) {
        // console.log('hiding', this.props.contentId);
        stateMods = (0, _objectSpread2.default)({}, stateMods, {
          styles: {
            sideToolbar: {
              display: 'none'
            },
            inlineToolbar: {
              display: 'none'
            }
          }
        });
      } // hiding the toolbars when editor is set to inactive


      if (_this.props.isActive && !nextProps.isActive && !nextProps.assetRequestPosition) {
        /*
         * locking the draft-editor if asset choice component is not open
         * console.log('hding 2', this.props.contentId);
         */
        stateMods = (0, _objectSpread2.default)({}, stateMods, {
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

        _this.debouncedUpdateSelection.cancel();
      } else if (!_this.props.isActive && nextProps.isActive
      /* && !this.props.assetRequestPosition */
      ) {
          var state = _this.state.editorState || nextProps.editorState;
          var selection = state.getSelection();
          stateMods = (0, _objectSpread2.default)({}, stateMods, {
            readOnly: false
            /*
             * editorState: nextProps.editorState ? EditorState.createWithContent(
             *   nextProps.editorState.getCurrentContent(),
             *   this.createLocalDecorator()
             * ) : this.generateEmptyEditor(),
             * editorState: EditorState.acceptSelection(nextProps.editorState, selection),
             */

          });

          if (_this.state.lastClickCoordinates) {
            var _this$state$lastClick = _this.state.lastClickCoordinates,
                el = _this$state$lastClick.el,
                pageX = _this$state$lastClick.pageX,
                pageY = _this$state$lastClick.pageY;
            stateMods.lastClickCoordinates = undefined;

            try {
              var _getEventTextRange = (0, _utils.getEventTextRange)(pageX, pageY),
                  offset = _getEventTextRange.offset;

              var element = el;
              var parent = element.parentNode; // calculating the block-relative text offset of the selection

              var startOffset = offset;

              while (parent && !(parent.hasAttribute('data-block') && parent.attributes['data-offset-key']) && parent.tagName !== 'BODY') {
                var previousSibling = element.previousSibling;

                while (previousSibling) {
                  // not counting inline assets contents and note pointers
                  if (previousSibling.className && previousSibling.className.indexOf('scholar-draft-InlineAssetContainer') === -1) {
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
                var newSelection = new _draftJs.SelectionState((0, _objectSpread2.default)({}, selection.toJS(), {
                  anchorKey: blockId,
                  focusKey: blockId,
                  anchorOffset: startOffset,
                  focusOffset: startOffset
                }));

                var selectedEditorState = _draftJs.EditorState.acceptSelection(_this.state.editorState, newSelection);

                stateMods = (0, _objectSpread2.default)({}, stateMods, {
                  editorState: selectedEditorState || _this.generateEmptyEditor()
                });
                setTimeout(function () {
                  _this.onChange(selectedEditorState, false);

                  _this.forceRender((0, _objectSpread2.default)({}, _this.props, {
                    editorState: selectedEditorState
                  }));
                });
              }
            } catch (error) {
              console.error(error);
            }
          } else {
            stateMods.editorState = nextProps.editorState ? _draftJs.EditorState.createWithContent(nextProps.editorState.getCurrentContent(), _this.createLocalDecorator()) : _this.generateEmptyEditor();
            setTimeout(function () {
              return _this.forceRender(_this.props);
            });
          }
          /*
           * updating locally stored editorState when the one given by props
           * has changed
           */

        } else if (_this.props.editorState !== nextProps.editorState) {
        /*
         * console.log('storing new editor state with selection',
         * nextProps.editorState && nextProps.editorState.getSelection().getStartOffset())
         */
        stateMods = (0, _objectSpread2.default)({}, stateMods, {
          editorState: nextProps.editorState || _this.generateEmptyEditor()
        });
      } // updating rendering mode


      if (_this.props.customContext !== nextProps.customContext) {
        _this.emitter.dispatchCustomContext(nextProps.customContext);
      } // updating rendering mode


      if (_this.props.renderingMode !== nextProps.renderingMode) {
        _this.emitter.dispatchRenderingMode(nextProps.renderingMode);
      } // trigger changes when assets are changed


      if (_this.props.assets !== nextProps.assets) {
        // dispatch new assets through context's emitter
        _this.emitter.dispatchAssets(nextProps.assets); // update state-stored assets
        // this.setState({ assets: nextProps.assets });/* eslint react/no-unused-state : 0 */
        // if the number of assets is changed it means
        // new entities might be present in the editor.
        // As, for optimizations reasons, draft-js editor does not update
        // its entity map in this case (did not exactly understand why)
        // it has to be forced to re-render itself


        if (!_this.props.assets || !nextProps.assets || Object.keys(_this.props.assets).length !== Object.keys(nextProps.assets).length) {
          /*
           * re-rendering after a timeout.
           * not doing that causes the draft editor not to update
           * before a new modification is applied to it
           * this is weird but it works
           */
          setTimeout(function () {
            return _this.forceRender(nextProps);
          });
        }
      } // trigger changes when notes are changed


      if (_this.props.notes !== nextProps.notes) {
        // dispatch new notes through context's emitter
        _this.emitter.dispatchNotes(nextProps.notes); // update state-stored notes


        stateMods = (0, _objectSpread2.default)({}, stateMods, {
          notes: nextProps.notes
        });
        /* eslint react/no-unused-state : 0 */

        /*
         * if the number of notes is changed it means
         * new entities might be present in the editor.
         * As, for optimizations reasons, draft-js editor does not update
         * its entity map in this case (did not exactly understand why)
         * it has to be forced to re-render itself
         */

        if (!_this.props.notes || !nextProps.notes || Object.keys(_this.props.notes).length !== Object.keys(nextProps.notes).length) {
          /*
           * re-rendering after a timeout.
           * not doing that causes the draft editor not to update
           * before a new modification is applied to it
           */
          setTimeout(function () {
            return _this.forceRender(nextProps);
          });
        }
      } // trigger changes when notes are changed


      if (_this.props.assetChoiceProps !== nextProps.assetChoiceProps) {
        // dispatch new notes through context's emitter
        _this.emitter.dispatchAssetChoiceProps(nextProps.assetChoiceProps);
      } // apply state changes


      if (Object.keys(stateMods).length > 0) {
        // console.log('update', nextProps.contentId);
        _this.setState(stateMods);
      } // console.timeEnd(`editor ${this.props.contentId} receives props`);

    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "shouldComponentUpdate", function (nextProps, nextState) {
      if (_this.state.readOnly !== nextState.readOnly || _this.props.isActive !== nextProps.isActive || _this.state.styles !== nextState.styles || _this.state.editorState !== nextProps.editorState || _this.props.editorState !== nextProps.editorState || _this.props.assetRequestPosition !== nextProps.assetRequestPosition || _this.props.AssetButtonComponent !== nextProps.AssetButtonComponent) {
        return true;
      }

      return false;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "componentWillUpdate", function () {// console.time(`rendering ${this.props.contentId}`)
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "componentDidUpdate", function (prevProps, prevState) {
      if (!_this.state.readOnly) {
        _this.updateSelection();
      } // console.timeEnd(`rendering ${this.props.contentId}`)


      if (
      /*
       * (
       * this.props.editorState !== prevProps.editorState &&
       * this.editor &&
       * !this.state.readOnly &&
       * // this.props.isActive &&
       * prevState.readOnly
       * )
       * ||
       */
      prevState.readOnly && !_this.state.readOnly) {
        // draft triggers an unwanted onChange event when focusing
        _this.setState({
          isFocusing: true
        });

        setTimeout(function () {
          if ((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)) && _this.editor) {
            _this.editor.focus();

            setTimeout(function () {
              return _this.setState({
                isFocusing: false
              });
            });
          }
        });
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "createLocalDecorator", function () {
      var _this$props = _this.props,
          inlineEntities = _this$props.inlineEntities,
          NotePointerComponent = _this$props.NotePointerComponent;
      return (0, _utils.createDecorator)({
        NotePointerComponent: NotePointerComponent || _NotePointer.default,
        findInlineAsset: function findInlineAsset(contentBlock, callback, inputContentState) {
          return (0, _utils.findInlineAsset)(contentBlock, callback, inputContentState, _this.props);
        },
        findNotePointer: _utils.findNotePointer,
        findQuotes: _utils.findQuotes,
        InlineAssetContainerComponent: _InlineAssetContainer.default,
        QuoteContainerComponent: _QuoteContainer.default,
        inlineEntities: inlineEntities
        /* [{strategy: function, entity: component}] */

      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "onNoteAdd", function () {
      if (typeof _this.props.onNoteAdd === 'function') {
        _this.props.onNoteAdd();
      }

      if (typeof _this.props.onEditorChange === 'function') {
        setTimeout(function () {
          _this.props.onEditorChange(_this.props.editorState);
        }, 1);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "onAssetFocus", function (event) {
      event.stopPropagation();

      _this.setState({
        readOnly: true
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "onAssetBlur", function (event) {
      event.stopPropagation();

      _this.setState({
        readOnly: false
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "onBlur", function (event) {
      _this.setState({
        readOnly: true,
        styles: {
          inlineToolbar: {
            display: 'none'
          },
          sideToolbar: {
            display: 'none'
          }
        }
      }); // calls onBlur callbacks if provided


      var onBlur = _this.props.onBlur;

      if (typeof onBlur === 'function') {
        onBlur(event);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "onFocus", function (event) {
      event.stopPropagation(); // calls onBlur callbacks if provided

      var onFocus = _this.props.onFocus;

      if (typeof onFocus === 'function') {
        onFocus(event);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "onChange", function (editorState) {
      if (typeof _this.props.onEditorChange === 'function' && !_this.state.readOnly && !_this.state.isFocusing) {
        _this.props.onEditorChange(editorState);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "componentWillUnmout", function () {
      _this.debouncedUpdateSelection.cancel();
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "undo", function () {
      _this.onChange(_draftJs.EditorState.undo(_this.props.editorState), false);
      /*
       * draft-js won't notice the change of editorState
       * so we have to force it to re-render after having received
       * the new editorState
       */


      setTimeout(function () {
        return _this.forceRender(_this.props);
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "redo", function () {
      _this.onChange(_draftJs.EditorState.redo(_this.props.editorState), false);
      /*
       * draft-js won't notice the change of editorState
       * so we have to force it to re-render after having received
       * the new editorState
       */


      setTimeout(function () {
        return _this.forceRender(_this.props);
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "forceRender", function (props) {
      var editorState = props.editorState || _this.state.editorState; // || this.generateEmptyEditor();

      if (!_this.state.editorState) {
        return;
      }

      var prevSelection = editorState.getSelection();
      var content = editorState.getCurrentContent();

      var newEditorState = _draftJs.EditorState.createWithContent(content, _this.createLocalDecorator());

      var selectedEditorState;
      /*
       * we try to overcome the following error in firefox : https://bugzilla.mozilla.org/show_bug.cgi?id=921444
       * which is related to this draft code part : https://github.com/facebook/draft-js/blob/8de2db9e9e99dea7f4db69f3d8e542df7e60cdda/src/component/selection/setDraftEditorSelection.js#L257
       */

      if (navigator.userAgent.toLowerCase().indexOf('firefox') > 0) {
        selectedEditorState = _draftJs.EditorState.acceptSelection(newEditorState, prevSelection);
      } else {
        selectedEditorState = _draftJs.EditorState.forceSelection(newEditorState, prevSelection);
      }

      var inlineStyle = _this.state.editorState.getCurrentInlineStyle();

      selectedEditorState = _draftJs.EditorState.setInlineStyleOverride(selectedEditorState, inlineStyle);

      _this.setState({
        editorState: selectedEditorState
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "_blockRenderer", function (contentBlock) {
      var type = contentBlock.getType();

      if (type === 'atomic') {
        var entityKey = contentBlock.getEntityAt(0);

        var contentState = _this.state.editorState.getCurrentContent();

        var data;

        try {
          data = contentState.getEntity(entityKey).toJS();
        } catch (error) {
          return undefined;
        }

        var id = data && data.data && data.data.asset && data.data.asset.id;
        var asset = _this.props.assets[id];

        if (!asset) {
          return;
        }

        var _this$props2 = _this.props,
            blockAssetComponents = _this$props2.blockAssetComponents,
            renderingMode = _this$props2.renderingMode;

        var AssetComponent = blockAssetComponents[asset.type] || _react.default.createElement("div", null);

        if (asset) {
          return {
            /* eslint consistent-return:0 */
            component: _BlockAssetContainer.default,
            editable: false,
            props: {
              renderingMode: renderingMode,
              assetId: id,
              AssetComponent: AssetComponent
            }
          };
        }
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "_defaultKeyBindingFn", function (event) {
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
          // `l`

          case 76:
            return 'summon-asset';

          default:
            break;
        }
      }

      return (0, _draftJs.getDefaultKeyBinding)(event);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "_handleKeyCommand", function (command) {
      if (command === 'add-note' && _this.props.allowNotesInsertion && typeof _this.props.onNoteAdd === 'function') {
        _this.onNoteAdd();

        return 'handled';
      } else if (command === 'editor-undo') {
        _this.undo();
      } else if (command === 'editor-redo') {
        _this.redo();
      } else if (command === 'summon-asset') {
        _this.props.onAssetRequest();
        /*
         * this is a workaround for a corner case
         * when an inline entity containing html contents is placed at the end of block
         * draft-js seems to be confused concerning the selection offset
         * when hitting backspace in that solution
         * @todo see in future versions of draft-js if the problem is solved
         */

      } else if (command === 'backspace') {
        var _editorState = _this.props.editorState;

        var selection = _this.props.editorState.getSelection();

        var contentState = _editorState.getCurrentContent();

        if (selection.isCollapsed()) {
          var selectedBlockKey = selection.getStartKey();
          var selectionOffset = selection.getStartOffset();
          var selectedBlock = contentState.getBlockForKey(selectedBlockKey);
          var selectedBlockLength = selectedBlock.getLength();
          /*
           * check of the selection offset returned by draft
           * is greater than selected block length (which should be impossible)
           */

          if (selectionOffset > selectedBlockLength) {
            // remove entity mention from the last character of the real block
            var cleaningSelection = selection.merge({
              anchorOffset: selectedBlockLength - 1,
              focusOffset: selectedBlockLength
            });

            var newContentState = _draftJs.Modifier.applyEntity(contentState, cleaningSelection, null);

            var updatedEditorState = _draftJs.EditorState.push(_editorState, newContentState, 'remove-entity'); // update selection


            var newEditorState = _draftJs.EditorState.acceptSelection(updatedEditorState, cleaningSelection.merge({
              focusOffset: selectedBlockLength - 1
            }));

            _this.onChange(newEditorState);

            return 'handled';
          }
        }
      }

      var editorState = _this.props.editorState;

      var newState = _draftJs.RichUtils.handleKeyCommand(editorState, command);

      if (newState) {
        _this.onChange(newState);

        return 'handled';
      }

      return 'not-handled';
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "_handleBeforeInput", function (character) {
      /*
       * todo : make that feature more subtle and customizable through props
       * if (character === '@') {
       *   this.props.onAssetRequest();
       *   return 'handled';
       * }
       */
      if (character !== ' ') {
        return 'not-handled';
      }

      var editorState = _this.props.editorState;
      var newEditorState = (0, _utils.checkCharacterForState)(editorState, character);

      if (editorState !== newEditorState) {
        _this.onChange(newEditorState);

        return 'handled';
      }

      return 'not-handled';
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "_onTab", function (ev) {
      var editorState = _this.props.editorState;
      var newEditorState = (0, _adjustBlockDepth.default)(editorState, ev);

      if (newEditorState !== editorState) {
        _this.onChange(newEditorState);

        return 'handled';
      }

      return 'not-handled';
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "_handleReturn", function (ev) {
      var editorState = _this.props.editorState;
      var newEditorState = (0, _utils.checkReturnForState)(editorState, ev);

      if (editorState !== newEditorState) {
        _this.onChange(newEditorState);

        return 'handled';
      }

      return 'not-handled';
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "_handleDrop", function (sel, dataTransfer, isInternal) {
      var payload = dataTransfer.data.getData('text'); // Set timeout to allow cursor/selection to move to drop location before calling back onDrop

      setTimeout(function () {
        var selection = _this.props.editorState.getSelection();

        var anchorOffset = selection.getEndOffset() - payload.length;
        anchorOffset = anchorOffset < 0 ? 0 : anchorOffset;
        var payloadSel = selection.merge({
          anchorOffset: anchorOffset
        });

        var newContentState = _draftJs.Modifier.replaceText(_this.props.editorState.getCurrentContent(), payloadSel, ' ');

        var newEditorState = _draftJs.EditorState.createWithContent(newContentState, _this.createLocalDecorator());

        _this.onChange(newEditorState);

        if (typeof _this.props.onDrop === 'function') {
          _this.props.onDrop(payload, selection);

          setTimeout(function () {
            _this.forceRender(_this.props);
          });
        }
      }, 1);
      return false;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "_handleDragOver", function (event) {
      if (_this.state.readOnly) {
        _this.setState({
          readOnly: false
        });
      }

      event.preventDefault();

      if (typeof _this.props.onDragOver === 'function') {
        _this.props.onDragOver(event);
      }

      return false;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "_handlePastedText", function (text, html) {
      if (typeof _this.props.handlePastedText === 'function') {
        return _this.props.handlePastedText(text, html);
      }

      return false;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "generateEmptyEditor", function () {
      return _draftJs.EditorState.createEmpty(_this.createLocalDecorator());
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "updateSelection", function () {
      if (!(_this.props.isRequestingAssets || _this.props.isActive) && _this.state.styles.sideToolbar.display !== 'none') {
        _this.setState({
          styles: {
            sideToolbar: {
              display: 'none'
            },
            inlineToolbar: {
              display: 'none'
            }
          }
        });

        return;
      }

      var left;
      var sideToolbarTop;
      var selectionRange = (0, _utils.getSelectionRange)();
      var editorEle = _this.editor;
      var styles = {
        sideToolbar: (0, _objectSpread2.default)({}, _this.state.styles.sideToolbar),
        inlineToolbar: (0, _objectSpread2.default)({}, _this.state.styles.inlineToolbar)
      };
      if (!selectionRange) return;

      if (!editorEle || !(0, _utils.isParentOf)(selectionRange.commonAncestorContainer, editorEle.editor)) {
        return;
      }

      var assetRequestPosition = _this.props.assetRequestPosition;
      var sideToolbarEle = _this.sideToolbar.toolbar;
      var inlineToolbarEle = _this.inlineToolbar.toolbar;

      if (!sideToolbarEle) {
        return;
      }

      var rangeBounds = selectionRange.getBoundingClientRect();
      var selectedBlock = (0, _utils.getSelectedBlockElement)(selectionRange);

      if (selectedBlock && _this.props.isActive) {
        var blockBounds = selectedBlock.getBoundingClientRect();
        var editorNode = _this.editor && _this.editor.editor;
        var editorBounds = editorNode.getBoundingClientRect(); // const { editorBounds } = this.state;

        if (!editorBounds) return;
        sideToolbarTop = rangeBounds.top || blockBounds.top;
        styles.sideToolbar.top = sideToolbarTop; // `${sideToolbarTop}px`;

        /*
         * position at begining of the line if no asset requested or block asset requested
         * else position after selection
         */

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
          left = rangeBounds.left - inlineToolbarWidth / 2;
          /* eslint prefer-destructuring:0 */

          /*
           * prevent inline toolbar collapse
           * left = left + inlineToolbarWidth / 2  >
           * editorBounds.right ? editorBounds.right - inlineToolbarWidth : left;
           */

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
      } else if (!_this.props.isRequestingAssets) {
        styles.sideToolbar.display = 'none';
        styles.inlineToolbar.display = 'none';
      }

      if (JSON.stringify(styles) !== JSON.stringify(_this.state.styles)) {
        _this.setState({
          styles: styles
        });
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "focus", function (event) {
      setTimeout(function () {
        if (!_this.state.readOnly) {
          _this.editor.focus();
        }
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)), "render", function () {
      // props
      var _this$props3 = _this.props,
          _this$props3$editorSt = _this$props3.editorState,
          editorState = _this$props3$editorSt === void 0 ? _this.generateEmptyEditor() : _this$props3$editorSt,
          _this$props3$editorCl = _this$props3.editorClass,
          editorClass = _this$props3$editorCl === void 0 ? 'scholar-draft-BasicEditor' : _this$props3$editorCl,
          contentId = _this$props3.contentId,
          _this$props3$editorPl = _this$props3.editorPlaceholder,
          editorPlaceholder = _this$props3$editorPl === void 0 ? 'write your text' : _this$props3$editorPl,
          _this$props3$allowNot = _this$props3.allowNotesInsertion,
          allowNotesInsertion = _this$props3$allowNot === void 0 ? false : _this$props3$allowNot,
          _this$props3$allowInl = _this$props3.allowInlineAsset,
          allowInlineAsset = _this$props3$allowInl === void 0 ? true : _this$props3$allowInl,
          _this$props3$allowBlo = _this$props3.allowBlockAsset,
          allowBlockAsset = _this$props3$allowBlo === void 0 ? true : _this$props3$allowBlo,
          onAssetRequestUpstream = _this$props3.onAssetRequest,
          assetRequestPosition = _this$props3.assetRequestPosition,
          onAssetRequestCancel = _this$props3.onAssetRequestCancel,
          onAssetChoice = _this$props3.onAssetChoice,
          editorStyle = _this$props3.editorStyle,
          onClick = _this$props3.onClick,
          AssetChoiceComponent = _this$props3.AssetChoiceComponent,
          assetChoiceProps = _this$props3.assetChoiceProps,
          AssetButtonComponent = _this$props3.AssetButtonComponent,
          NoteButtonComponent = _this$props3.NoteButtonComponent,
          isActive = _this$props3.isActive,
          inlineButtons = _this$props3.inlineButtons,
          containerDimensions = _this$props3.containerDimensions,
          otherProps = (0, _objectWithoutProperties2.default)(_this$props3, ["editorState", "editorClass", "contentId", "editorPlaceholder", "allowNotesInsertion", "allowInlineAsset", "allowBlockAsset", "onAssetRequest", "assetRequestPosition", "onAssetRequestCancel", "onAssetChoice", "editorStyle", "onClick", "AssetChoiceComponent", "assetChoiceProps", "AssetButtonComponent", "NoteButtonComponent", "isActive", "inlineButtons", "containerDimensions"]);
      var messages = {
        addNote: _this.props.messages && _this.props.messages.addNote ? _this.props.messages.addNote : 'add a note (shortcut: "cmd + m")',
        summonAsset: _this.props.messages && _this.props.messages.summonAsset ? _this.props.messages.summonAsset : 'add an asset (shortcut: "@")',
        cancel: _this.props.messages && _this.props.messages.cancel ? _this.props.messages.cancel : 'cancel'
      }; // internal state

      var _this$state = _this.state,
          readOnly = _this$state.readOnly,
          stateEditorState = _this$state.editorState,
          styles = _this$state.styles; // class functions

      var _assertThisInitialize = (0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)),
          _handleKeyCommand = _assertThisInitialize._handleKeyCommand,
          _handleBeforeInput = _assertThisInitialize._handleBeforeInput,
          _blockRenderer = _assertThisInitialize._blockRenderer,
          _handleReturn = _assertThisInitialize._handleReturn,
          _onTab = _assertThisInitialize._onTab,
          _handleDrop = _assertThisInitialize._handleDrop,
          _handleDragOver = _assertThisInitialize._handleDragOver,
          _handlePastedText = _assertThisInitialize._handlePastedText,
          onChange = _assertThisInitialize.onChange,
          onNoteAdd = _assertThisInitialize.onNoteAdd,
          _defaultKeyBindingFn = _assertThisInitialize._defaultKeyBindingFn; // console.time(`preparing rendering ${contentId}`)

      /**
       * Functions handling draft editor locking/unlocking
       * and callbacks related to inline asset choices with asset choice component
       */
      // locking draft-js editor when asset choice component is summoned


      var onAssetRequest = function onAssetRequest(selection) {
        if (typeof onAssetRequestUpstream === 'function') {
          onAssetRequestUpstream(selection);

          _this.setState({
            readOnly: true
          });
        }
      }; // unlocking draft-js editor when clicked


      var onMainClick = function onMainClick(event) {
        event.stopPropagation();
        var stateMods = {};

        if (typeof onClick === 'function') {
          onClick(event);
        }

        if (_this.state.readOnly) {
          var coordinates = {
            clientX: event.clientX,
            clientY: event.clientY,
            el: event.target,
            pageX: event.pageX,
            pageY: event.pageY
          };
          stateMods.lastClickCoordinates = coordinates;
        }

        if (_this.props.isActive && _this.state.readOnly) {
          stateMods.readOnly = false;
        }

        if (Object.keys(stateMods).length > 0) {
          _this.setState(stateMods);
        } // this.focus(event);

      }; // locking draft-js editor when user interacts with asset-choice component


      var onAssetChoiceFocus = function onAssetChoiceFocus() {
        _this.setState({
          readOnly: true
        });
      }; // unlocking draft-js editor when asset choice is abandonned


      var onOnAssetRequestCancel = function onOnAssetRequestCancel() {
        onAssetRequestCancel();

        _this.forceRender(_this.props);

        _this.setState({
          readOnly: false
        });
      }; // unlocking draft-js editor when asset is choosen


      var onOnAssetChoice = function onOnAssetChoice(asset) {
        onAssetChoice(asset);
        /*
         * this.setState({
         *   readOnly: false
         * });
         */
      };
      /**
       * component bindings and final props definitions
       */


      var realEditorState = stateEditorState || _this.generateEmptyEditor();
      /* eslint no-unused-vars : 0 */


      var bindEditorRef = function bindEditorRef(editor) {
        _this.editor = editor;
      };

      var bindSideToolbarRef = function bindSideToolbarRef(sideToolbar) {
        _this.sideToolbar = sideToolbar;
      };

      var bindInlineToolbar = function bindInlineToolbar(inlineToolbar) {
        _this.inlineToolbar = inlineToolbar;
      }; // key binding can be provided through props


      var keyBindingFn = typeof _this.props.keyBindingFn === 'function' ? _this.props.keyBindingFn : _defaultKeyBindingFn; // props-provided iconMap can be merged with defaultIconMap for displaying custom icons

      var iconMap = _this.props.iconMap ? (0, _objectSpread2.default)({}, _defaultIconMap.default, _this.props.iconMap) : _defaultIconMap.default;
      var handleFocus = _this.onFocus;
      var handleBlur = _this.onBlur;
      /*
       * console.timeEnd(`preparing rendering ${contentId}`)
       * console.log(this.props.contentId,
       * 'render with selection', stateEditorState.getSelection().getStartOffset());
       */

      return _react.default.createElement("div", {
        className: editorClass + (readOnly ? '' : ' active'),
        onClick: onMainClick,
        style: editorStyle,
        onDragOver: _handleDragOver
      }, _react.default.createElement(_InlineToolbar.default, {
        ref: bindInlineToolbar,
        buttons: inlineButtons,
        editorState: realEditorState,
        updateEditorState: onChange,
        iconMap: iconMap,
        style: styles.inlineToolbar
      }), _react.default.createElement(_SideToolbar.default, {
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
        containerDimensions: containerDimensions,
        messages: messages,
        contentId: contentId,
        onNoteAdd: onNoteAdd
      }), _react.default.createElement(_draftJs.Editor, (0, _extends2.default)({
        editorState: realEditorState,
        onChange: onChange,
        blockRendererFn: _blockRenderer,
        spellCheck: true,
        readOnly: isActive ? readOnly : true,
        placeholder: editorPlaceholder,
        keyBindingFn: keyBindingFn,
        handlePastedText: _handlePastedText,
        handleKeyCommand: _handleKeyCommand,
        handleBeforeInput: _handleBeforeInput,
        handleReturn: _handleReturn,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onTab: _onTab,
        handleDrop: _handleDrop,
        ref: bindEditorRef
      }, otherProps)));
    });
    _this.debouncedUpdateSelection = (0, _lodash.debounce)(_this.updateSelection, 100);
    _this.state = {
      editorState: undefined,
      // toolbars styles are represented as css-in-js
      styles: {
        inlineToolbar: {},
        sideToolbar: {}
      },
      readOnly: true
    }; // the emitter allows to let custom components know when data is changed

    _this.emitter = new _utils.Emitter();
    return _this;
  }
  /**
   * Binds component's data to its context
   */


  return BasicEditor;
}(_react.Component);

exports.default = BasicEditor;
(0, _defineProperty2.default)(BasicEditor, "propTypes", {
  /*
   * State-related props
   */
  editorState: _propTypes.default.object,
  readOnly: _propTypes.default.bool,
  assets: _propTypes.default.object,
  notes: _propTypes.default.object,
  inlineAssetComponents: _propTypes.default.object,
  customContext: _propTypes.default.object,
  blockAssetComponents: _propTypes.default.object,
  assetRequestPosition: _propTypes.default.object,
  contentId: _propTypes.default.string,
  isActive: _propTypes.default.bool,
  isRequestingAssets: _propTypes.default.bool,
  containerDimensions: _propTypes.default.object,

  /*
   * Method props
   */
  onEditorChange: _propTypes.default.func,
  onNotesOrderChange: _propTypes.default.func,
  onAssetRequest: _propTypes.default.func,
  onNoteAdd: _propTypes.default.func,
  onAssetClick: _propTypes.default.func,
  onAssetMouseOver: _propTypes.default.func,
  onAssetMouseOut: _propTypes.default.func,
  onDrop: _propTypes.default.func,
  onDragOver: _propTypes.default.func,
  onClick: _propTypes.default.func,
  onBlur: _propTypes.default.func,
  onFocus: _propTypes.default.func,
  onAssetChoice: _propTypes.default.func,
  onAssetChange: _propTypes.default.func,
  onAssetRequestCancel: _propTypes.default.func,
  onNotePointerMouseOver: _propTypes.default.func,
  onNotePointerMouseOut: _propTypes.default.func,
  onNotePointerMouseClick: _propTypes.default.func,
  handlePastedText: _propTypes.default.func,

  /*
   * Parametrization props
   */
  editorClass: _propTypes.default.string,
  editorPlaceholder: _propTypes.default.string,
  editorStyle: _propTypes.default.object,
  allowNotesInsertion: _propTypes.default.bool,
  allowInlineAsset: _propTypes.default.bool,
  allowBlockAsset: _propTypes.default.bool,
  AssetChoiceComponent: _propTypes.default.func,
  AssetButtonComponent: _propTypes.default.func,
  NoteButtonComponent: _propTypes.default.func,
  assetChoiceProps: _propTypes.default.object,
  keyBindingFn: _propTypes.default.func,
  inlineButtons: _propTypes.default.array,
  NotePointerComponent: _propTypes.default.func,
  inlineEntities: _propTypes.default.array,
  messages: _propTypes.default.object,
  renderingMode: _propTypes.default.string,
  iconMap: _propTypes.default.object,
  styles: _propTypes.default.object
  /**
   * Component class's default properties
   */

});
(0, _defineProperty2.default)(BasicEditor, "defaultProps", {
  blockAssetComponents: {}
});
(0, _defineProperty2.default)(BasicEditor, "childContextTypes", {
  emitter: _propTypes.default.object,
  assets: _propTypes.default.object,
  notes: _propTypes.default.object,
  assetChoiceProps: _propTypes.default.object,
  onAssetMouseOver: _propTypes.default.func,
  onAssetMouseOut: _propTypes.default.func,
  onAssetChange: _propTypes.default.func,
  onAssetFocus: _propTypes.default.func,
  onAssetBlur: _propTypes.default.func,
  onNotePointerMouseOver: _propTypes.default.func,
  onNotePointerMouseOut: _propTypes.default.func,
  onNotePointerMouseClick: _propTypes.default.func,
  messages: _propTypes.default.object,
  onFocus: _propTypes.default.func,
  iconMap: _propTypes.default.object
  /**
   * Component class's constructor
   * @param {object} props - props received at initialization
   */

});
module.exports = exports.default;