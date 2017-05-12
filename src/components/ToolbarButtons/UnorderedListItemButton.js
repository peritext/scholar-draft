import React, { Component } from 'react';
import BlockButton from './BlockButton';
import SVGInline from 'react-svg-inline';
import iconSVG from '../../icons/unorderedlist.svg';

export default props => <BlockButton {...props} blockType="unordered-list-item" className="DraftJsEditor-unordered-list-item">
  <SVGInline
    svg={iconSVG}
  />
</BlockButton>;
