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
    resourceId,
    inlineContextualizationComponents
  } = props;

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
  const Component = (contextualizer.type && inlineContextualizationComponents[contextualizer.type]) ||
    <span />;
  return (
    <span
      className="peritext-draft-InlinePointer"
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <Component
      contentState={contentState}
      contextualizer = {contextualizer}
      contextualizerId={contextualizerId}
      data={data}
      onDataChange={onDataChange}
      onInputBlur={onInputBlur}
      onInputFocus={onInputFocus}
      resource={resource}
      resourceId={resourceId}
      >
        {children}
      </Component>
    </span>
  );
};

export default InlinePointer;
