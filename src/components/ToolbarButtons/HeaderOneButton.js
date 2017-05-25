import React, { Component } from 'react';
import BlockButton from './BlockButton';

export default props => <BlockButton {...props} blockType="header-one">
  {props.iconMap.h1}
</BlockButton>;
