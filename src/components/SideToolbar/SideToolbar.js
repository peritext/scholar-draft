/**
 * This module exports a react component for editors' side tool bar
 * @module scholar-draft/SideToolbar
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DefaultAssetButton from '../ToolbarButtons/AssetButton';
import DefaultNoteButton from '../ToolbarButtons/NoteButton';
  
import './SideToolbar.scss';

export default class SideToolbar extends Component {

  static propTypes = {
    editorState: PropTypes.object,
    assetChoiceProps: PropTypes.object,
    contentId: PropTypes.string,

    iconMap: PropTypes.object,
    assetRequestPosition: PropTypes.object,

    style: PropTypes.object,

    messages: PropTypes.object,

    onAssetChoiceFocus: PropTypes.func,

    allowNotesInsertion: PropTypes.bool,
    allowAssets: PropTypes.shape( {
      inline: PropTypes.bool,
      block: PropTypes.bool
    } ),

    AssetChoiceComponent: PropTypes.func,
    AssetButtonComponent: PropTypes.func,
    NoteButtonComponent: PropTypes.func,
    onNoteAdd: PropTypes.func,
    onAssetChoice: PropTypes.func,
    onAssetRequest: PropTypes.func,
    onAssetRequestCancel: PropTypes.func,
    containerDimensions: PropTypes.object,

  };

  constructor( props ) {
    super( props );
    this.state = {
      assetChoiceStyle: undefined
    };
  }

  shouldComponentUpdate = ( nextProps, nextState ) => (
    this.props.editorState !== nextProps.editorState ||
      this.props.assetRequestPosition !== nextProps.assetRequestPosition ||
      this.props.allowNotesInsertion !== nextProps.allowNotesInsertion ||
      this.props.AssetButtonComponent !== nextProps.AssetButtonComponent ||
      this.props.style !== nextProps.style ||
      this.state.assetChoiceStyle !== nextState.assetChoiceStyle
  )

  componentDidUpdate = () => {
    setTimeout( () => {
      const { containerDimensions } = this.props;
      let assetChoiceStyle;
      if (
        this.assetChoiceComponent 
        && this.assetButton 
        && this.assetButton.element 
        && this.assetChoiceComponent.element 
        && containerDimensions
      ) {
        const { width, height } = this.assetChoiceComponent.element.getBoundingClientRect();
        const {
          x: btnX, /* eslint id-length : 0 */
          y: btnY, /* eslint id-length : 0 */
          width: assetButtonWidth, 
          height: assetButtonHeight 
        } = this.assetButton.element.getBoundingClientRect();
        const rightExtremity = btnX + assetButtonWidth + width;
        const bottomExtremity = btnY + height;
        const rightBoundary = containerDimensions.x + containerDimensions.width;
        const bottomBoundary = containerDimensions.y + containerDimensions.height;

        if (
          // (
          rightExtremity > rightBoundary 
          && bottomExtremity > bottomBoundary

        /*
         * )
         * ||
         * (
         *   rightExtremity > rightBoundary 
         *   && bottomExtremity + (assetButtonHeight * 2) + height > bottomBoundary
         * )
         */
        ) {
          assetChoiceStyle = {
            left: -( width + assetButtonWidth ),
            top: -( assetButtonHeight + height ),
          };
        }
        else if ( rightExtremity > rightBoundary ) {
          assetChoiceStyle = {
            left: -( width + assetButtonWidth ),
            top: assetButtonWidth,
          };
        }
        else if ( bottomExtremity > bottomBoundary ) {
          assetChoiceStyle = {
            // left: -(width + assetButtonWidth * 2),
            top: -( assetButtonHeight + height ),
          };
        }
      }
      if (
        !(
          this.state.assetChoiceStyle === assetChoiceStyle 
            || 
            (
              this.state.assetChoiceStyle 
              && assetChoiceStyle 
              && JSON.stringify( this.state.assetChoiceStyle ) === JSON.stringify( assetChoiceStyle ) )
        )
      ) {
        this.setState( { assetChoiceStyle } );
      }
    }, 500 );
  }

  render = () => {

    const { 
      editorState,
      contentId,
      onAssetRequest,
      onAssetRequestCancel,
      onAssetChoice,
      onAssetChoiceFocus,
      assetChoiceProps = {},
      onNoteAdd,
      allowAssets = {

        /*
         * inline: true,
         * block: true
         */
      },
      messages,
      iconMap,
      assetRequestPosition,

      AssetChoiceComponent,
      AssetButtonComponent,
      NoteButtonComponent,

      allowNotesInsertion = false,
      style,
            
    } = this.props;

    const {
      assetChoiceStyle
    } = this.state;

    const onAssetButtonClick = ( event ) => {
      event.stopPropagation();
      if ( assetRequestPosition ) {
        onAssetRequestCancel();
      }
      else {
        const currentSelection = editorState && editorState.getSelection();
        onAssetRequest( currentSelection );
      }
    };

    const bindToolbar = ( toolbar ) => {
      this.toolbar = toolbar;
    };
    const bindAssetChoiceComponentRef = ( assetChoiceComponent ) => {
      this.assetChoiceComponent = assetChoiceComponent;
    };
    const bindAssetButton = ( assetButton ) => {
      this.assetButton = assetButton;
    };
    const stopEventPropagation = ( event ) => event.stopPropagation();
    const assetSelectorActive = assetRequestPosition !== undefined;

    const AssetButton = AssetButtonComponent || DefaultAssetButton;
    const NoteButton = NoteButtonComponent || DefaultNoteButton;

    return (
      <div
        className={ 'scholar-draft-SideToolbar' }
        ref={ bindToolbar }
        style={ style }
      >
        {allowNotesInsertion && !assetRequestPosition &&
        <NoteButton 
          onClick={ onNoteAdd } 
          iconMap={ iconMap }
          message={ messages && messages.addNote }
        />
        }
        {( allowAssets.inline || allowAssets.block ) && 
        <AssetButton 
          onClick={ onAssetButtonClick } 
          active={ assetSelectorActive }
          iconMap={ iconMap }
          ref={ bindAssetButton }
          message={
            messages &&
            assetSelectorActive ? 
              messages.cancel : 
              messages.summonAsset
          }
        />}
        {assetRequestPosition &&
          <span
            className={ 'block-asset-choice-container' } 
            onClick={ stopEventPropagation }
            style={ assetChoiceStyle }
          >
            <AssetChoiceComponent
              { ...assetChoiceProps }
              ref={ bindAssetChoiceComponentRef }
              contentId={ contentId }
              onAssetChoice={ onAssetChoice }
              onAssetRequestCancel={ onAssetRequestCancel }
              onAssetChoiceFocus={ onAssetChoiceFocus }
            />
          </span>
        }
      </div>
    );
  }
}
