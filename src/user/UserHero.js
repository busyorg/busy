import React, { PropTypes } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

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

const UserHero = ({ auth, user, username, isSameUser, isFollowed, pendingFollow, onFollowClick }) =>
  (<div>
    <Switch>
      <Route
        path="/@:name"
        render={() =>
          (<div>
            <UserHeader
              auth={auth}
              username={username}
              handle={user.name}
              isSameUser={isSameUser}
              isFollowed={isFollowed}
              pendingFollow={pendingFollow}
              onFollowClick={onFollowClick}
            />
            <UserMenuWrapper
              discussions={user.post_count}
              comments={0}
              followers={user.follower_count}
              following={user.following_count}
            />
          </div>)}
      />
      <Route render={() => (auth.user.name === undefined ? <Hero /> : <div />)} />
    </Switch>
  </div>);

UserHero.propTypes = {
  auth: PropTypes.shape().isRequired,
  user: PropTypes.shape().isRequired,
  username: PropTypes.string.isRequired,
  isSameUser: PropTypes.bool,
  isFollowed: PropTypes.bool,
  pendingFollow: PropTypes.bool,
  onFollowClick: PropTypes.func,
};

UserHero.defaultProps = {
  isSameUser: false,
  isFollowed: false,
  pendingFollow: false,
  onFollowClick: () => {},
};

export default UserHero;
