import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';

import { getUserRank } from '../helpers/ranks';
import UserHeader from '../components/UserHeader';
import UserMenu from '../components/UserMenu';
import Hero from '../components/Hero';

@withRouter
class UserMenuWrapper extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
  };

  onChange = (key) => {
    const { match, history } = this.props;
    const section = key === 'discussions' ? '' : `/${key}`;
    history.push(`${match.url}${section}`);
  };

  render() {
    const { match, location, history, ...otherProps } = this.props;
    const current = this.props.location.pathname.split('/')[2];
    const currentKey = current || 'discussions';
    return <UserMenu defaultKey={currentKey} onChange={this.onChange} {...otherProps} />;
  }
}

const UserHero = ({
  authenticated,
  user,
  username,
  isSameUser,
}) =>
  (<div>
    <Switch>
      <Route
        path="/@:name"
        render={() =>
          (<div>
            <UserHeader
              authenticated={authenticated}
              username={username}
              handle={user.name}
              userReputation={user.reputation}
              rank={getUserRank(user.vesting_shares)}
              isSameUser={isSameUser}
            />
            <UserMenuWrapper
              discussions={user.post_count}
              comments={0}
              followers={user.follower_count}
              following={user.following_count}
            />
          </div>)}
      />
      <Route render={() => (authenticated ? <Hero /> : <div />)} />
    </Switch>
  </div>);

UserHero.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  user: PropTypes.shape().isRequired,
  username: PropTypes.string.isRequired,
  isSameUser: PropTypes.bool,
};

UserHero.defaultProps = {
  isSameUser: false,
};

export default UserHero;
