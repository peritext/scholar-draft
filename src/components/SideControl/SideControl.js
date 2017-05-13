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
    toggleBlockType: PropTypes.func,
    selectedBlockType: PropTypes.string,
  };

  render = () => {

    const { 
      buttons,
      editorState,
      onAssetRequest,
      onNoteAdd,
      allowAssets = {
        // inline: true,
        // block: true
      },
      allowNotesInsertion = false
            
    } = this.props;

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
