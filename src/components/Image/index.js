/**
 * Courtesy of markdown-shortcuts-plugins project(https://github.com/ngs/draft-js-markdown-shortcuts-plugin)
 */
import React from 'react';
import PropTypes from 'prop-types';

const Image = ({entityKey, children, contentState}) => {
  const {src, alt, title} = contentState.getEntity(entityKey).getData();
  return (
    <span className="scholar-draft-Image">
      {children}
      <img src={src} alt={alt} title={title} />
    </span>
  );
};

Image.propTypes = {
  contentState: PropTypes.object,
  entityKey: PropTypes.string,
  children: PropTypes.array
};

export default Image;
