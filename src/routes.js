import React from 'react';

import { Route, Switch } from 'react-router-dom';
import Wrapper from './wrapper';
import Settings from './app/AppSettings';

import Page from './feed/Page';
import User, { needs as UserNeeds } from './user/User';
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
import Signup from './auth/Signup';
import Signin from './auth/Signin';
import Login from './auth/Login';
import RequireLogin from './auth/RequireLogin';
import MessagesUser from './messages/MessagesUser';
import MessagesCategory from './messages/MessagesCategory';

export const UserRoutes = () =>
  (<Switch>
    <Route exact path="/@:name" render={() => <User><Profile /></User>} />
    <Route path="/@:name/reblogs" render={() => <User><Reblogs /></User>} />
    <Route path="/@:name/posts" render={() => <User><Posts /></User>} />
    <Route path="/@:name/feed" render={() => <User><Feed /></User>} />
    <Route path="/@:name/replies" render={() => <User><Replies /></User>} />
    <Route path="/@:name/followers" render={() => <User><Followers /></User>} />
    <Route path="/@:name/followed" render={() => <User><Following /></User>} />
    <Route path="/@:name/transfers" render={() => <User><Transfers /></User>} />
  </Switch>);

UserRoutes.needs = UserNeeds;

export default (
  <Wrapper>
    <Switch>
      <Route exact path="/" component={Page} />
      {/* <Route path="/login" component={Login} />*/}
      <Route path="/signin" component={Signin} />
      <Route path="/signup" component={Signup} />
      <Route path="/help" component={Help} />
      <Route path="/about" component={About} />
      <Route path="/team" component={Team} />
      <Route path="/tags" component={Tags} />
      <Route path="/donors" component={Donors} />
      <Route path="/trending/:category?" component={Trending} />
      <Route path="/hot/:category?" component={Hot} />
      <Route path="/cashout/:category?" component={Cashout} />
      <Route path="/created/:category?" component={Created} />
      <Route path="/active/:category?" component={Active} />
      <Route path="/responses/:category?" component={Responses} />
      <Route path="/votes/:category?" component={Votes} />
      <Route path="/transfer" render={() => <RequireLogin><Transfer /></RequireLogin>} />
      <Route
        path="/messages/@:username"
        render={() => <RequireLogin><MessagesUser /></RequireLogin>}
      />
      <Route
        path="/messages/:category"
        render={() => <RequireLogin><MessagesCategory /></RequireLogin>}
      />
      <Route path="/bookmarks" render={() => <RequireLogin><Bookmarks /></RequireLogin>} />
      <Route path="/write" render={() => <RequireLogin><Write /></RequireLogin>} />
      <Route path="/drafts" render={() => <RequireLogin><Drafts /></RequireLogin>} />
      <Route path="/settings" render={() => <RequireLogin><Settings /></RequireLogin>} />
      <Route path="/@:name" component={UserRoutes} />
      <Route path="/:category/@:author/:permlink" component={PostSingle} />
      <Route path="/*" component={Error404} />
    </Switch>
  </Wrapper>
);
