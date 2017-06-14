import React from 'react';
import { Route, Switch } from 'react-router-dom';

import UserHeader from '../components/UserHeader';
import Hero from '../components/Hero';

const HeroHeader = ({ auth, style }) => (
  <div style={style}>
    <Switch>
      <Route path="/@:name" render={({ match }) => <UserHeader username={match.params.name} />} />
      <Route render={() => (auth.user.name === undefined ? <Hero /> : <div />)} />
    </Switch>
  </div>
  );

export default HeroHeader;
