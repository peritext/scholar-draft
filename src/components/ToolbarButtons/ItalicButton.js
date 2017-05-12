import React from 'react';
import InlineButton from './InlineButton.js';
import SVGInline from 'react-svg-inline';
import iconSVG from '../../icons/italic.svg';

export default props => <InlineButton {...props} inlineStyleType="ITALIC" className="DraftJsEditor-ItalicButton">
  <SVGInline
    svg={iconSVG}
  />
</InlineButton>;

