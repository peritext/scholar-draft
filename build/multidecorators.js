"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = _interopRequireDefault(require("immutable"));

// Taken from: https://github.com/echenley/draft-js-multidecorators
var KEY_SEPARATOR = '-';

function MultiDecorator(decorators) {
  this.decorators = _immutable.default.List(decorators);
}
/**
    Return list of decoration IDs per character

    @param {ContentBlock}
    @return {List<String>}
*/


MultiDecorator.prototype.getDecorations = function (block, contentState) {
  var decorations = Array(block.getText().length).fill(null);
  this.decorators.forEach(function (decorator, i) {
    var _decorations = decorator.getDecorations(block, contentState);

    _decorations.forEach(function (key, offset) {
      if (!key) {
        return;
      }

      key = i + KEY_SEPARATOR + key;
      decorations[offset] = key;
    });
  });
  return _immutable.default.List(decorations);
};
/**
    Return component to render a decoration

    @param {String}
    @return {Function}
*/


MultiDecorator.prototype.getComponentForKey = function (key) {
  var decorator = this.getDecoratorForKey(key);
  return decorator.getComponentForKey(this.getInnerKey(key));
};
/**
    Return props to render a decoration

    @param {String}
    @return {Object}
*/


MultiDecorator.prototype.getPropsForKey = function (key) {
  var decorator = this.getDecoratorForKey(key);
  return decorator.getPropsForKey(this.getInnerKey(key));
};
/**
    Return a decorator for a specific key

    @param {String}
    @return {Decorator}
*/


MultiDecorator.prototype.getDecoratorForKey = function (key) {
  var parts = key.split(KEY_SEPARATOR);
  var index = Number(parts[0]);
  return this.decorators.get(index);
};
/**
    Return inner key for a decorator

    @param {String}
    @return {String}
*/


MultiDecorator.prototype.getInnerKey = function (key) {
  var parts = key.split(KEY_SEPARATOR);
  return parts.slice(1).join(KEY_SEPARATOR);
};

var _default = MultiDecorator;
exports.default = _default;
module.exports = exports.default;