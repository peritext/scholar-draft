/**
 * Courtesy of markdown-shortcuts-plugins project(https://github.com/ngs/draft-js-markdown-shortcuts-plugin)
 */
import React from 'react';

const Image = ({ entityKey, children, contentState }) => {
  const { src, alt, title } = contentState.getEntity(entityKey).getData();
  return (
    <span>
      {children}
      <img src={src} alt={alt} title={title} />
    </span>
  );
};

export default Image;
