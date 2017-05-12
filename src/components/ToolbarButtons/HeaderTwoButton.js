import React, { Component } from 'react';
import BlockButton from './BlockButton';
import SVGInline from 'react-svg-inline';
import iconSVG from '../../icons/h2.svg';

export default props => <BlockButton {...props} blockType="header-two" className="DraftJsEditor-header-two">
  <SVGInline
    svg={iconSVG}
  />
</BlockButton>;
