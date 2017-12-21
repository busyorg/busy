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
import Follow from '../components/Button/Follow';
import LoginModal from '../components/LoginModal';

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

    this.state = {
      displayLoginModal: false,
    };

    this.handleFollowClick = this.handleFollowClick.bind(this);
    this.displayLoginModal = this.displayLoginModal.bind(this);
    this.hideLoginModal = this.hideLoginModal.bind(this);
  }

  displayLoginModal() {
    this.setState({
      displayLoginModal: true,
    });
  }

  hideLoginModal() {
    this.setState({
      displayLoginModal: false,
    });
  }

  handleFollowClick() {
    const { username, authenticated } = this.props;
    const isFollowed = this.props.followingList.includes(username);

    if (!authenticated) {
      this.displayLoginModal();
      return;
    }

    if (isFollowed) {
      this.props.unfollowUser(username);
    } else {
      this.props.followUser(username);
    }
  }

  render() {
    const { authenticatedUserName, username, followingList, pendingFollows } = this.props;
    const { displayLoginModal } = this.state;
    const followed = followingList.includes(username);
    const pending = pendingFollows.includes(username);

    if (authenticatedUserName === username) return null;

    return [
      <Follow
        key="follow-button"
        isFollowed={followed}
        pending={pending}
        onClick={this.handleFollowClick}
      />,
      <LoginModal
        key="login-modal"
        visible={displayLoginModal}
        handleLoginModalCancel={this.hideLoginModal}
      />,
    ];
  }
}

export default FollowButton;
