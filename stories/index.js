import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';

import BasicEditorExample from './BasicEditorExample'
import EditorExample from './EditorExample'

import noteExample from './mocks/notes-example';

storiesOf('Peritext Scholarly editor', module)
  .add('Basic editor (without footnotes support)', () => (
    <BasicEditorExample />
  ))
  .add('Complete editor (with footnotes support) - with big content', () => (
    <EditorExample />
  ))
  .add('Complete editor (with footnotes support) - empty', () => (
    <EditorExample empty />
  ))
    .add('Complete editor (with footnotes support) - notes focus example', () => (
    <EditorExample startingData={noteExample} />
  ))