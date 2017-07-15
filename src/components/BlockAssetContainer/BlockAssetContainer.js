/* eslint react/no-did-mount-set-state : 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './BlockAssetContainer.scss';

class BlockAssetContainer extends Component {

  static contextTypes = {
    emitter: PropTypes.object,
    assets: PropTypes.object,
    iconMap: PropTypes.object,

    onAssetMouseOver: PropTypes.func,
    onAssetMouseOut: PropTypes.func,
    onAssetChange: PropTypes.func,
    onAssetFocus: PropTypes.func,
    onAssetBlur: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  componentDidMount() {
    this.setState({
      asset: this.context.assets[this.props.blockProps.assetId]
    });
    this.unsubscribe = this.context.emitter.subscribe((assets) => {
      const asset = assets[this.props.blockProps.assetId];
      this.setState({
        asset
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render = () => {

    const {
      asset
    } = this.state;
    if (!asset) {
      return null;
    }

    const {
      onAssetMouseOver,
      onAssetMouseOut,
      onAssetChange,
      onAssetFocus,
      onAssetBlur,
      iconMap,
    } = this.context;

    const {
      blockProps: {
        assetId,
        AssetComponent
      },
      children
    } = this.props;

    const onMOver = (event) => {
      event.stopPropagation();
      if (typeof onMouseOver === 'function') {
        onAssetMouseOver(asset.id, asset, event);
      }
    };

    const onMOut = (event) => {
      event.stopPropagation();
      if (typeof onMouseOut === 'function') {
        onAssetMouseOut(asset.id, asset, event);
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
          onAssetChange={onAssetChange}
          onAssetFocus={onAssetFocus}
          onAssetBlur={onAssetBlur}
          iconMap={iconMap}
        />
        <div>{children}</div>
      </div>
    );
  }
}

BlockAssetContainer.propTypes = {
  children: PropTypes.array,
  // assetId: PropTypes.string,
  blockProps: PropTypes.shape({
    assetId: PropTypes.string,
    AssetComponent: PropTypes.func,
  })
};

export default BlockAssetContainer;
