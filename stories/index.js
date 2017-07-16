import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';

import BasicEditorExample from './BasicEditorExample'
import EditorExample from './EditorExample'

storiesOf('Peritext Scholarly editor', module)
  .add('Basic editor (without footnotes support)', () => (
    <BasicEditorExample />
  ))
  .add('Complete editor (with footnotes support)', () => (
    <EditorExample />
  ))