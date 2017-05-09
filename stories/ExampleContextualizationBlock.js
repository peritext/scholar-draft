import React from 'react';

const BlockContainer = (props) => {
  const {
    children,
    blockProps: {
      data,
      resource,
      resourceId,
      contextualizerId,
      contextualizer,
      contextualization,
      onContextualizationMouseOver,
      onContextualizationMouseOut,
      onDataChange,
      onInputFocus,
      onInputBlur
    },
  } = props;


  const onResourceTitleChange = e => {
    const title = e.target.value;
    onDataChange('resources', resourceId, {
      ...resource,
      title
    })
  };

  const onContextualizerPageChange = e => {
    const pages = e.target.value;
    onDataChange('contextualizers', contextualizerId, {
      ...contextualizer,
      pages
    })
  }

  const onMouseOver = e => {
    if (typeof onContextualizationMouseOver === 'function') {
      onContextualizationMouseOver(data.contextualization.id, data.contextualization, e);
    }
  }

  const onMouseOut = e => {
    if (typeof onContextualizationMouseOut === 'function') {
      onContextualizationMouseOut(data.contextualization.id, data.contextualization, e);
    }
  }


  const exampleRendering = type => {
    switch(type) {
      case 'citation':
      default:
        return (
          <span><i>
            <input
              value={resource.title}
              onChange={onResourceTitleChange}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
            />
          </i>. <i>pp. <input
              value={contextualizer.pages}
              onChange={onContextualizerPageChange}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
            /></i>. 
          {
            resource.authors.map(author => author.firstName + ' ' + author.lastName).join(', ')
          }</span>
        );
    }
  }
  return (
    <div 
      className="citation-block"
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <p>
        {exampleRendering(contextualizer.type)}
      </p>
      <p>{children}</p>
    </div>
  );
};

export default BlockContainer;


