import React, { Component } from 'react';
import MoreOptions from './MoreOptions';
import PropTypes from 'prop-types';

  
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
    moreOptionsVisible: false,
    canAddBlockContextualization: true 
  };

  render = () => {

    const { 
      iconColor, 
      iconSelectedColor, 
      popoverStyle, 
      buttons,
      editorState,
      updateEditorState,
      onContextualizationClick,
      onNoteAdd,
      allowContextualizations = {
        // inline: true,
        // block: true
      },
      allowNotesInsertion = false
            
    } = this.props;

    const {
      canAddBlockContextualization
    } = this.state;

    const handleFigureClick = () => {
      const currentSelection = editorState && editorState.getSelection();
      let insertionType = 'blockContextualization;';
      if (currentSelection) {
        const contentState = editorState.getCurrentContent();
        const selectedBlock = contentState.getBlockForKey(currentSelection.getAnchorKey());
        if (selectedBlock && 
          selectedBlock.getText().length > 0
        ) {
          insertionType = 'inlineContextualization';
        } else {
          insertionType = 'blockContextualization';
        }
      }
      onContextualizationClick(insertionType, currentSelection);
    };

    const bindToolbar = (toolbar) => {
      this.toolbar = toolbar;
    };

    return (
      <div
        className="SideControl"
        ref={bindToolbar}
      >

        {allowNotesInsertion && <span 
          style={{ cursor: 'pointer' }}
          onMouseDown={e => e.preventDefault()}
          onClick={onNoteAdd}
        >
          +n
        </span>}
        {(allowContextualizations.inline || allowContextualizations.block) && 
        <span 
          style={{ cursor: 'pointer' }}
          onMouseDown={e => e.preventDefault()}
          onClick={handleFigureClick}
        >
          +c
        </span>}
			
        <div 
          onMouseOut={(e) => {
            this.setState({
              moreOptionsVisible: false,
            });
          }}
          onMouseOver={(e) => {
            this.setState({
              moreOptionsVisible: true,
            });
          }}
          className="DraftJsEditor-more-options"
        >
          <svg 
            onMouseDown={e => e.preventDefault()}
            fill={iconColor} 
            height="24" 
            viewBox="0 0 24 24" 
            width="24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
          <MoreOptions 
            style={{ display: this.state.moreOptionsVisible ? 'block' : 'none' }}
            toggleBlockType={this.props.toggleBlockType}
            selectedBlockType={this.props.selectedBlockType}
            iconSelectedColor={iconSelectedColor}
            iconColor={iconColor}
            buttons={buttons}
            editorState={editorState}
            updateEditorState={updateEditorState}
          />
        </div>
      </div>
    );
  }
}
