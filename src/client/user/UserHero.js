import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import UserHeader from '../components/UserHeader';
import UserHeaderLoading from '../components/UserHeaderLoading';
import UserMenu from '../components/UserMenu';
import Hero from '../components/Hero';
import { getGlobalProperties } from '../globalproperties/globalPropertiesActions';
import { getGlobalPropertiesTime } from '../reducers';

const activityFields = [
  'last_owner_update',
  'last_account_update',
  'last_vote_time',
  'last_account_recovery',
  'last_post',
  'last_root_post',
];

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

// eslint-disable-next-line react/no-multi-comp
@connect(
  state => ({
    time: getGlobalPropertiesTime(state),
  }),
  {
    getGlobalProperties,
  },
)
class UserHero extends React.Component {
  static propTypes = {
    getGlobalProperties: PropTypes.func.isRequired,
    authenticated: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    username: PropTypes.string.isRequired,
    isSameUser: PropTypes.bool,
    coverImage: PropTypes.string,
    hasCover: PropTypes.bool,
    isFollowing: PropTypes.bool,
    onTransferClick: PropTypes.func,
    time: PropTypes.string,
  };

  static defaultProps = {
    isSameUser: false,
    coverImage: '',
    hasCover: false,
    isFollowing: false,
    isPopoverVisible: false,
    time: '1970-01-01T00:00:00',
    onTransferClick: () => {},
  };

  componentDidMount() {
    this.props.getGlobalProperties();
  }

  render() {
    const {
      authenticated,
      user,
      username,
      isSameUser,
      coverImage,
      hasCover,
      isFollowing,
      onTransferClick,
      time,
    } = this.props;
    return (
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
                    isFollowing={isFollowing}
                    onTransferClick={onTransferClick}
                    isActive={() =>
                      activityFields.some(
                        field => Date.parse(time) - Date.parse(user[field]) < 5 * 60 * 1000,
                      )
                    }
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
  }
}

export default UserHero;
