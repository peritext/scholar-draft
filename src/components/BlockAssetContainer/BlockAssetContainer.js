import React from 'react';

import './BlockAssetContainer.scss';

const BlockAssetContainer = (props) => {
  const {
    children,
    blockProps
  } = props;

  const {
    asset,
    AssetComponent,
    onChange,
    onBlur,
    onFocus,
    onMouseOver,
    onMouseOut,
  } = blockProps;

  const onMOver = (e) => {
    if (typeof onMouseOver === 'function') {
      onMouseOver(asset.id, asset, e);
    }
  };

  const onMOut = (e) => {
    if (typeof onMouseOut === 'function') {
      onMouseOut(asset.id, asset, e);
    }
  };
  return (
    <div
      className="peritext-draft-BlockAssetContainer"
      onMouseOver={onMOver}
      onMouseOut={onMOut}
    >
      <AssetComponent
        asset={asset}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      <div>{children}</div>
    </div>
  );
};

export default BlockAssetContainer;