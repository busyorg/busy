import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import Wrapper from './wrapper';
// import Settings from './app/AppSettings';

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
import Signup from './auth/Signup';
import Login from './auth/Login';
import RequireLogin from './auth/RequireLogin';
import Sidebars from './app/Sidebar';
import MessagesUser from './messages/MessagesUser';
import MessagesCategory from './messages/MessagesCategory';

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return React.createElement(component, finalProps);
};

const PropsRoute = ({ component, ...rest }) =>
  <Route {...rest} render={routeProps => renderMergedProps(component, routeProps, rest)} />;

const PropsSwitch = ({ children, ...restProps }) =>
  <Switch>
    {children.map(route => React.cloneElement(route, restProps))}
  </Switch>;

const Test = () => <div>Testttt</div>;

export default (
  <Wrapper>
    <PropsSwitch>
      <PropsRoute exact path="/" component={Page} />
      <PropsRoute path="/login" component={Login} />
      <PropsRoute path="/signup" component={Signup} />
      <PropsRoute path="/help" component={Help} />
      <PropsRoute path="/about" component={About} />
      <PropsRoute path="/team" component={Team} />
      <PropsRoute path="/tags" component={Tags} />
      <PropsRoute path="/donors" component={Donors} />
      <PropsRoute path="/trending/:category?" component={Trending} />
      <PropsRoute path="/hot/:category?" component={Hot} />
      <PropsRoute path="/cashout/:category?" component={Cashout} />
      <PropsRoute path="/created/:category?" component={Created} />
      <PropsRoute path="/active/:category?" component={Active} />
      <PropsRoute path="/responses/:category?" component={Responses} />
      <PropsRoute path="/votes/:category?" component={Votes} />
      {/*
      <PropsRoute component={RequireLogin}>
        <PropsRoute path="/transfer" component={Transfer} />
        <PropsRoute path="/messages/@:username" component={MessagesUser} />
        <PropsRoute path="/messages/:category" component={MessagesCategory} />
        <PropsRoute path="/bookmarks" component={Bookmarks} />
        <PropsRoute path="/write" component={Write} />
        <PropsRoute path="/drafts" component={Drafts} />
        <PropsRoute path="/settings" component={Settings} />
      </PropsRoute>
      */}
      {/* <Route path="/@:name" component={UsersRoute} />*/}
      {/* </Route>*/}
      {/* <User>*/}
      <PropsRoute path="/@:name" component={User}>
        {/* <PropsRoute path="/@:name/reblogs" component={Test} />*/}
        {/* <PropsRoute path="/@:name/posts" component={Posts} />*/}
        {/* <PropsRoute path="/@:name/feed" component={Feed} />*/}
        {/* <PropsRoute path="/@:name/replies" component={Replies} />*/}
        {/* <PropsRoute path="/@:name/followers" component={Followers} />*/}
        {/* <PropsRoute path="/@:name/followed" component={Following} />*/}
        {/* <PropsRoute path="/@:name/transfers" component={Transfers} />*/}
        <PropsRoute exact path="/@:name" component={Profile} />
      </PropsRoute>
      {/* </User>*/}

      <Route path="/:category/@:author/:permlink" component={PostSingle} />
      <Route component={Error404} />
    </PropsSwitch>
  </Wrapper>
);

/* export default (
  <Route path="/" component={Wrapper}>
    <IndexRoute component={Page} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
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
);*/
