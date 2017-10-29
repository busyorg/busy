import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import getImage from '../helpers/getImage';
import Avatar from './Avatar';

export default class AvatarLightbox extends React.Component {
  static propTypes = {
    username: PropTypes.string,
    size: PropTypes.number,
    previewSize: PropTypes.number,
  };

  static defaultProps = {
    username: undefined,
    size: 100,
    previewSize: 800,
  };

  state = {
    open: false,
  };

  handleAvatarClick = () => this.setState({ open: true });

  handleCloseRequest = () => this.setState({ open: false });

  render() {
    const { username, size, previewSize } = this.props;

    return (
      <div>
        <a role="presentation" onClick={this.handleAvatarClick}>
          <Avatar username={username} size={size} />
        </a>
        {this.state.open && (
          <Lightbox
            mainSrc={getImage(`@${username}?s=${previewSize}`)}
            onCloseRequest={this.handleCloseRequest}
          />
        )}
      </div>
    );
  }
}
