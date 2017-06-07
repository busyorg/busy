import React from 'react';
import { Route, Switch } from 'react-router-dom';
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
import Signup from './auth/Signup';
import Login from './auth/Login';
import RequireLogin from './auth/RequireLogin';
import MessagesUser from './messages/MessagesUser';
import MessagesCategory from './messages/MessagesCategory';

const renderMergedProps = (component, passableProps, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return React.createElement(component, { passableProps, ...finalProps });
};

const PropsRoute = ({ component, passableProps, ...rest }) =>
  <Route
    {...rest}
    render={routeProps => renderMergedProps(component, passableProps, routeProps, rest)}
  />;

const PropsSwitch = ({ children, ...restProps }) =>
  <Switch>
    {React.Children.map(children, route =>
      React.cloneElement(route, {
        ...restProps,
        key: route.path || Math.random(),
        passableProps: restProps
      })
    )}
  </Switch>;

const UserRoutes = ({ passableProps }) =>
  <User>
    <PropsSwitch {...passableProps}>
      <PropsRoute exact path="/@:name" component={Profile} />
      <PropsRoute path="/@:name/reblogs" component={Reblogs} />
      <PropsRoute path="/@:name/posts" component={Posts} />
      <PropsRoute path="/@:name/feed" component={Feed} />
      <PropsRoute path="/@:name/replies" component={Replies} />
      <PropsRoute path="/@:name/followers" component={Followers} />
      <PropsRoute path="/@:name/followed" component={Following} />
      <PropsRoute path="/@:name/transfers" component={Transfers} />
    </PropsSwitch>
  </User>;

const wrapWith = (parent, child) => ({ passableProps }) =>
  React.createElement(parent, passableProps, React.createElement(child));

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
      <PropsRoute path="/transfer" component={wrapWith(RequireLogin, Transfer)} />
      <PropsRoute path="/messages/@:username" component={wrapWith(RequireLogin, MessagesUser)} />
      <PropsRoute path="/messages/:category" component={wrapWith(RequireLogin, MessagesCategory)} />
      <PropsRoute path="/bookmarks" component={wrapWith(RequireLogin, Bookmarks)} />
      <PropsRoute path="/write" component={wrapWith(RequireLogin, Write)} />
      <PropsRoute path="/drafts" component={wrapWith(RequireLogin, Drafts)} />
      <PropsRoute path="/settings" component={wrapWith(RequireLogin, Settings)} />
      <PropsRoute path="/@:name" component={UserRoutes} />
      <PropsRoute path="/:category/@:author/:permlink" component={PostSingle} />
      <Route path="/*" component={Error404} />
    </PropsSwitch>
  </Wrapper>
);
