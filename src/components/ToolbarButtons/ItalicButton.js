import React from 'react';
import InlineButton from './InlineButton.js';

export default props => <InlineButton {...props} inlineStyleType="ITALIC">
  {props.iconMap.italic}
</InlineButton>;

