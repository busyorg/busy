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

  constructor(props) {
    super(props);

    this.state = {
      loadFailed: false,
    };

    this.onError = this.onError.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.username !== nextProps.username) {
      this.setState({
        loadFailed: false,
      });
    }
  }

  onError() {
    this.setState({
      loadFailed: true,
    });
  }

  render() {
    const { username, size } = this.props;
    const { loadFailed } = this.state;

    return (
      <img
        className="Avatar"
        style={{ minWidth: `${size}px`, width: `${size}px`, height: `${size}px` }}
        onError={this.onError}
        alt={username}
        src={loadFailed ? defaultImage : getImage(`@${username}?s=${size}`)}
      />
    );
  }
}

export default Avatar;
