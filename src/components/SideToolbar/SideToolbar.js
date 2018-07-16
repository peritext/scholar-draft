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
    allowAssets: PropTypes.shape({
      inline: PropTypes.bool,
      block: PropTypes.bool
    }),

    AssetChoiceComponent: PropTypes.func,
    AssetButtonComponent: PropTypes.func,
    NoteButtonComponent: PropTypes.func,
    onNoteAdd: PropTypes.func,
    onAssetChoice: PropTypes.func,
    onAssetRequest: PropTypes.func,
    onAssetRequestCancel: PropTypes.func,

  };

  shouldComponentUpdate = (nextProps, nextState) => (
    this.props.editorState !== nextProps.editorState ||
      this.props.assetRequestPosition !== nextProps.assetRequestPosition ||
      this.props.allowNotesInsertion !== nextProps.allowNotesInsertion ||
      this.props.AssetButtonComponent !== nextProps.AssetButtonComponent ||
      this.props.style !== nextProps.style
  )

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
        // inline: true,
        // block: true
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

    const onAssetButtonClick = (event) => {
      event.stopPropagation();
      if (assetRequestPosition) {
        onAssetRequestCancel();
      } else {
        const currentSelection = editorState && editorState.getSelection();
        onAssetRequest(currentSelection);
      }
    };

    const bindToolbar = (toolbar) => {
      this.toolbar = toolbar;
    };
    const stopEventPropagation = event => event.stopPropagation();
    const assetSelectorActive = assetRequestPosition !== undefined;


    const AssetButton = AssetButtonComponent || DefaultAssetButton;
    const NoteButton = NoteButtonComponent || DefaultNoteButton;

    return (
      <div
        className="scholar-draft-SideToolbar"
        ref={bindToolbar}
        style={style}
      >
        {allowNotesInsertion && !assetRequestPosition &&
        <NoteButton 
          onClick={onNoteAdd} 
          iconMap={iconMap}
          message={messages && messages.addNote}
        />
        }
        {(allowAssets.inline || allowAssets.block) && 
        <AssetButton 
          onClick={onAssetButtonClick} 
          active={assetSelectorActive}
          iconMap={iconMap}
          message={
            messages &&
            assetSelectorActive ? 
              messages.cancel : 
              messages.summonAsset
          }
        />}
        {assetRequestPosition &&
          <span
            className="block-asset-choice-container" 
            onClick={stopEventPropagation}
          >
            <AssetChoiceComponent
              {...assetChoiceProps}
              contentId={contentId}
              onAssetChoice={onAssetChoice}
              onAssetRequestCancel={onAssetRequestCancel}
              onAssetChoiceFocus={onAssetChoiceFocus}

            />
          </span>
        }
      </div>
    );
  }
}
