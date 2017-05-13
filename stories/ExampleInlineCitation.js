import React from 'react';

const InlineCitation = (props) => {
  const {
    children,
    contentState,
    data,
    asset,
    onChange,
    onBlur,
    onFocus,
  } = props;

  const {
    contextualizer = {},
    contextualizerId,
    resource = {},
    resourceId,
  } = asset;

  const onResourceTitleChange = (e) => {
    const title = e.target.value;
    onChange('resources', resourceId, {
      ...resource,
      title
    });
  };

  const onContextualizerPageChange = (e) => {
    const pages = e.target.value;
    onChange('contextualizers', contextualizerId, {
      ...contextualizer,
      pages
    });
  };
  return (
    <span
    >
      <input
        value={resource.title}
        onChange={onResourceTitleChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />, pp.
      <input
        value={contextualizer.pages}
        onChange={onContextualizerPageChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      {children}
    </span>
  );
};

export default InlineCitation;
