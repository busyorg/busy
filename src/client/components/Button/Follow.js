import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import { Icon } from 'antd';
import './Follow.less';

export class FollowPure extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    isFollowed: PropTypes.bool,
    pending: PropTypes.bool,
    onClick: PropTypes.func,
    secondary: PropTypes.bool,
  };

  static defaultProps = {
    isFollowed: false,
    pending: false,
    secondary: false,
    onClick: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
    };
  }

  onMouseOver = () => this.setState({ isHovered: true });

  onMouseOut = () => this.setState({ isHovered: false });

  handleClick = e => {
    e.preventDefault();
    if (this.props.pending) return;
    this.props.onClick(e);
  };

  render() {
    const { intl, isFollowed, pending, secondary } = this.props;
    const { isHovered } = this.state;
    const isDangerStyles = isFollowed && (isHovered || pending);

    let followingText = intl.formatMessage({ id: 'follow', defaultMessage: 'Follow' });
    if (isFollowed && !(isHovered || pending)) {
      followingText = intl.formatMessage({ id: 'followed', defaultMessage: 'Following' });
    } else if (isFollowed && isHovered && !pending) {
      followingText = intl.formatMessage({ id: 'unfollow', defaultMessage: 'Unfollow' });
    } else if (isFollowed && pending) {
      followingText = intl.formatMessage({ id: 'unfollowing', defaultMessage: 'Unfollowing' });
    } else if (!isFollowed && isHovered && !pending) {
      followingText = intl.formatMessage({ id: 'follow', defaultMessage: 'Follow' });
    } else if (!isFollowed && pending) {
      followingText = intl.formatMessage({ id: 'followed', defaultMessage: 'Following' });
    }

    return (
      <button
        className={classNames('Follow', {
          'Follow--danger': isDangerStyles,
          'Follow--danger--secondary': isDangerStyles && secondary,
          'Follow--secondary': secondary,
        })}
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

export default injectIntl(FollowPure);
