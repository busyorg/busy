import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Avatar.less';

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
      imgUrl: `${process.env.IMG_HOST}/@${props.username || 'steemconnect'}?s=${props.size}`,
    };
  }

  onError = () => {
    this.setState({
      imgUrl: 'https://res.cloudinary.com/hpiynhbhq/image/fetch/s--hWKFE2sA--/c_fill,h_200,w_200/http://res.cloudinary.com/hpiynhbhq/image/upload/v1501526513/avatar_juzb7o.png',
    });
  };

  render() {
    const { username, size } = this.props;
    const { imgUrl } = this.state;

    return (
      <img
        className="Avatar"
        style={{ minWidth: `${size}px`, width: `${size}px`, height: `${size}px` }}
        onError={this.onError}
        alt={username}
        src={imgUrl}
      />
    );
  }
}

export default Avatar;
