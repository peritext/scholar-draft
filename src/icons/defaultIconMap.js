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
  asset: (
    <img
      alt={ 'asset-icon' }
      src={ asset }
    />
  ),
  bold: (
    <img
      alt={ 'bold-icon' }
      src={ bold }
    />
  ),
  codeblock: (
    <img
      alt={ 'codeblock-icon' }
      src={ codeblock }
    />
  ),
  h1: (
    <img
      alt={ 'h1-icon' }
      src={ h1 }
    />
  ),
  h2: (
    <img
      alt={ 'h2-icon' }
      src={ h2 }
    />
  ),
  italic: (
    <img
      alt={ 'italic-icon' }
      src={ italic }
    />
  ),
  note: (
    <img
      alt={ 'note-icon' }
      src={ note }
    />
  ),
  orderedlist: (
    <img
      alt={ 'orderedlist-icon' }
      src={ orderedlist }
    />
  ),
  quoteblock: (
    <img
      alt={ 'quoteblock-icon' }
      src={ quoteblock }
    />
  ),
  unorderedlist: (
    <img
      alt={ 'unorderedlist-icon' }
      src={ unorderedlist }
    />
  ),
};
