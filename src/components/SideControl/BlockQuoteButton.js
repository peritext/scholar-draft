import React, { Component } from 'react';
import BlockButton from './BlockButton';
import SVGInline from 'react-svg-inline';
import iconSVG from '../../icons/quoteblock.svg';

export default props => <BlockButton {...props} blockType="blockquote" className="DraftJsEditor-blockquote">
  <SVGInline
    svg={iconSVG}
  />
</BlockButton>;
