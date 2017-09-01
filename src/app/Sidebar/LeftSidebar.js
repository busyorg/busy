import React from 'react';
import { Route, Switch } from 'react-router-dom';

import UserInfo from './UserInfo';
import Navigation from './Navigation';

const LeftSidebar = () => (
  <Switch>
    <Route path="/@:name" component={UserInfo} />
    <Route path="/" component={Navigation} />
  </Switch>
);

export default LeftSidebar;
