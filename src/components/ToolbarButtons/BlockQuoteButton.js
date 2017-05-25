import React, { Component } from 'react';
import BlockButton from './BlockButton';

export default props => <BlockButton {...props} blockType="blockquote">
  {props.iconMap.quoteblock}
</BlockButton>;
