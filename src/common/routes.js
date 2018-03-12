import Wrapper, { NoHeaderWrapper } from '../client/Wrapper';

import Activity from '../client/activity/Activity';
import Bookmarks from '../client/bookmarks/Bookmarks';
import Discover from '../client/discover/Discover';
import Drafts from '../client/post/Write/Drafts';
import Editor from '../client/post/Write/Write';
import EmbedPostComments from '../client/embed-post-comments/EmbedPostComments';
import Error404 from '../client/statics/Error404';
import Invite from '../client/invite/Invite';
import Notifications from '../client/notifications/Notifications';
import Page from '../client/feed/Page';
import Post from '../client/post/Post';
import ProfileSettings from '../client/settings/ProfileSettings';
import Replies from '../client/replies/Replies';
import Search from '../client/search/Search';
import Settings from '../client/settings/Settings';
import User from '../client/user/User';
import UserActivity from '../client/activity/UserActivity';
import UserComments from '../client/user/UserComments';
import UserFeed from '../client/user/UserFeed';
import UserFollowers from '../client/user/UserFollowers';
import UserFollowing from '../client/user/UserFollowing';
import UserProfile from '../client/user/UserProfile';
import UserReblogs from '../client/user/UserReblogs';
import UserWallet from '../client/user/UserWallet';
import Wallet from '../client/wallet/Wallet';

const routes = [
  {
    component: NoHeaderWrapper,
    path: '/embed/comments/@:author/:permlink',
    exact: true,
    routes: [
      {
        path: '/embed/comments/@:author/:permlink',
        exact: true,
        component: EmbedPostComments,
      },
    ],
  },
  {
    component: Wrapper,
    routes: [
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
        path: '/invite',
        exact: true,
        component: Invite,
      },
      {
        path: '/notifications',
        exact: true,
        component: Notifications,
      },
      {
        path: '/@:name/(comments|followers|followed|reblogs|feed|transfers|activity)?',
        component: User,
        exact: true,
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
        path: '/:category?/@:author/:permlink',
        component: Post,
      },
      {
        path: '/search',
        component: Search,
      },
      {
        path: '/:sortBy(trending|created|active|hot|promoted)/:category?',
        component: Page,
      },
      {
        path: '/',
        exact: true,
        component: Page,
      },
      {
        path: '*',
        component: Error404,
      },
    ],
  },
];

export default routes;
