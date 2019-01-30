/**
 * Courtesy of markdown-shortcuts-plugins project(https://github.com/ngs/draft-js-markdown-shortcuts-plugin)
 */
import React from 'react';
import PropTypes from 'prop-types';

const Link = (props) => {
  const {href, title} = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a className="scholar-draft-Link" href={href} title={title}>
      {props.children}
    </a>
  );
};

Link.propTypes = {
  contentState: PropTypes.object,
  children: PropTypes.array,
  entityKey: PropTypes.string
};

export default Link;
