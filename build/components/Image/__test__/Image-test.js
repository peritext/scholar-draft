'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

var _enzyme = require('enzyme');

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiEnzyme = require('chai-enzyme');

var _chaiEnzyme2 = _interopRequireDefault(_chaiEnzyme);

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use((0, _chaiEnzyme2.default)());

describe('<Image />', function () {
  it('renders anchor tag', function () {
    var contentState = _draftJs.ContentState.createFromText('').createEntity('IMG', 'MUTABLE', {
      alt: 'alt',
      src: 'http://cultofthepartyparrot.com/parrots/aussieparrot.gif',
      title: 'parrot'
    });
    var entityKey = contentState.getLastCreatedEntityKey();
    (0, _chai.expect)((0, _enzyme.shallow)(_react2.default.createElement(
      _2.default,
      { entityKey: entityKey, contentState: contentState },
      '\xA0'
    )).html()).to.equal('<span> <img src="http://cultofthepartyparrot.com/parrots/aussieparrot.gif" alt="alt" title="parrot"/></span>');
  });
});