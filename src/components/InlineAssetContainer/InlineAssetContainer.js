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
    getAssetComponent: PropTypes.func,
  }

  constructor( props ) {
    super( props );
    this.state = {
      
    };
  }

  componentDidMount() {
    const { entityKey, contentState } = this.props;
    const { getAssetComponent } = this.context;
    const entity = contentState.getEntity( entityKey );
    const { asset: entityAsset } = entity.getData();
    let asset;
    let assetId;
    let AssetComponent;
    if ( entityAsset ) {
      const { id } = entityAsset;
      assetId = id;
      asset = this.context.assets[assetId];
      AssetComponent = getAssetComponent( assetId );
    }
    this.setState( {
      asset,
      assetId,
      renderingMode: this.props.renderingMode,
      AssetComponent,
    } );
    this.unsubscribeToAssets = this.context.emitter.subscribeToAssets( ( assets ) => {
      const newAsset = assets[this.state.assetId];
      AssetComponent = this.context.getAssetComponent( newAsset );
      if ( newAsset !== this.state.asset ) {
        this.setState( {
          asset: newAsset,
          AssetComponent,
        } );
      }
    } );

    this.unsubscribeToCustomContext = this.context
      .emitter.subscribeToCustomContext( ( customContext ) => {
        if ( customContext !== this.state.customContext ) {
          this.setState( {
            customContext
          } );
        }
      } );

    this.unsubscribeToRenderingMode = this.context.emitter
      .subscribeToRenderingMode( ( renderingMode ) => {
        if ( this.state.renderingMode !== renderingMode ) {
          this.setState( {
            renderingMode
          } );
        }
      } );
  }

  componentWillUnmount() {
    this.unsubscribeToAssets();
    this.unsubscribeToRenderingMode();
    this.unsubscribeToCustomContext();
  }

  render = () => {
    const {
      asset,
      assetId,
      renderingMode,
      customContext,
      AssetComponent
    } = this.state;
    if ( !asset ) {
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
      children
    } = this.props;

    if ( !AssetComponent ) {
      return null;
    }

    const onMOver = ( event ) => {
      event.stopPropagation();
      if ( typeof onMouseOver === 'function' ) {
        onAssetMouseOver( asset.id, asset, event );
      }
    };

    const onMOut = ( event ) => {
      event.stopPropagation();
      if ( typeof onMouseOut === 'function' ) {
        onAssetMouseOut( asset.id, asset, event );
      }
    };

    return (
      <span
        className={ 'scholar-draft-InlineAssetContainer' }
        onMouseOver={ onMOver }
        onFocus={ onMOver }
        onMouseOut={ onMOut }
        onBlur={ onMOut }
      >
        <AssetComponent
          assetId={ assetId }
          asset={ asset }
          customContext={ customContext }
          onAssetChange={ onAssetChange }
          onAssetFocus={ onAssetFocus }
          onAssetBlur={ onAssetBlur }
          iconMap={ iconMap }
          renderingMode={ renderingMode }
        >
          {children}
        </AssetComponent>
      </span>
    );
  }
}

InlineAssetContainer.propTypes = {
  children: PropTypes.array,
  assetId: PropTypes.string,
  AssetComponent: PropTypes.oneOfType( [
    PropTypes.func,
    PropTypes.element
  ] ),

  renderingMode: PropTypes.string,

};

export default InlineAssetContainer;
