import React, { PropTypes } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import UserHeader from '../components/UserHeader';
import UserMenu from '../components/UserMenu';
import Hero from '../components/Hero';

class UserMenuImpl extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
  };

  onChange = (key) => {
    const { match, history } = this.props;
    const section = (key === 'discussions') ? '' : `/${key}`;
    history.push(`${match.url}${section}`);
  }

  render() {
    const current = this.props.location.pathname.split('/')[2];
    const currentKey = current || 'discussions';
    return <UserMenu defaultKey={currentKey} onChange={this.onChange} />;
  }
}

const UserMenuWrapper = withRouter(UserMenuImpl);

const HeroHeader = ({ auth, style }) => (
  <div style={style}>
    <Switch>
      <Route
        path="/@:name"
        render={({ match }) => (
          <div>
            <UserHeader username={match.params.name} />
            <UserMenuWrapper />
          </div>
        )}
      />
      <Route render={() => (auth.user.name === undefined ? <Hero /> : <div />)} />
    </Switch>
  </div>);

export default HeroHeader;
