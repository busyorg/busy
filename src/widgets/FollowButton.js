import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getFollowingList,
  getPendingFollows,
} from '../reducers';
import { followUser, unfollowUser } from '../user/userActions';

import Follow from '../components/Button/Follow';

@connect(state => ({
  followingList: getFollowingList(state),
  pendingFollows: getPendingFollows(state),
}), {
  followUser,
  unfollowUser,
})
class FollowButton extends React.Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    followingList: PropTypes.arrayOf(PropTypes.string).isRequired,
    pendingFollows: PropTypes.arrayOf(PropTypes.string).isRequired,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
  };

  static defaultProps = {
    getAccountWithFollowingCount: () => {},
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
    const { username, followingList, pendingFollows } = this.props;
    const followed = followingList.includes(username);
    const pending = pendingFollows.includes(username);

    return <Follow isFollowed={followed} pending={pending} onClick={this.handleFollowClick} />;
  }
}

export default FollowButton;
