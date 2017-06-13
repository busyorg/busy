import React, { PropTypes } from 'react';
import './Follow.less';

class Follow extends React.Component {
  static propTypes = {
    isFollowed: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
    };
  }

  onMouseOver = () => this.setState({ isHovered: true })

  onMouseOut = () => this.setState({ isHovered: false })

  render() {
    const { isFollowed } = this.props;
    const { isHovered } = this.state;

    const followingText = (isHovered ? 'Unfollow' : 'Following');

    return (
      <button className="Follow" onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
        {isFollowed
          ? followingText
          : 'Follow'
        }
      </button>
    );
  }
}

export default Follow;
