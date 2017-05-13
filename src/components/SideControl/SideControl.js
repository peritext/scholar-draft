import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AssetButton from '../ToolbarButtons/AssetButton';
import NoteButton from '../ToolbarButtons/NoteButton';

import {
  INLINE_ASSET,
  BLOCK_ASSET
} from '../../constants';
  
import './SideControl.scss';

export default class SideControl extends Component {

  static propTypes = {
    onImageClick: PropTypes.func,
    toggleBlockType: PropTypes.func,
    selectedBlockType: PropTypes.string,
  };

  static defaultProps = {
    iconColor: '#000000',
    iconSelectedColor: '#2000FF',
  };

  state = {
    canAddBlockAsset: true 
  };

  render = () => {

    const { 
      iconColor, 
      iconSelectedColor, 
      popoverStyle, 
      buttons,
      editorState,
      updateEditorState,
      onAssetRequest,
      onNoteAdd,
      allowAssets = {
        // inline: true,
        // block: true
      },
      allowNotesInsertion = false
            
    } = this.props;

    const {
      canAddBlockAsset
    } = this.state;

    const handleFigureClick = () => {
      const currentSelection = editorState && editorState.getSelection();
      onAssetRequest(currentSelection);
    };

    const bindToolbar = (toolbar) => {
      this.toolbar = toolbar;
    };
    return (
      <div
        className="scholar-draft-SideControl"
        ref={bindToolbar}
      >

        {allowNotesInsertion && 
        <NoteButton onClick={onNoteAdd} />
        }
        {(allowAssets.inline || allowAssets.block) && 
        <AssetButton onClick={handleFigureClick} />}
      </div>
    );
  }
}
