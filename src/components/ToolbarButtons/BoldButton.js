import React from 'react';
import InlineButton from './InlineButton.js';
import SVGInline from 'react-svg-inline';
import iconSVG from '../../icons/bold.svg';

export default props => <InlineButton {...props} inlineStyleType="BOLD" className="DraftJsEditor-BoldButton">
  <SVGInline
    svg={iconSVG}
  />
</InlineButton>;
