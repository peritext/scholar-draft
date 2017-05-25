import React from 'react';
import SVGInline from 'react-svg-inline';

import asset from './asset.svg'
import bold from './bold.svg'
import codeblock from './codeblock.svg'
import h1 from './h1.svg'
import h2 from './h2.svg'
import italic from './italic.svg'
import note from './note.svg'
import orderedlist from './orderedlist.svg'
import quoteblock from './quoteblock.svg'
import unorderedlist from './unorderedlist.svg'

export default {
  asset: <SVGInline svg={asset} />,
  bold: <SVGInline svg={bold} />,
  codeblock: <SVGInline svg={codeblock} />,
  h1: <SVGInline svg={h1} />,
  h2: <SVGInline svg={h2} />,
  italic: <SVGInline svg={italic} />,
  note: <SVGInline svg={note} />,
  orderedlist: <SVGInline svg={orderedlist} />,
  quoteblock: <SVGInline svg={quoteblock} />,
  unorderedlist: <SVGInline svg={unorderedlist} />,
};