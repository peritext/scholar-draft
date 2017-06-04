import React from 'react';
import PropTypes from 'prop-types';

const Quote = (props) => {
  return (
    <q className="scholar-draft-QuoteContainer">
      {props.children}
    </q>
  );
};

Quote.propTypes = {
  children: PropTypes.array
};

export default Quote;