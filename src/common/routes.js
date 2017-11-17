import Wrapper from '../client/Wrapper';

import About from '../client/statics/About';
import Team from '../client/statics/Team';
import Donors from '../client/statics/Donors';
import Help from '../client/statics/Help';

import Bookmarks from '../client/bookmarks/Bookmarks';
import Drafts from '../client/post/Write/Drafts';
import Replies from '../client/replies/Replies';
import Activity from '../client/activity/Activity';
import Wallet from '../client/wallet/Wallet';
import Editor from '../client/post/Write/Write';
import Settings from '../client/settings/Settings';
import ProfileSettings from '../client/app/ProfileSettings';
import User from '../client/user/User';
import Post from '../client/post/Post';
import Page from '../client/feed/Page';

const routes = [
  {
    component: Wrapper,
    routes: [
      {
        path: '/about',
        exact: true,
        component: About,
      },
      {
        path: '/team',
        exact: true,
        component: Team,
      },
      {
        path: '/donors',
        exact: true,
        component: Donors,
      },
      {
        path: '/help',
        exact: true,
        component: Help,
      },
      {
        path: '/bookmarks',
        exact: true,
        component: Bookmarks,
      },
      {
        path: '/drafts',
        exact: true,
        component: Drafts,
      },
      {
        path: '/replies',
        exact: true,
        component: Replies,
      },
      {
        path: '/activity',
        exact: true,
        component: Activity,
      },
      {
        path: '/wallet',
        exact: true,
        component: Wallet,
      },
      {
        path: '/editor',
        component: Editor,
      },
      {
        path: '/settings',
        exact: true,
        component: Settings,
      },
      {
        path: '/edit-profile',
        exact: true,
        component: ProfileSettings,
      },
      {
        path: '/@:name',
        component: User,
      },
      {
        path: '/:category/@:author/:permlink',
        component: Post,
      },
      {
        path: '/',
        component: Page,
      },
    ],
  },
];

export default routes;
