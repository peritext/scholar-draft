import React from 'react';
import PropTypes from 'prop-types';

import './BlockAssetContainer.scss';

const BlockAssetContainer = (props) => {
  const {
    children,
    blockProps
  } = props;

  const {
    asset,
    assetId,
    AssetComponent,
    onChange,
    onBlur,
    onFocus,
    onMouseOver,
    onMouseOut,
  } = blockProps;

  const onMOver = (e) => {
    e.stopPropagation();
    if (typeof onMouseOver === 'function') {
      onMouseOver(asset.id, asset, e);
    }
  };

  const onMOut = (e) => {
    e.stopPropagation();
    if (typeof onMouseOut === 'function') {
      onMouseOut(asset.id, asset, e);
    }
  };
  return (
    <div
      className="scholar-draft-BlockAssetContainer"
      onMouseOver={onMOver}
      onMouseOut={onMOut}
    >
      <AssetComponent
        assetId={assetId}
        asset={asset}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      <div>{children}</div>
    </div>
  );
};

BlockAssetContainer.propTypes = {
  children: PropTypes.array,
  blockProps: PropTypes.shape({
    asset: PropTypes.object,
    assetId: PropTypes.string,
    
    AssetComponent: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
  })
}

export default BlockAssetContainer;
