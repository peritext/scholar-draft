import React from 'react';

import './InlineAssetContainer.scss';

const InlineAssetContainer = (props) => {
  const {
    children,
    contentState,
    asset,
    onChange,
    onBlur,
    onFocus,
    onMouseOver,
    onMouseOut,
    components
  } = props;

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
  const Component = (asset && asset.type && components[asset.type]) ||
    <span />;
  return (
    <span
      className="scholar-draft-InlineAssetContainer"
      onMouseOver={onMOver}
      onMouseOut={onMOut}
    >
      <Component
        asset={asset}
        contentState={contentState}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      >
        {children}
      </Component>
    </span>
  );
};

export default InlineAssetContainer;
