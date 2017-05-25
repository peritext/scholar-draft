import React from 'react';
import InlineButton from './InlineButton';

export default props => <InlineButton {...props} inlineStyleType="BOLD" >
  {props.iconMap.bold}
</InlineButton>;
