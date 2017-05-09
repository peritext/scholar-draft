import React from 'react';

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
  return (
    <span
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
