import React from 'react';
import { Route, Switch } from 'react-router-dom';

import UserHeader from '../components/UserHeader';
import UserMenu from '../components/UserMenu';
import Hero from '../components/Hero';

const HeroHeader = ({ auth, style }) => (
  <div style={style}>
    <Switch>
      <Route
        path="/@:name"
        render={({ match }) => (
          <div>
            <UserHeader username={match.params.name} />
            <UserMenu />
          </div>
        )}
      />
      <Route render={() => (auth.user.name === undefined ? <Hero /> : <div />)} />
    </Switch>
  </div>
  );

export default HeroHeader;
