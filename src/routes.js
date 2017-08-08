import React from 'react';

import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';
import { Route, Switch } from 'react-router-dom';
import Wrapper from './Wrapper';
import Settings from './app/AppSettings';

import Page from './feed/Page';
import User from './user/User';
import Transfer from './wallet/Transfer';
import Tags from './tags/Tags';
import Donors from './statics/Donors';
import Post from './post/Post';
import Bookmarks from './bookmarks/Bookmarks';
import About from './statics/About';
import Help from './statics/Help';
import Team from './statics/Team';
import Signup from './auth/Signup';
import Signin from './auth/Signin';
import Write from './post/Write/Write';
import Drafts from './post/Write/Drafts';
import RequireLogin from './auth/RequireLogin';

export default (
  <Wrapper>
    <Switch>
      <Route exact path="/" component={Page} />
      <Route path="/signin" component={Signin} />
      <Route path="/signup" component={Signup} />
      <Route path="/help" component={Help} />
      <Route path="/about" component={About} />
      <Route path="/team" component={Team} />
      <Route path="/tags" component={Tags} />
      <Route path="/donors" component={Donors} />
      <Route
        path="/transfer"
        render={() =>
          (<RequireLogin>
            <Transfer />
          </RequireLogin>)}
      />
      <Route
        path="/bookmarks"
        render={() =>
          (<RequireLogin>
            <Bookmarks />
          </RequireLogin>)}
      />
      <Route
        path="/write"
        render={() =>
          (<RequireLogin>
            <Write />
          </RequireLogin>)}
      />
      <Route
        path="/drafts"
        render={() =>
          (<RequireLogin>
            <Drafts />
          </RequireLogin>)}
      />
      <Route
        path="/settings"
        render={() =>
          (<RequireLogin>
            <Settings />
          </RequireLogin>)}
      />
      <Route path="/@:name" component={User} />
      <Route path="/:category/@:author/:permlink" component={Post} />
      <Route path="/" component={Page} />
    </Switch>
  </Wrapper>
);

export const history =
  typeof window === 'undefined' ? createMemoryHistory() : createBrowserHistory();
