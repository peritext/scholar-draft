import React from 'react';

import './InlinePointer.scss';

const InlinePointer = (props) => {
  const {
    children,
    contentState,
    contextualizer = {},
    contextualizerId,
    data,
    onDataChange,
    onInputBlur,
    onInputFocus,
    onContextualizationMouseOver,
    onContextualizationMouseOut,
    resource = {},
    resourceId
  } = props;

  const onResourceTitleChange = (e) => {
    const title = e.target.value;
    onDataChange('resources', resourceId, {
      ...resource,
      title
    });
  };

  const onContextualizerPageChange = (e) => {
    const pages = e.target.value;
    onDataChange('contextualizers', contextualizerId, {
      ...contextualizer,
      pages
    });
  };
  const onMouseOver = (e) => {
    if (typeof onContextualizationMouseOver === 'function') {
      onContextualizationMouseOver(data.contextualization.id, data.contextualization, e);
    }
  };

  const onMouseOut = (e) => {
    if (typeof onContextualizationMouseOut === 'function') {
      onContextualizationMouseOut(data.contextualization.id, data.contextualization, e);
    }
  };
  return (
    <span
      className="InlinePointer"
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <input
        value={resource.title}
        onChange={onResourceTitleChange}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
      />, pp.
      <input
        value={contextualizer.pages}
        onChange={onContextualizerPageChange}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
      />

      {children}
    </span>
  );
};

export default InlinePointer;
