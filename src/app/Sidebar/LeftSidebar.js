import React from 'react';
import { Route, Switch } from 'react-router-dom';

import UserInfo from './UserInfo';
import Navigation from './Navigation';
import SidenavReplies from '../../components/Navigation/SidenavReplies';

const LeftSidebar = () => (
  <Switch>
    <Route path="/@:name" component={UserInfo} />
    <Route path="/replies" component={SidenavReplies} />
    <Route path="/" component={Navigation} />
  </Switch>
);

export default LeftSidebar;
