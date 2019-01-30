"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _expect = _interopRequireDefault(require("expect"));

var _draftJs = require("draft-js");

var _utils = require("./utils");

/**
 * This module provides unit tests for scholar-draft utils
 * @module scholar-draft/utils
 */
var convertRawContentsToEditorState = function convertRawContentsToEditorState(rawContents) {
  var contentState = (0, _draftJs.convertFromRaw)(rawContents);
  return _draftJs.EditorState.createWithContent(contentState);
};

describe('utils', function () {
  var mockRawContentState = {
    blocks: [{
      key: '1',
      text: 'coucou',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [{
        key: 1,
        offset: 1,
        length: 2
      }]
    }],
    entityMap: {
      1: {
        type: 'INLINE_ASSET',
        mutability: 'IMMUTABLE',
        data: {
          insertionType: 'INLINE_ASSET',
          asset: {
            id: 'my asset id'
          }
        }
      }
    }
  };
  var mockAssets = {
    'my asset id': {}
  };
  var mockEditorState = convertRawContentsToEditorState(mockRawContentState);
  describe('getAssetEntity', function () {
    it('should successfully find an existing asset', function () {
      var result = (0, _utils.getAssetEntity)(mockEditorState, Object.keys(mockAssets)[0]);
      (0, _expect.default)(result).toBeDefined();
    });
    it('should not find an unexisting asset', function () {
      var result = (0, _utils.getAssetEntity)(mockEditorState, 'not in state');
      (0, _expect.default)(result).toBeUndefined();
    });
  });
  describe('getUsedAssets', function () {
    it('should return an array', function () {
      var results = (0, _utils.getUsedAssets)(mockEditorState, mockAssets);
      (0, _expect.default)(Array.isArray(results)).toBe(true);
    });
    it('should return used assets', function () {
      var results = (0, _utils.getUsedAssets)(mockEditorState, mockAssets);
      (0, _expect.default)(results.length).toBe(1);
      (0, _expect.default)(results[0]).toBe(Object.keys(mockAssets)[0]);
    });
    it('should exclude unused assets', function () {
      var results = (0, _utils.getUsedAssets)(mockEditorState, (0, _objectSpread2.default)({}, mockAssets, {
        'not used': {}
      }));
      (0, _expect.default)(results.length).toBe(1);
    });
  });
  describe('getUnusedAssets', function () {
    it('should return an array', function () {
      var results = (0, _utils.getUnusedAssets)(mockEditorState, mockAssets);
      (0, _expect.default)(Array.isArray(results)).toBe(true);
    });
    it('should return unused assets', function () {
      var results = (0, _utils.getUnusedAssets)(mockEditorState, (0, _objectSpread2.default)({}, mockAssets, {
        'not used': {}
      }));
      (0, _expect.default)(results.length).toBe(1);
      (0, _expect.default)(results[0]).toBe('not used');
    });
    it('should exclude used assets', function () {
      var results = (0, _utils.getUnusedAssets)(mockEditorState, mockAssets);
      (0, _expect.default)(results.length).toBe(0);
    });
  });
});