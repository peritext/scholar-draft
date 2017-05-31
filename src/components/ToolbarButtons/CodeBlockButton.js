import React, { Component } from 'react';
import BlockButton from './BlockButton';

export default props => <BlockButton {...props} blockType="code-block">
  {props.iconMap.codeblock}
</BlockButton>;
