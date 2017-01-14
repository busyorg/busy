import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import Icon from './Icon';
import { followUser, unfollowUser } from '../user/userActions';
import TooltipOrigin from '../app/TooltipOrigin';

@connect(
  state => ({
    following: state.user.following,
    auth: state.auth,
  }),
  dispatch => bindActionCreators({
    followUser,
    unfollowUser,
  }, dispatch)
)
export default class FollowButton extends Component {
  static propTypes = {
    username: React.PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
  }

  onClickFollow = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const { following, username } = this.props;
    const isFollowing = following.list && following.list.includes(username);

    if (isFollowing) {
      this.props.unfollowUser(username);
    } else {
      this.props.followUser(username);
    }
  };

  render() {
    const { following, username, auth } = this.props;
    const isFollowing = following.list && following.list.includes(username);
    const hasFollow = auth.isAuthenticated && username !== auth.user.name;

    return (
      <span>
        { hasFollow &&
          <TooltipOrigin
            content={isFollowing ? `Unfollow ${username}` : `Follow ${username}`}
            active
            store={this.props.store}
          >
            <a
              className={classNames('trigger', { disabled: following.isFetching })}
              onClick={this.onClickFollow}
            >
              <Icon name={isFollowing ? 'person_outline' : 'person_add'} sm />
              { this.props.children }
            </a>
          </TooltipOrigin>
        }
      </span>
    );
  }
}
