import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Icon } from 'antd';
import './Follow.less';

class Follow extends React.Component {
  static propTypes = {
    isFollowed: PropTypes.bool,
    pending: PropTypes.bool,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    isFollowed: false,
    pending: false,
    onClick: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
    };
  }

  handleClick = (e) => {
    e.preventDefault();
    if (this.props.pending) return;
    this.props.onClick(e);
  }

  onMouseOver = () => this.setState({ isHovered: true })

  onMouseOut = () => this.setState({ isHovered: false })

  render() {
    const { isFollowed, pending } = this.props;
    const { isHovered } = this.state;

    let followingText = 'Follow'; // default text
    if (isFollowed && !(isHovered || pending)) {
      followingText = 'Followed';
    } else if (isFollowed && isHovered && !pending) {
      followingText = 'Unfollow';
    } else if (isFollowed && pending) {
      followingText = 'Unfollowing';
    } else if (!isFollowed && isHovered && !pending) {
      followingText = 'Follow';
    } else if (!isFollowed && pending) {
      followingText = 'Following';
    }

    return (
      <button
        className={
          classNames('Follow', {
            'Follow--danger': isFollowed && (isHovered || pending),
          })
        }
        onClick={this.handleClick}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
      >
        {pending && <Icon type="loading" />}
        {followingText}
      </button>
    );
  }
}

export default Follow;
