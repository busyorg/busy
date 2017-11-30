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
import UserProfile from '../client/user/UserProfile';
import UserComments from '../client/user/UserComments';
import UserFollowers from '../client/user/UserFollowers';
import UserFollowing from '../client/user/UserFollowing';
import UserReblogs from '../client/user/UserReblogs';
import UserFeed from '../client/user/UserFeed';
import UserWallet from '../client/user/UserWallet';
import UserActivity from '../client/activity/UserActivity';
import Post from '../client/post/Post';
import Page from '../client/feed/Page';
import Discover from '../client/discover/Discover';
import Witnesses from '../client/witnesses/Witnesses';

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
        path: '/~witnesses',
        exact: true,
        component: Witnesses,
      },
      {
        path: '/@:name',
        component: User,
        routes: [
          {
            path: '/@:name',
            exact: true,
            component: UserProfile,
          },
          {
            path: '/@:name/comments',
            exact: true,
            component: UserComments,
          },
          {
            path: '/@:name/followers',
            exact: true,
            component: UserFollowers,
          },
          {
            path: '/@:name/followed',
            exact: true,
            component: UserFollowing,
          },
          {
            path: '/@:name/reblogs',
            exact: true,
            component: UserReblogs,
          },
          {
            path: '/@:name/feed',
            exact: true,
            component: UserFeed,
          },
          {
            path: '/@:name/transfers',
            exact: true,
            component: UserWallet,
          },
          {
            path: '/@:name/activity',
            exact: true,
            component: UserActivity,
          },
        ],
      },
      {
        path: '/discover',
        exact: true,
        component: Discover,
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
