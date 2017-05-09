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

require('./SideControl.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// const styles = {
//   container: {
//     position: 'absolute',
//     left: 0,
//     top: 0,
//     zIndex: 999,
//   }
// };


var SideControl = function (_Component) {
  _inherits(SideControl, _Component);

  function SideControl() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SideControl);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SideControl.__proto__ || Object.getPrototypeOf(SideControl)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      moreOptionsVisible: false,
      canAddBlockContextualization: true
    }, _this.render = function () {
      var _this$props = _this.props,
          editorState = _this$props.editorState,
          updateEditorState = _this$props.updateEditorState,
          onFigureClick = _this$props.onFigureClick,
          onNoteAdd = _this$props.onNoteAdd;
      var canAddBlockContextualization = _this.state.canAddBlockContextualization;


      var handleFigureClick = function handleFigureClick() {
        var currentSelection = editorState && editorState.getSelection();
        var insertionType = 'block;';
        if (currentSelection) {
          var contentState = editorState.getCurrentContent();
          var selectedBlock = contentState.getBlockForKey(currentSelection.getAnchorKey());
          if (selectedBlock && selectedBlock.getText().length > 0) {
            insertionType = 'inline';
          } else {
            insertionType = 'block';
          }
        }
        onFigureClick(insertionType);
      };

      return _react2.default.createElement(
        'div',
        {
          className: 'SideControl'
        },
        _react2.default.createElement(
          'span',
          {
            style: { cursor: 'pointer' },
            onMouseDown: function onMouseDown(e) {
              return e.preventDefault();
            },
            onClick: onNoteAdd
          },
          '+note'
        ),
        canAddBlockContextualization && _react2.default.createElement(
          'svg',
          {
            style: { cursor: 'pointer' },
            onMouseDown: function onMouseDown(e) {
              return e.preventDefault();
            },
            onClick: handleFigureClick,
            fill: iconColor, height: '24', viewBox: '0 0 24 24', width: '24', xmlns: 'http://www.w3.org/2000/svg'
          },
          _react2.default.createElement('path', { d: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z' }),
          _react2.default.createElement('path', { d: 'M0 0h24v24H0z', fill: 'none' })
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
            style: { display: _this.state.moreOptionsVisible ? 'block' : 'none' },
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
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  // componentWillReceiveProps = (nextProps) => {
  // 	const currentSelection = nextProps.editorState && nextProps.editorState.getSelection();
  // 	if (currentSelection) {
  // 		const contentState = nextProps.editorState.getCurrentContent();
  // 		const selectedBlock = contentState.getBlockForKey(currentSelection.getAnchorKey());
  // 		if (selectedBlock && 
  // 			selectedBlock.getText().length === 0 &&
  // 			!this.state.canAddBlockContextualization
  // 		) {
  // 			return this.setState({
  // 				canAddBlockContextualization: true
  // 			});
  // 		}
  // 	}
  // 	if (this.state.canAddBlockContextualization) {
  // 		this.setState({
  // 			canAddBlockContextualization: false
  // 		})
  // 	}
  // }

  return SideControl;
}(_react.Component);

SideControl.propTypes = {
  // style: PropTypes.object,
  onImageClick: _propTypes2.default.func,
  toggleBlockType: _propTypes2.default.func,
  selectedBlockType: _propTypes2.default.string
};
SideControl.defaultProps = {
  iconColor: '#000000',
  iconSelectedColor: '#2000FF'
};
exports.default = SideControl;
module.exports = exports['default'];