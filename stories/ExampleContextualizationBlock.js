import React from 'react';

const BlockContainer = (props) => {
  const {
    children,
    blockProps: {
      asset,
      onMouseOver,
      onMouseOut,
      onChange,
      onFocus,
      onBlur
    },
  } = props;

  const {
    resource,
    resourceId,
    contextualizerId,
    contextualizer,
    contextualization,
  } = asset;


  const onResourceTitleChange = e => {
    const title = e.target.value;
    onChange('resources', resourceId, {
      ...resource,
      title
    })
  };

  const onContextualizerPageChange = e => {
    const pages = e.target.value;
    onChange('contextualizers', contextualizerId, {
      ...contextualizer,
      pages
    })
  }

  const onMOver = e => {
    if (typeof onMouseOver === 'function') {
      onMouseOver(asset.id, asset.contextualization, e);
    }
  }

  const onMOut = e => {
    if (typeof onMouseOut === 'function') {
      onMouseOut(asset.id, asset.contextualization, e);
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
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </i>. <i>pp. <input
              value={contextualizer.pages}
              onChange={onContextualizerPageChange}
              onFocus={onFocus}
              onBlur={onBlur}
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
      onMouseOver={onMOver}
      onMouseOut={onMOut}
    >
      <p>
        {exampleRendering(contextualizer.type)}
      </p>
      <p>{children}</p>
    </div>
  );
};

export default BlockContainer;


