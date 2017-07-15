import React, {Component} from 'react';
import PropTypes from 'prop-types';

const BlockCitation = ({
  assetId,
  asset,
  onAssetChange,
  onAssetFocus,
  onAssetBlur,
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
    onAssetChange('resources', resourceId, {
      ...resource,
      title
    })
  };

  const onContextualizerPageChange = e => {
    const pages = e.target.value;
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
    <div className="citation-block">
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
      </span>
    </div>
  );
}

export default BlockCitation;


