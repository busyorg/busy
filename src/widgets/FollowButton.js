import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getAuthenticatedUserName,
  getFollowingList,
  getPendingFollows,
} from '../reducers';
import { followUser, unfollowUser } from '../user/userActions';

import Follow from '../components/Button/Follow';

@connect(state => ({
  authenticatedUserName: getAuthenticatedUserName(state),
  followingList: getFollowingList(state),
  pendingFollows: getPendingFollows(state),
}), {
  followUser,
  unfollowUser,
})
class FollowButton extends React.Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    authenticatedUserName: PropTypes.string,
    followingList: PropTypes.arrayOf(PropTypes.string).isRequired,
    pendingFollows: PropTypes.arrayOf(PropTypes.string).isRequired,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
  };

  static defaultProps = {
    authenticatedUserName: undefined,
    followUser: () => {},
    unfollowUser: () => {},
  };

  handleFollowClick = () => {
    const { username } = this.props;
    const isFollowed = this.props.followingList.includes(username);
    if (isFollowed) {
      this.props.unfollowUser(username);
    } else {
      this.props.followUser(username);
    }
  };

  render() {
    const { authenticatedUserName, username, followingList, pendingFollows } = this.props;
    const followed = followingList.includes(username);
    const pending = pendingFollows.includes(username);

    if (authenticatedUserName === username) return null;

    return <Follow isFollowed={followed} pending={pending} onClick={this.handleFollowClick} />;
  }
}

export default FollowButton;
