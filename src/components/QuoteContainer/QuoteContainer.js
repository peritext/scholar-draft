/**
 * This module exports a react component for wrapping quotes 
 * (and possibly styling them in a specific way)
 * @module scholar-draft/Quote
 */
import React from 'react';
import PropTypes from 'prop-types';

const Quote = ( props ) => (
  <q className={ 'scholar-draft-QuoteContainer' }>
    {props.children}
  </q>
);

Quote.propTypes = {
  children: PropTypes.array
};

export default Quote;
