import React, { PropTypes } from 'react';
import classNames from 'classnames';
import './Follow.less';

class Follow extends React.Component {
  static propTypes = {
    isFollowed: PropTypes.bool,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    isFollowed: false,
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
    this.props.onClick(e);
  }

  onMouseOver = () => this.setState({ isHovered: true })

  onMouseOut = () => this.setState({ isHovered: false })

  render() {
    const { isFollowed } = this.props;
    const { isHovered } = this.state;

    const followingText = (isHovered ? 'Unfollow' : 'Following');

    return (
      <button
        className={
          classNames({
            Follow: !isFollowed || (isFollowed && !isHovered),
            'Follow--danger': isFollowed && isHovered,
          })
        }
        onClick={this.handleClick}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
      >
        {isFollowed
          ? followingText
          : 'Follow'
        }
      </button>
    );
  }
}

export default Follow;
