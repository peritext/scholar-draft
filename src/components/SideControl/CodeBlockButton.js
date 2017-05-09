import React, { Component } from 'react';
import BlockButton from './BlockButton';
import SVGInline from 'react-svg-inline';
import iconSVG from '../../icons/codeblock.svg';


export default props => <BlockButton {...props} blockType="code-block" className="DraftJsEditor-code-block">
  <SVGInline
    svg={iconSVG}
  />
</BlockButton>;
