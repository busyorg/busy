import React, { Component } from 'react';
import Icon from '../widgets/Icon';
import './Feed/PostFeedCard.scss';
import './PostFeedEmbed.scss';

export default class PostFeedEmbed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showIframe: false,
    };
  }

  renderThumbFirst(thumb) {
    return (
      <a
        className="PostFeedCard__thumbs PostFeedEmbed"
        onClick={this.handleThumbClick}
      >
        <div className="PostFeedEmbed__playButton">
          <Icon name="play_circle_filled" xxl />
        </div>
        <img className="PostFeedEmbed__preview" src={thumb} />
      </a>
    );
  }

  handleThumbClick = (e) => {
    e.stopPropagation();
    this.setState({ showIframe: true });
  };

  renderWithIframe(embed) {
    return (
      <div className="PostFeedCard__thumbs" dangerouslySetInnerHTML={{ __html: embed }} />
    );
  }

  render() {
    const { embed } = this.props;

    if (embed.provider_name === 'YouTube' && !this.state.showIframe) {
      return this.renderThumbFirst(embed.thumbnail);
    } else if (embed.embed) {
      return this.renderWithIframe(embed.embed);
    }
    return null;
  }
}
