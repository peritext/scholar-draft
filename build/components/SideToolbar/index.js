'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _MoreOptions = require('./MoreOptions');

var _MoreOptions2 = _interopRequireDefault(_MoreOptions);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 999
  }
};

var SideToolbar = function (_Component) {
  _inherits(SideToolbar, _Component);

  function SideToolbar(props) {
    _classCallCheck(this, SideToolbar);

    var _this = _possibleConstructorReturn(this, (SideToolbar.__proto__ || Object.getPrototypeOf(SideToolbar)).call(this, props));

    _this.state = {
      moreOptionsVisible: false
    };

    _this.render = function () {
      var _this$props = _this.props,
          iconColor = _this$props.iconColor,
          iconSelectedColor = _this$props.iconSelectedColor,
          popoverStyle = _this$props.popoverStyle,
          buttons = _this$props.buttons,
          editorState = _this$props.editorState,
          updateEditorState = _this$props.updateEditorState,
          onContextualizationClick = _this$props.onContextualizationClick,
          onNoteAdd = _this$props.onNoteAdd,
          _this$props$allowCont = _this$props.allowContextualizations,
          allowContextualizations = _this$props$allowCont === undefined ? {
        // inline: true,
        // block: true
      } : _this$props$allowCont,
          _this$props$allowNote = _this$props.allowNotesInsertion,
          allowNotesInsertion = _this$props$allowNote === undefined ? false : _this$props$allowNote;
      var canAddBlockContextualization = _this.state.canAddBlockContextualization;


      var handleFigureClick = function handleFigureClick() {
        var currentSelection = editorState && editorState.getSelection();
        var insertionType = 'blockContextualization;';
        if (currentSelection) {
          var contentState = editorState.getCurrentContent();
          var selectedBlock = contentState.getBlockForKey(currentSelection.getAnchorKey());
          if (selectedBlock && selectedBlock.getText().length > 0) {
            insertionType = 'inlineContextualization';
          } else {
            insertionType = 'blockContextualization';
          }
        }
        onContextualizationClick(insertionType, currentSelection);
      };

      var bindRef = function bindRef(toolbar) {
        _this.toolbar = toolbar;
      };

      return _react2.default.createElement(
        'div',
        {
          style: Object.assign({}, styles.container, _this.props.style),
          ref: bindRef
        },
        allowNotesInsertion && _react2.default.createElement(
          'span',
          {
            style: { cursor: 'pointer' },
            onMouseDown: function onMouseDown(e) {
              return e.preventDefault();
            },
            onClick: onNoteAdd
          },
          '+n'
        ),
        (allowContextualizations.inline || allowContextualizations.block) && _react2.default.createElement(
          'span',
          {
            style: { cursor: 'pointer' },
            onMouseDown: function onMouseDown(e) {
              return e.preventDefault();
            },
            onClick: handleFigureClick
          },
          '+c'
        ),
        _react2.default.createElement(
          'div',
          {
            style: { display: 'inline-block', cursor: 'pointer' },
            onMouseOut: function onMouseOut(e) {
              _this.setState({
                moreOptionsVisible: false
              });
            },
            onMouseOver: function onMouseOver(e) {
              _this.setState({
                moreOptionsVisible: true
              });
            },
            className: 'DraftJsEditor-more-options'
          },
          _react2.default.createElement(
            'svg',
            {
              onMouseDown: function onMouseDown(e) {
                return e.preventDefault();
              },
              fill: iconColor,
              height: '24',
              viewBox: '0 0 24 24',
              width: '24',
              xmlns: 'http://www.w3.org/2000/svg'
            },
            _react2.default.createElement('path', { d: 'M0 0h24v24H0z', fill: 'none' }),
            _react2.default.createElement('path', { d: 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z' })
          ),
          _react2.default.createElement(_MoreOptions2.default, {
            style: Object.assign({}, popoverStyle, {
              display: _this.state.moreOptionsVisible ? 'block' : 'none'
            }),
            toggleBlockType: _this.props.toggleBlockType,
            selectedBlockType: _this.props.selectedBlockType,
            iconSelectedColor: iconSelectedColor,
            iconColor: iconColor,
            buttons: buttons,
            editorState: editorState,
            updateEditorState: updateEditorState
          })
        )
      );
    };

    return _this;
  }

  return SideToolbar;
}(_react.Component);

SideToolbar.propTypes = {
  style: _propTypes2.default.object,
  onImageClick: _propTypes2.default.func,
  toggleBlockType: _propTypes2.default.func,
  selectedBlockType: _propTypes2.default.string,

  /**
   * The icon fill colour
   */
  iconColor: _propTypes2.default.string,

  /**
   * The icon fill colour when selected
   */
  iconSelectedColor: _propTypes2.default.string,

  /**
   * Override the inline styles for the popover component.
   */
  popoverStyle: _propTypes2.default.object,

  /**
   * Override the block buttons.
   */
  buttons: _propTypes2.default.array
};
SideToolbar.defaultProps = {
  iconColor: '#000000',
  iconSelectedColor: '#2000FF'
};
exports.default = SideToolbar;
module.exports = exports['default'];