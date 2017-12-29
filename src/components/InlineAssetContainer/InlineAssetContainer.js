/* eslint react/no-did-mount-set-state : 0 */
/**
 * This module exports a wrapper for block assets.
 * It handles context-related interactions with upstream environment
 * and provides a simple prop-based api to the asset components passed
 * at editor's implementation
 * @module scholar-draft/BlockAssetContainer
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './InlineAssetContainer.scss';

class InlineAssetContainer extends Component {

  static contextTypes = {
    emitter: PropTypes.object,
    assets: PropTypes.object,
    iconMap: PropTypes.object,

    renderingMode: PropTypes.string,

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
      asset: this.context.assets[this.props.assetId],
      renderingMode: this.props.renderingMode
    });
    this.unsubscribe = this.context.emitter.subscribeToAssets((assets) => {
      const asset = assets[this.props.assetId];
      this.setState({
        asset
      });
    });

    this.unsubscribeToRenderingMode = this.context.emitter
      .subscribeToRenderingMode((renderingMode) => {
        this.setState({
          renderingMode
        });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.unsubscribeToRenderingMode();
  }

  render = () => {
    const {
      asset,
      renderingMode
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
      assetId,
      AssetComponent,
      children
    } = this.props;


    if (!AssetComponent) {
      return null;
    }

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
      <span
        className="scholar-draft-InlineAssetContainer"
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
          renderingMode={renderingMode}
        />
        <span>{children}</span>
      </span>
    );
  }
}

InlineAssetContainer.propTypes = {
  children: PropTypes.array,
  assetId: PropTypes.string,
  AssetComponent: PropTypes.func,

  renderingMode: PropTypes.string,
};

export default InlineAssetContainer;
