import React from 'react';
import { Route, Switch } from 'react-router-dom';

import UserInfo from './UserInfo';
import Navigation from './Navigation';
import NavigationUser from './NavigationUser';

const LeftSidebar = () => (
  <Switch>
    <Route path="/@:name/wallet" component={Navigation} />
    <Route path="/@:name" component={UserInfo} />
    <Route path="/activity" component={NavigationUser} />
    <Route path="/replies" component={NavigationUser} />
    <Route path="/bookmarks" component={NavigationUser} />
    <Route path="/drafts" component={NavigationUser} />
    <Route path="/edit-profile" component={NavigationUser} />
    <Route path="/settings" component={NavigationUser} />
    <Route path="/" component={Navigation} />
  </Switch>
);

export default LeftSidebar;
