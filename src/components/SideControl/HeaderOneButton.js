import React, { Component } from 'react';
import BlockButton from './BlockButton';
import SVGInline from 'react-svg-inline';
import iconSVG from '../../icons/h1.svg';

export default props => <BlockButton {...props} blockType="header-one" className="DraftJsEditor-header-one">
  <SVGInline
    svg={iconSVG}
  />
</BlockButton>;
