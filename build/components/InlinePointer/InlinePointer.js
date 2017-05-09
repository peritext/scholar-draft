'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InlinePointer = function InlinePointer(props) {
  var children = props.children,
      contentState = props.contentState,
      _props$contextualizer = props.contextualizer,
      contextualizer = _props$contextualizer === undefined ? {} : _props$contextualizer,
      contextualizerId = props.contextualizerId,
      data = props.data,
      onDataChange = props.onDataChange,
      onInputBlur = props.onInputBlur,
      onInputFocus = props.onInputFocus,
      onContextualizationMouseOver = props.onContextualizationMouseOver,
      onContextualizationMouseOut = props.onContextualizationMouseOut,
      _props$resource = props.resource,
      resource = _props$resource === undefined ? {} : _props$resource,
      resourceId = props.resourceId;


  var onResourceTitleChange = function onResourceTitleChange(e) {
    var title = e.target.value;
    onDataChange('resources', resourceId, _extends({}, resource, {
      title: title
    }));
  };

  var onContextualizerPageChange = function onContextualizerPageChange(e) {
    var pages = e.target.value;
    onDataChange('contextualizers', contextualizerId, _extends({}, contextualizer, {
      pages: pages
    }));
  };
  var onMouseOver = function onMouseOver(e) {
    if (typeof onContextualizationMouseOver === 'function') {
      onContextualizationMouseOver(data.contextualization.id, data.contextualization, e);
    }
  };

  var onMouseOut = function onMouseOut(e) {
    if (typeof onContextualizationMouseOut === 'function') {
      onContextualizationMouseOut(data.contextualization.id, data.contextualization, e);
    }
  };
  return _react2.default.createElement(
    'span',
    { style: {
        background: 'grey',
        color: 'white',
        padding: '5px'
      },
      onMouseOver: onMouseOver,
      onMouseOut: onMouseOut
    },
    _react2.default.createElement('input', {
      value: resource.title,
      onChange: onResourceTitleChange,
      onFocus: onInputFocus,
      onBlur: onInputBlur
    }),
    ', pp.',
    _react2.default.createElement('input', {
      value: contextualizer.pages,
      onChange: onContextualizerPageChange,
      onFocus: onInputFocus,
      onBlur: onInputBlur
    }),
    children
  );
};

exports.default = InlinePointer;
module.exports = exports['default'];