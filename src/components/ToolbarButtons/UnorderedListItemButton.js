import React, { Component } from 'react';
import BlockButton from './BlockButton';

export default props => <BlockButton {...props} blockType="unordered-list-item">
  {props.iconMap.unorderedlist}
</BlockButton>;
