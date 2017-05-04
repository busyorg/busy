import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Wrapper from './wrapper';
import Settings from './app/AppSettings';
import Page from './feed/Page';
import User from './user/User';
import Profile from './user/UserProfile';
import Followers from './user/UserFollowers';
import Following from './user/UserFollowing';
import Posts from './user/UserPosts';
import Reblogs from './user/UserReblogs';
import Replies from './user/UserReplies';
import Feed from './user/UserFeed';
import Transfers from './user/UserTransfers';
import Transfer from './wallet/Transfer';
import Tags from './tags/Tags';
import Donors from './statics/Donors';
import { Trending, Hot, Votes, Responses, Active, Created, Cashout } from './feed/PathMatching';
import PostSingle from './post/postSingle/PostSingle';
import Bookmarks from './bookmarks/Bookmarks';
import Error404 from './statics/Error404';
import Write from './post/Write/Write';
import Drafts from './post/Write/Drafts';
import About from './statics/About';
import Help from './statics/Help';
import Team from './statics/Team';
import RequireLogin from './auth/RequireLogin';

var MessagesUser = require('./messages/MessagesUser').default,
  MessagesCategory = require('./messages/MessagesCategory').default;

export default (
  <Route path="/" component={Wrapper}>
    <IndexRoute component={Page} />
    <Route path="/help" component={Help} />
    <Route path="/about" component={About} />
    <Route path="/team" component={Team} />
    <Route path="/tags" component={Tags} />
    <Route path="/donors" component={Donors} />
    <Route path="/trending(/:category)" component={Trending} />
    <Route path="/hot(/:category)" component={Hot} />
    <Route path="/cashout(/:category)" component={Cashout} />
    <Route path="/created(/:category)" component={Created} />
    <Route path="/active(/:category)" component={Active} />
    <Route path="/responses(/:category)" component={Responses} />
    <Route path="/votes(/:category)" component={Votes} />
    <Route component={RequireLogin}>
      <Route path="/transfer" component={Transfer} />
      <Route path="/messages/@:username" component={MessagesUser} />
      <Route path="/messages/:category" component={MessagesCategory} />
      <Route path="/bookmarks" component={Bookmarks} />
      <Route path="/write" component={Write} />
      <Route path="/drafts" component={Drafts} />
      <Route path="/settings" component={Settings} />
    </Route>
    <Route component={User}>
      <Route path="/@:name/reblogs" component={Reblogs} />
      <Route path="/@:name/posts" component={Posts} />
      <Route path="/@:name/feed" component={Feed} />
      <Route path="/@:name/replies" component={Replies} />
      <Route path="/@:name/followers" component={Followers} />
      <Route path="/@:name/followed" component={Following} />
      <Route path="/@:name/transfers" component={Transfers} />
      <Route path="/@:name" component={Profile} />
    </Route>
    <Route path="/:category/@:author/:permlink" component={PostSingle} />
    <Route path="/*" component={Error404} />
  </Route>
);
