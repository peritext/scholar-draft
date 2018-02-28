import React, {Component} from 'react';
import PropTypes from 'prop-types';

const InlineCitation = ({
  assetId,
  asset,
  onAssetChange,
  onAssetFocus,
  onAssetBlur,
  renderingMode,
  iconMap,
}) => {
  const {
    resource,
    resourceId,
    contextualizerId,
    contextualizer,
    contextualization,
  } = asset;

  const onResourceTitleChange = e => {
    const title = e.target.value;
    e.stopPropagation();
    onAssetChange('resources', resourceId, {
      ...resource,
      title
    })
  };

  const onContextualizerPageChange = e => {
    const pages = e.target.value;
    e.stopPropagation();
    onAssetChange('contextualizers', contextualizerId, {
      ...contextualizer,
      pages
    })
  }

  const onTitleClick = e => {
    onAssetFocus(e);
  };
  const onPageClick = e => {
    onAssetFocus(e);
  };
  return (
    <span className="citation-inline">
      <span><i>
            <input
              value={resource.title}
              onChange={onResourceTitleChange}
              onClick={onTitleClick}
              onFocus={onAssetFocus}
              onBlur={onAssetBlur}
            />
          </i>. <i>pp. <input
              value={contextualizer.pages}
              onChange={onContextualizerPageChange}
              onFocus={onAssetFocus}
              onBlur={onAssetBlur}
              onClick={onPageClick}
            /></i>. 
          {
            resource.authors.map(author => author.firstName + ' ' + author.lastName).join(', ')
          }
          - <i>{renderingMode} rendering mode</i>
      </span>
    </span>
  );
}

export default InlineCitation;
