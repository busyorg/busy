// NOTE: storybook installs to devDependencies and it should stay there
/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { MemoryRouter } from 'react-router';
import { addDecorator, storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { IntlProvider } from 'react-intl';
import getTranslations from '../translations';
import { post, postWithEmbed, postState, notifications } from './data/index';
import StartNow from '../components/Sidebar/StartNow';
import Topics from '../components/Sidebar/Topics';
import InterestingPeople from '../components/Sidebar/InterestingPeople';
import LatestComments from '../components/Sidebar/LatestComments';
import Topic from '../components/Button/Topic';
import Follow from '../components/Button/Follow';
import Action from '../components/Button/Action';
import Topnav from '../components/Navigation/Topnav';
import Sidenav from '../components/Navigation/Sidenav';
import Story from '../components/Story/Story';
import StoryLoading from '../components/Story/StoryLoading';
import StoryFull from '../components/Story/StoryFull';
import UserMenu from '../components/UserMenu';
import UserHeader from '../components/UserHeader';
import Comments from '../components/Comments/Comments';
import Editor from '../components/Editor/Editor';
import TopicSelector from '../components/TopicSelector';
import '../styles/common.less';

addDecorator(story =>
  (<MemoryRouter initialEntries={['/']}>
    <IntlProvider locale="en" messages={getTranslations('en')}>
      <div style={{ padding: '40px', background: '#f9f9f9' }}>
        {story()}
      </div>
    </IntlProvider>
  </MemoryRouter>),
);

const rootComments = Object.keys(postState.content)
  .filter(key => postState.content[key].depth === 1)
  .map(commentKey => postState.content[commentKey]);

const commentsChildren = {};
Object.keys(postState.content).forEach((key) => {
  commentsChildren[postState.content[key].id] = postState.content[key].replies.map(
    childrenId => postState.content[childrenId],
  );
});

storiesOf('Button', module)
  .add('Topic', () => <Topic name="travel" />)
  .add('Favored topic', () => <Topic favorite name="photography" />)
  .add('Closable topic', () => <Topic closable name="travel" onClose={action('Close')} />)
  .add('Follow', () => <Follow />)
  .add('Followed', () => <Follow isFollowed />)
  .add('Action', () => <Action text="Transfer" />);

storiesOf('Navigation', module)
  .add('Topnav unlogged', () => <Topnav />)
  .add('Topnav logged', () =>
    (<Topnav
      username="guest123"
      notifications={notifications}
      onNotificationClick={action('Notification click')}
      onSeeAllClick={action('SeeAll click')}
      onMenuItemClick={action('Menu item click')}
    />),
  )
  .add('Sidenav unlogged', () => <Sidenav />)
  .add('Sidenav logged', () => <Sidenav username="guest123" />);

storiesOf('Sidebar', module)
  .add('Start now', () => <StartNow />)
  .add('Favorite topics', () =>
    <Topics favorite topics={['funny', 'history', 'nature']} />,
  )
  .add('Trending topics', () =>
    (<Topics
      topics={['photography', 'steemit', 'introduceyourself', 'steem', 'story', 'blog']}
    />),
  )
  .add('Interesting People', () =>
    (<InterestingPeople
      users={[
        { name: 'liondani', about: 'Inch by Inch, Play by Play' },
        {
          name: 'good-karma',
          about: '"Action expresses priorities!" / Witness - Developer of eSteem…',
        },
        { name: 'furion', about: 'I’ve developed SteemData and SteemSports. All things Python…' },
      ]}
    />),
  )
  .add('Latest Comments', () =>
    (<LatestComments
      comments={[
        {
          id: '100a',
          author: 'ekitcho',
          text:
            'Great stuff. Looking forward to it. Although, here are a few things I feel we need to address.',
          created: '2017-06-07T17:26:21',
        },
        {
          id: '100b',
          author: 'fabien',
          text: 'Thank you so much for sharing this post',
          created: '2017-06-07T19:32:44',
        },
        {
          id: '100c',
          author: 'itsyogesh',
          text: 'Ahh, I wish I heard that earlier',
          created: '2017-06-07T19:32:44',
        },
      ]}
    />),
  );

storiesOf('Story', module)
  .add('Story loading', () => <StoryLoading />)
  .add('Inline story', () =>
    (<Story
      post={post}
      onFollowClick={action('Follow click')}
      onSaveClick={action('Save click')}
      onReportClick={action('Report click')}
      onLikeClick={action('Like click')}
      onCommentClick={action('Comment click')}
      onShareClick={action('Share click')}
    />),
  )
  .add('Inline story with embed', () =>
    (<Story
      post={postWithEmbed}
      onFollowClick={action('Follow click')}
      onSaveClick={action('Save click')}
      onReportClick={action('Report click')}
      onLikeClick={action('Like click')}
      onCommentClick={action('Comment click')}
      onShareClick={action('Share click')}
    />),
  )
  .add('Full story', () =>
    (<StoryFull
      post={post}
      commentCount={Object.keys(postState.content).length}
      onFollowClick={action('Follow click')}
      onSaveClick={action('Save click')}
      onReportClick={action('Report click')}
      onLikeClick={action('Like click')}
      onCommentClick={action('Comment click')}
      onShareClick={action('Share click')}
    />),
  )
  .add('Full story with embed', () =>
    (<StoryFull
      post={postWithEmbed}
      commentCount={Object.keys(postState.content).length}
      onFollowClick={action('Follow click')}
      onSaveClick={action('Save click')}
      onReportClick={action('Report click')}
      onLikeClick={action('Like click')}
      onCommentClick={action('Comment click')}
      onShareClick={action('Share click')}
    />),
  );

storiesOf('Profile', module)
  .add('UserHeader', () => <UserHeader username="roelandp" authenticated={false} />)
  .add('UserMenu', () =>
    (<UserMenu
      discussions={1521}
      comments={21}
      following={244}
      onChange={action('Section changed')}
    />),
  );

storiesOf('Comments', module).add('Comments', () =>
  (<Comments
    authenticated={false}
    user={{}}
    comments={rootComments}
    commentsChildren={commentsChildren}
    onLikeClick={action('Like click')}
    onDislikeClick={action('Dislike click')}
  />),
);

storiesOf('Editor', module).add('Editor', () =>
  (<Editor
    onSubmit={action('Form submit')}
    onError={action('Form error')}
    onImageInserted={(image, callback) => {
      // NOTE: Upload image to server.
      setTimeout(() => callback('https://placehold.it/200x200'), 500);
    }}
  />),
);

storiesOf('Topic selector', module).add('Topic selector', () =>
  (<TopicSelector
    topics={['photography', 'travel']}
    onTopicClose={action('Topic close')}
    onSortChange={action('Sort change')}
  />),
);
