import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getImage from '../helpers/getImage';
import './Avatar.less';

const defaultImage =
  'https://res.cloudinary.com/hpiynhbhq/image/upload/v1506948447/p72avlprkfariyti7q2l.png';

class Avatar extends Component {
  static propTypes = {
    username: PropTypes.string,
    size: PropTypes.number,
  };

  static defaultProps = {
    username: undefined,
    size: 34,
  };

  state = {
    imageUrl: defaultImage,
  };

  componentWillMount() {
    const { username, size } = this.props;

    this.setState({
      imageUrl: getImage(`@${username}?s=${size}`),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.username !== nextProps.username) {
      this.setState({
        imageUrl: getImage(`@${nextProps.username}?s=${nextProps.size}`),
      });
    }
  }

  onError = () =>
    this.setState({
      imageUrl: defaultImage,
    });

  render() {
    const { username, size } = this.props;
    const { imageUrl } = this.state;

    return (
      <img
        className="Avatar"
        style={{ minWidth: `${size}px`, width: `${size}px`, height: `${size}px` }}
        onError={this.onError}
        alt={username}
        src={imageUrl}
      />
    );
  }
}

export default Avatar;
