import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook'; // eslint-disable-line
import Button from './Button';
import Welcome from './Welcome';
import NeverWrotePost from '../src/components/NeverWrotePost';
import TopicTag from '../src/components/TopicTag';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')} />
  ));

storiesOf('RightSideBarHelper', module)
  .add('Never Wrote Post', () => (
    <NeverWrotePost />
  ));

storiesOf('LeftSideBar', module)
  .add('Favorite Topic', () => (
    <TopicTag isFavorite name="Favorite Topic" />
  ))
  .add('Normal Topic', () => (
    <TopicTag name="normal topic" />
  ));

storiesOf('Button', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ));
