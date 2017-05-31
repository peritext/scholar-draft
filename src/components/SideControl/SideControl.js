import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AssetButton from '../ToolbarButtons/AssetButton';
import NoteButton from '../ToolbarButtons/NoteButton';
  
import './SideControl.scss';

export default class SideControl extends Component {

  static propTypes = {
    editorState: PropTypes.object,
    assetChoiceProps: PropTypes.object,
    
    iconMap: PropTypes.object,
    assetRequestPosition: PropTypes.object,

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
      this.props.allowNotesInsertion !== nextProps.allowNotesInsertion
    )

  render = () => {

    const { 
      editorState,
      onAssetRequest,
      onAssetRequestCancel,
      onAssetChoice,
      assetChoiceProps = {},
      onNoteAdd,
      allowAssets = {
        // inline: true,
        // block: true
      },
      iconMap,
      assetRequestPosition,

      AssetChoiceComponent,

      allowNotesInsertion = false
            
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
    return (
      <div
        className="scholar-draft-SideControl"
        ref={bindToolbar}
      >
        {allowNotesInsertion &&
        <NoteButton 
          onClick={onNoteAdd} 
          iconMap={iconMap}
        />
        }
        {(allowAssets.inline || allowAssets.block) && 
        <AssetButton 
          onClick={onAssetButtonClick} 
          active={assetRequestPosition !== undefined}
          iconMap={iconMap}
        />}
        {assetRequestPosition &&
          <span
            className="block-asset-choice-container" 
            onClick={stopEventPropagation}
          >
            <AssetChoiceComponent
              {...assetChoiceProps}
              onAssetChoice={onAssetChoice}
              onAssetRequestCancel={onAssetRequestCancel}
            />
          </span>
        }
      </div>
    );
  }
}
