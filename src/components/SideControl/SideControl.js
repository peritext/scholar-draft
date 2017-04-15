import React, { Component } from 'react';
import MoreOptions from './MoreOptions';
import PropTypes from 'prop-types';

  
const styles = {
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 999,
  }
};


export default class SideControl extends Component {

  static propTypes = {
    style: PropTypes.object,
    onImageClick: PropTypes.func,
    toggleBlockType: PropTypes.func,
    selectedBlockType: PropTypes.string,

		/**
		 * The icon fill colour
		 */
    iconColor: PropTypes.string,

		/**
		 * The icon fill colour when selected
		 */
    iconSelectedColor: PropTypes.string,

    /**
     * Override the inline styles for the popover component.
     */
    popoverStyle: PropTypes.object,

    /**
     * Override the block buttons.
     */
    buttons: PropTypes.array,
  };

  static defaultProps = {
    iconColor: '#000000',
    iconSelectedColor: '#2000FF',
  };

  state = {
    moreOptionsVisible: false,
    canAddBlockContextualization: true 
  };

	// componentWillReceiveProps = (nextProps) => {
	// 	const currentSelection = nextProps.editorState && nextProps.editorState.getSelection();
	// 	if (currentSelection) {
	// 		const contentState = nextProps.editorState.getCurrentContent();
	// 		const selectedBlock = contentState.getBlockForKey(currentSelection.getAnchorKey());
	// 		if (selectedBlock && 
	// 			selectedBlock.getText().length === 0 &&
	// 			!this.state.canAddBlockContextualization
	// 		) {
	// 			return this.setState({
	// 				canAddBlockContextualization: true
	// 			});
	// 		}
	// 	}
	// 	if (this.state.canAddBlockContextualization) {
	// 		this.setState({
	// 			canAddBlockContextualization: false
	// 		})
	// 	}
	// }

  render = () => {

    const { 
			iconColor, 
			iconSelectedColor, 
			popoverStyle, 
			buttons,
			editorState,
			updateEditorState,
			onFigureClick,
			onNoteAdd
		} = this.props;

    const {
			canAddBlockContextualization
		} = this.state;

    const handleFigureClick = () => {
      const currentSelection = editorState && editorState.getSelection();
      let insertionType = 'block;';
      if (currentSelection) {
        const contentState = editorState.getCurrentContent();
        const selectedBlock = contentState.getBlockForKey(currentSelection.getAnchorKey());
        if (selectedBlock && 
					selectedBlock.getText().length > 0
				) {
          insertionType = 'inline';
        } else {
          insertionType = 'block';
        }
      }
      onFigureClick(insertionType);
    };


    return (
      <div
        style={Object.assign({}, styles.container, this.props.style)}
      >
      	<span 
          style={{ cursor: 'pointer' }}
          onMouseDown={e => e.preventDefault()}
          onClick={onNoteAdd}
        >
          +note
        </span>
        {canAddBlockContextualization && <svg 
          style={{ cursor: 'pointer' }}
          onMouseDown={e => e.preventDefault()}
          onClick={handleFigureClick}
          fill={iconColor} height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>}
			
        <div 
          style={{ display: 'inline-block', cursor: 'pointer' }}
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
            fill={iconColor} height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
          <MoreOptions 
            style={Object.assign({}, popoverStyle, {
              display: this.state.moreOptionsVisible ? 'block' : 'none',
            })}
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
