import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-image-lightbox';
import Avatar from './Avatar';

export default class AvatarLightbox extends React.Component {
  static propTypes = {
    username: PropTypes.string,
    size: PropTypes.number,
    isActive: PropTypes.bool,
  };

  static defaultProps = {
    username: undefined,
    size: 100,
    isActive: false,
  };

  state = {
    open: false,
  };

  handleAvatarClick = () => this.setState({ open: true });

  handleCloseRequest = () => this.setState({ open: false });

  render() {
    const { username, size, isActive } = this.props;

    return (
      <div>
        <a role="presentation" onClick={this.handleAvatarClick}>
          <Avatar username={username} size={size} />
          {isActive && <div className="UserHeader__container--active" />}
        </a>
        {this.state.open && (
          <Lightbox
            mainSrc={`https://steemitimages.com/u/${username}/avatar/large`}
            onCloseRequest={this.handleCloseRequest}
          />
        )}
      </div>
    );
  }
}
