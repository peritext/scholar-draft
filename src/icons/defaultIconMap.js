/* eslint jsx-a11y/img-has-alt: 0 */
import React from 'react';
// import SVGInline from 'react-svg-inline';

import asset from './asset.svg';
import bold from './bold.svg';
import codeblock from './codeblock.svg';
import h1 from './h1.svg';
import h2 from './h2.svg';
import italic from './italic.svg';
import note from './note.svg';
import orderedlist from './orderedlist.svg';
import quoteblock from './quoteblock.svg';
import unorderedlist from './unorderedlist.svg';

export default {
  asset: <img src={asset} />,
  bold: <img src={bold} />,
  codeblock: <img src={codeblock} />,
  h1: <img src={h1} />,
  h2: <img src={h2} />,
  italic: <img src={italic} />,
  note: <img src={note} />,
  orderedlist: <img src={orderedlist} />,
  quoteblock: <img src={quoteblock} />,
  unorderedlist: <img src={unorderedlist} />,
};
