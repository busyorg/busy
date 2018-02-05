import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';

import UserHeader from '../components/UserHeader';
import UserHeaderLoading from '../components/UserHeaderLoading';
import UserMenu from '../components/UserMenu';
import Hero from '../components/Hero';

@withRouter
class UserMenuWrapper extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
  };

  onChange = key => {
    const { match, history } = this.props;
    const section = key === 'discussions' ? '' : `/${key}`;
    history.push(`${match.url.replace(/\/$/, '')}${section}`);
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
  coverImage,
  hasCover,
  isPopoverVisible,
  onSelect,
  handleVisibleChange,
  isFollowing,
}) => (
  <div>
    <Switch>
      <Route
        path="/@:name"
        render={() => (
          <div>
            {user.fetching ? (
              <UserHeaderLoading />
            ) : (
              <UserHeader
                username={username}
                handle={user.name}
                userReputation={user.reputation}
                vestingShares={parseFloat(user.vesting_shares)}
                isSameUser={isSameUser}
                coverImage={coverImage}
                hasCover={hasCover}
                isPopoverVisible={isPopoverVisible}
                onSelect={onSelect}
                handleVisibleChange={handleVisibleChange}
                isFollowing={isFollowing}
              />
            )}
            <UserMenuWrapper followers={user.follower_count} following={user.following_count} />
          </div>
        )}
      />
      <Route render={() => (authenticated ? <Hero /> : <div />)} />
    </Switch>
  </div>
);

UserHero.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  user: PropTypes.shape().isRequired,
  username: PropTypes.string.isRequired,
  isSameUser: PropTypes.bool,
  coverImage: PropTypes.string,
  hasCover: PropTypes.bool,
  isFollowing: PropTypes.bool,
  isPopoverVisible: PropTypes.bool,
  onSelect: PropTypes.func,
  handleVisibleChange: PropTypes.func,
};

UserHero.defaultProps = {
  isSameUser: false,
  coverImage: '',
  hasCover: false,
  isFollowing: false,
  isPopoverVisible: false,
  onSelect: () => {},
  handleVisibleChange: () => {},
};

export default UserHero;
