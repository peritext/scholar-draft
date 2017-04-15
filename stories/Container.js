import React, { Component } from 'react';
import {
  EditorState,
  AtomicBlockUtils,
  Modifier,
  Entity,
  CompositeDecorator
} from 'draft-js';


import Editor from '../src/Editor';



const Image = (props) => {
  return (
<div style={{
  color: 'white',
  background: 'red',
  padding: '1rem'
}}>Image</div>
);
}
const Timeline = (props) => <div style={{
  color: 'white',
  background: 'red',
  padding: '1rem'
}}>Timeline</div>;
const Random = (props) => <div style={{
  color: 'white',
  background: 'red',
  padding: '1rem'
}}>Random</div>;

const blockTypes = {
  image: Image,
  timeline: Timeline,
  random: Random
};

const InlinePointer = ({
  children
}) => (
  <span style={{
    background: 'grey',
    color: 'white',
    padding: '5px'
  }}>
    {children}
  </span>
);

const NotePointer = ({
  children
}) => (
  <span style={{
    width: '1rem',
    height: '1rem',
    background: 'red',
    borderRadius: '50%',
    display: 'inline-block',
    marginLeft: '.5rem',
    marginRight: '.5rem'
  }}>
    {children}
  </span>
);

export default class Container extends Component {

  constructor(props) {
    super(props);

    const findInlineContextualizations = (contentBlock, callback, contentState) => {
      contentBlock.findEntityRanges(
        (character) => {
          const entityKey = character.getEntity();
          return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === 'inline'
          );
        },
        callback
      );
    }

    const findNotePointers = (contentBlock, callback, contentState) => {
      contentBlock.findEntityRanges(
        (character) => {
          const entityKey = character.getEntity();
          return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === 'note-pointer'
          );
        },
        callback
      );
    }

    const decorator = new CompositeDecorator([
      {
        strategy: findInlineContextualizations,
        component: InlinePointer,
      },
      {
        strategy: findNotePointers,
        component: NotePointer,
      },
    ]);
    this.state = {
      editorState: EditorState.createEmpty(decorator),
      contextualizationRequestType: undefined
    }
    this.onContextualizationRequest = (type) => {
      this.setState({
        contextualizationRequestType: type
      });
    };
    this.insertContextualization = (insertionType, contextualizationType) => {
      const newEntityKey = Entity.create(
        insertionType,
        insertionType === 'block' ? 'IMMUTABLE': 'MUTABLE',
        {
          insertionType,
          type: contextualizationType
        }
      );
      const currentContent = this.state.editorState.getCurrentContent();
      const selection = this.state.editorState.getSelection();
      let UpdatedEditor;
      if (insertionType === 'block') {
        UpdatedEditor = AtomicBlockUtils.insertAtomicBlock(
          this.state.editorState,
          newEntityKey,
          ' '
        );
      } else {
        const anchorKey = selection.getAnchorKey();
        const currentContentBlock = currentContent.getBlockForKey(anchorKey);
        const start = selection.getStartOffset();
        const end = selection.getEndOffset();
        let selectedText = currentContentBlock.getText().slice(start, end);
        let newContentState;
        if (selectedText.length > 0) {
          newContentState = Modifier.applyEntity(
            currentContent,
            selection,
            newEntityKey
          );
        } else {
          selectedText = contextualizationType;

          newContentState = Modifier.replaceText(
            currentContent,
            selection,
            selectedText,
            null,// inlineStyle?: DraftInlineStyle,
            newEntityKey
          );
        }
        const endSelection = selection.merge({
          anchorOffset: selection.getEndOffset() + selectedText.length,
          focusOffset: selection.getEndOffset() + selectedText.length,
        });
        newContentState = Modifier.replaceText(
          newContentState,
          endSelection,
          '  ',
          null,
          null
        );
        UpdatedEditor = EditorState.push(this.state.editorState, newContentState, 'apply-entity');
      }
      this.setState({
        editorState: UpdatedEditor
      });
    }

    this.addNoteAtCursorPosition = () => {
      console.log('add note');
      const noteId = 'test';
      const newEntityKey = Entity.create(
        'note-pointer',
        'IMMUTABLE',
        {
          noteId
        }
      );
      const currentContent = this.state.editorState.getCurrentContent();
      const selection = this.state.editorState.getSelection();
      let UpdatedEditor;
      const anchorKey = selection.getAnchorKey();
      const currentContentBlock = currentContent.getBlockForKey(anchorKey);
      const start = selection.getStartOffset();
      const end = selection.getEndOffset();
      let selectedText = currentContentBlock.getText().slice(start, end);
      let newContentState;
      if (selectedText.length > 0) {
        newContentState = Modifier.applyEntity(
          currentContent,
          selection,
          newEntityKey
        );
      } else {
        selectedText = ' ';

        newContentState = Modifier.replaceText(
          currentContent,
          selection,
          selectedText,
          null,// inlineStyle?: DraftInlineStyle,
          newEntityKey
        );
      }
      const endSelection = selection.merge({
        anchorOffset: selection.getEndOffset() + selectedText.length,
        focusOffset: selection.getEndOffset() + selectedText.length,
      });
      newContentState = Modifier.replaceText(
        newContentState,
        endSelection,
        '  ',
        null,
        null
      );
      UpdatedEditor = EditorState.push(this.state.editorState, newContentState, 'apply-entity');
      this.setState({
        editorState: UpdatedEditor
      });
    }
  }

  render() {
    const {
      insertContextualization,
      state
    } = this;
    const {
      contextualizationRequestType,
    } = state;
    const onGlobalClick = (e) => {
      e.stopPropagation();
      if (contextualizationRequestType) {
        this.setState({
          contextualizationRequestType: undefined
        })
      }
    }
    return (
      <div 
        className="container"
        style={{
          padding: '3rem',
          paddingLeft: '35%',
          paddingRight: '35%'
        }}
        onClick={onGlobalClick}
      >
        <div style={{
          position: 'fixed',
          left: '1rem',
          top: '1rem',
          width: '20%'
        }}>
          {
            contextualizationRequestType !== undefined &&
            (contextualizationRequestType === 'block' ?
                        <div className="block-contextualization-choices-container">
                          <button onClick={() => insertContextualization('block', 'image')}>Contextualize an image</button>
                          <button onClick={() => insertContextualization('block', 'timeline')}>Contextualize a timeline</button>
                          <button onClick={() => insertContextualization('block', 'random')}>Contextualize a random block</button>
                        </div>
                        :
                        <div className="  inline-contextualization-choices-container">
                          <button onClick={() => insertContextualization('inline', 'citation')}>Contextualize a citation</button>
                        </div>)
          }
        </div>
        <Editor 
          placeholder="Write your content..." 
          blockTypes={blockTypes}
          onChange={(editorState) => this.setState({ editorState })}
          onContextualizationRequest={this.onContextualizationRequest}
          onNoteAdd={this.addNoteAtCursorPosition}
          editorState={this.state.editorState}
        />
      </div>
    );
  }
}