import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AssetButton from '../ToolbarButtons/AssetButton';
import NoteButton from '../ToolbarButtons/NoteButton';
  
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

    allowNotesInsertion: PropTypes.bool,
    allowAssets: PropTypes.shape({
      inline: PropTypes.bool,
      block: PropTypes.bool
    }),

    AssetChoiceComponent: PropTypes.func,
    onNoteAdd: PropTypes.func,
    onAssetChoice: PropTypes.func,
    onAssetRequest: PropTypes.func,
    onAssetRequestCancel: PropTypes.func,

  };

  shouldComponentUpdate = (nextProps, nextState) => (
      this.props.editorState !== nextProps.editorState ||
      this.props.assetRequestPosition !== nextProps.assetRequestPosition ||
      this.props.allowNotesInsertion !== nextProps.allowNotesInsertion ||
      this.props.style !== nextProps.style
    )

  render = () => {

    const { 
      editorState,
      contentId,
      onAssetRequest,
      onAssetRequestCancel,
      onAssetChoice,
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
          message={messages && messages.tooltips && messages.tooltips.addNote}
        />
        }
        {(allowAssets.inline || allowAssets.block) && 
        <AssetButton 
          onClick={onAssetButtonClick} 
          active={assetSelectorActive}
          iconMap={iconMap}
          message={
            messages && messages.tooltips && 
            assetSelectorActive ? 
              messages.tooltips.cancel : 
              messages.tooltips.addAsset
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
            />
          </span>
        }
      </div>
    );
  }
}
