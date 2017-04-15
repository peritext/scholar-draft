import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';

import Container from './Container'

storiesOf('Peritext editor', module)
  .add('Default', () => (
    <Container />
  ))