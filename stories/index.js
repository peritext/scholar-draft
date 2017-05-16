import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';

import ContentEditorContainer from './ContentEditorContainer'
import SectionEditorContainer from './SectionEditorContainer'

storiesOf('Scholarly editor', module)
  .add('Simple editor (without footnotes support)', () => (
    <ContentEditorContainer />
  ))
  .add('Complete editor (with footnotes support)', () => (
    <SectionEditorContainer />
  ))