import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';

import ContentEditorContainer from './ContentEditorContainer'
import SectionEditorContainer from './SectionEditorContainer'

storiesOf('Peritext editor', module)
  .add('Content editor (default)', () => (
    <ContentEditorContainer />
  ))
  .add('Section editor (default)', () => (
    <SectionEditorContainer />
  ))