import React from 'react';
import SVGInline from 'react-svg-inline';

import BlockButton from './BlockButton';
import iconSVG from '../../icons/orderedlist.svg';

export default props => <BlockButton {...props} blockType="ordered-list-item" className="DraftJsEditor-ordered-list-item">
  <SVGInline
    svg={iconSVG}
  />
</BlockButton>;
