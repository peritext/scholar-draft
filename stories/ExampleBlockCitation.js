import React, {Component} from 'react';
import PropTypes from 'prop-types';


import FieldInput from './FieldInput';

class BlockCitation extends Component {
  render = () => {
    const {
      props: {
        assetId,
        asset,
        onAssetChange,
        onAssetFocus,
        onAssetBlur,
        iconMap,
        renderingMode,
      }
    } = this;
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
      console.log('title focus');
      console.log('active', document.activeElement);
      onAssetFocus(e);
      // this.title.focus();
    };
    const onPageClick = e => {
      onAssetFocus(e);
      // this.pages.focus();
    };
    const bindTitleRef = title => this.title = title;
    const bindPageRef = pages => this.pages = pages;
    return (
      <div className="citation-block">
        <span><i>
              <FieldInput
                value={resource.title}
                onChange={onResourceTitleChange}
                onClick={onTitleClick}
                onFocus={onAssetFocus}
                onBlur={onAssetBlur}
                ref={bindTitleRef}
              />
            </i>. <i>pp. <FieldInput
                value={contextualizer.pages}
                onChange={onContextualizerPageChange}
                onFocus={onAssetFocus}
                onBlur={onAssetBlur}
                onClick={onPageClick}
                ref={bindPageRef}
              /></i>. 
            {
              resource.authors.map(author => author.firstName + ' ' + author.lastName).join(', ')
            }
             - <i>{renderingMode} rendering mode</i>
        </span>
      </div>
    );
  }
}


export default BlockCitation;


