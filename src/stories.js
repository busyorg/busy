import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { link } from '@storybook/addon-links';
import StartNow from '../src/components/Sidebar/StartNow';
import InterestingPeople from '../src/components/Sidebar/InterestingPeople';
import Topic from '../src/components/Button/Topic';
import Follow from '../src/components/Button/Follow';
import Topnav from './components/Navigation/Topnav';
import Sidenav from './components/Navigation/Sidenav';
import '../src/styles/common.less';

storiesOf('Button', module)
  .add('Topic', () => <Topic name="travel" />)
  .add('Favored topic', () => <Topic isFavorite name="photography" />)
  .add('Follow', () => <Follow />)
  .add('Followed', () => <Follow isFollowed />);

storiesOf('Navigation', module)
  .add('Topnav unlogged', () => <Topnav />)
  .add('Topnav logged', () => <Topnav username="guest123" />)
  .add('Sidenav', () => <Sidenav />);

storiesOf('Sidebar', module)
  .add('Start now', () => <StartNow />)
  .add('Interesting People', () => <InterestingPeople
    users={[
      { name: 'liondani', about: 'Inch by Inch, Play by Play' },
      { name: 'good-karma', about: '"Action expresses priorities!" / Witness - Developer of eSteem…' },
      { name: 'furion', about: 'I’ve developed SteemData and SteemSports. All things Python…' },
    ]}
  />);
