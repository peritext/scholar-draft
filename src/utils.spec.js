/**
 * This module provides unit tests for scholar-draft utils
 * @module scholar-draft/utils
 */
import expect from 'expect';

import {
  convertFromRaw,
  EditorState
} from 'draft-js';

import {
  getUsedAssets,
  getUnusedAssets,
  getAssetEntity
} from './utils';

const convertRawContentsToEditorState = ( rawContents ) => {
  const contentState = convertFromRaw( rawContents );
  return EditorState.createWithContent( contentState );
};

describe( 'utils', () => {
  const mockRawContentState = {
    blocks: [ {
      key: '1',
      text: 'coucou',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [ {
        key: 1,
        offset: 1,
        length: 2
      } ]
    } ],
    entityMap: {
      1: {
        type: 'INLINE_ASSET',
        mutability: 'IMMUTABLE',
        data:
                {
                  insertionType: 'INLINE_ASSET',
                  asset:
                    {
                      id: 'my asset id'
                    }
                }
      }
    }
  };
  const mockAssets = {
    'my asset id': {}
  };
  const mockEditorState = convertRawContentsToEditorState( mockRawContentState );
  describe( 'getAssetEntity', () => {
    it( 'should successfully find an existing asset', () => {
      const result = getAssetEntity( mockEditorState, Object.keys( mockAssets )[0] );
      expect( result ).toBeDefined();
    } );
    it( 'should not find an unexisting asset', () => {
      const result = getAssetEntity( mockEditorState, 'not in state' );
      expect( result ).toBeUndefined();
    } );
  } );
  describe( 'getUsedAssets', () => {
    it( 'should return an array', () => {
      const results = getUsedAssets( mockEditorState, mockAssets );
      expect( Array.isArray( results ) ).toBe( true );
    } );
    it( 'should return used assets', () => {
      const results = getUsedAssets( mockEditorState, mockAssets );
      expect( results.length ).toBe( 1 );
      expect( results[0] ).toBe( Object.keys( mockAssets )[0] );
    } );
    it( 'should exclude unused assets', () => {
      const results = getUsedAssets( mockEditorState, {
        ...mockAssets,
        'not used': {}
      } );
      expect( results.length ).toBe( 1 );
    } );
  } );
  describe( 'getUnusedAssets', () => {
    it( 'should return an array', () => {
      const results = getUnusedAssets( mockEditorState, mockAssets );
      expect( Array.isArray( results ) ).toBe( true );
    } );
    it( 'should return unused assets', () => {
      const results = getUnusedAssets( mockEditorState, {
        ...mockAssets,
        'not used': {}
      } );
      expect( results.length ).toBe( 1 );
      expect( results[0] ).toBe( 'not used' );
    } );
    it( 'should exclude used assets', () => {
      const results = getUnusedAssets( mockEditorState, mockAssets );
      expect( results.length ).toBe( 0 );
    } );
  } );
} );
