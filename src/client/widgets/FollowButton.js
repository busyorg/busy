import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAuthenticatedUserName, getFollowingList, getPendingFollows } from '../reducers';
import { followUser, unfollowUser } from '../user/userActions';
import withAuthAction from '../auth/withAuthActions';
import Follow from '../components/Button/Follow';

@withAuthAction
@connect(
  state => ({
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
    secondary: PropTypes.bool,
    username: PropTypes.string.isRequired,
    authenticatedUserName: PropTypes.string,
    followingList: PropTypes.arrayOf(PropTypes.string).isRequired,
    pendingFollows: PropTypes.arrayOf(PropTypes.string).isRequired,
    onActionInitiated: PropTypes.func.isRequired,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
  };

  static defaultProps = {
    secondary: false,
    authenticatedUserName: undefined,
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
    const {
      authenticatedUserName,
      username,
      followingList,
      pendingFollows,
      secondary,
    } = this.props;
    const followed = followingList.includes(username);
    const pending = pendingFollows.includes(username);

    if (authenticatedUserName === username) return null;

    return (
      <Follow
        isFollowed={followed}
        pending={pending}
        onClick={this.handleFollowClick}
        secondary={secondary}
      />
    );
  }
}

export default FollowButton;
