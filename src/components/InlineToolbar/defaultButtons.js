import React from 'react';

import BlockQuoteButton from '../ToolbarButtons/BlockQuoteButton';
import BoldButton from '../ToolbarButtons/BoldButton';
import CodeBlockButton from '../ToolbarButtons/CodeBlockButton';
import HeaderOneButton from '../ToolbarButtons/HeaderOneButton';
import HeaderTwoButton from '../ToolbarButtons/HeaderTwoButton';
import ItalicButton from '../ToolbarButtons/ItalicButton';
import OrderedListItemButton from '../ToolbarButtons/OrderedListItemButton';
import UnorderedListItemButton from '../ToolbarButtons/UnorderedListItemButton';

export default [
  <BoldButton key={ 0 } />,
  <ItalicButton key={ 1 } />,
  <BlockQuoteButton key={ 2 } />,
  <HeaderOneButton key={ 3 } />,
  <HeaderTwoButton key={ 4 } />,
  <OrderedListItemButton key={ 5 } />,
  <UnorderedListItemButton key={ 6 } />,
  <CodeBlockButton key={ 7 } />,
];
