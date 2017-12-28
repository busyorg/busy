import React from 'react';
import { Route, Switch } from 'react-router-dom';

import UserInfo from './UserInfo';
import Navigation from './Navigation';
import SidenavUser from '../../components/Navigation/SidenavUser';

const LeftSidebar = () => (
  <Switch>
    <Route path="/@:name/wallet" component={Navigation} />
    <Route path="/@:name" component={UserInfo} />
    <Route path="/activity" component={SidenavUser} />
    <Route path="/replies" component={Navigation} />
    <Route path="/bookmarks" component={SidenavUser} />
    <Route path="/drafts" component={SidenavUser} />
    <Route path="/edit-profile" component={SidenavUser} />
    <Route path="/settings" component={SidenavUser} />
    <Route path="/invite" component={SidenavUser} />
    <Route path="/" component={Navigation} />
  </Switch>
);

export default LeftSidebar;
