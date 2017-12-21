import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getAuthenticatedUserName,
  getFollowingList,
  getIsAuthenticated,
  getPendingFollows,
} from '../reducers';
import { followUser, unfollowUser } from '../user/userActions';
import withAuthAction from '../auth/withAuthActions';
import Follow from '../components/Button/Follow';

@withAuthAction
@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUserName: getAuthenticatedUserName(state),
    followingList: getFollowingList(state),
    pendingFollows: getPendingFollows(state),
  }),
  {
    followUser,
    unfollowUser,
  },
)
class FollowButton extends React.Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    authenticated: PropTypes.bool,
    authenticatedUserName: PropTypes.string,
    followingList: PropTypes.arrayOf(PropTypes.string).isRequired,
    pendingFollows: PropTypes.arrayOf(PropTypes.string).isRequired,
    onActionInitiated: PropTypes.func.isRequired,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
  };

  static defaultProps = {
    authenticatedUserName: undefined,
    authenticated: false,
    followUser: () => {},
    unfollowUser: () => {},
  };

  constructor(props) {
    super(props);

    this.handleFollowClick = this.handleFollowClick.bind(this);
    this.followClick = this.followClick.bind(this);
  }

  followClick() {
    const { username } = this.props;
    const isFollowed = this.props.followingList.includes(username);

    if (isFollowed) {
      this.props.unfollowUser(username);
    } else {
      this.props.followUser(username);
    }
  }

  handleFollowClick() {
    this.props.onActionInitiated(this.followClick);
  }

  render() {
    const { authenticatedUserName, username, followingList, pendingFollows } = this.props;
    const followed = followingList.includes(username);
    const pending = pendingFollows.includes(username);

    if (authenticatedUserName === username) return null;

    return <Follow isFollowed={followed} pending={pending} onClick={this.handleFollowClick} />;
  }
}

export default FollowButton;
