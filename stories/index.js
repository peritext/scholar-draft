import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';

import Container from './Container'
import ContentEditorContainer from './ContentEditorContainer'

storiesOf('Peritext editor', module)
  .add('Content editor (default)', () => (
    <ContentEditorContainer />
  ))
  .add('Default', () => (
    <Container />
  ))