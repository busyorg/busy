import React, { Component, PropTypes } from 'react';
import embedjs from 'embedjs';
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

  static propTypes = {
    post: PropTypes.object.isRequired,
  };

  renderThumbFirst(thumb) {
    return (
      <div className="PostFeedCard__thumbs PostFeedEmbed" onClick={this.handleThumbClick}>
        <img src={thumb} />
        <div className="PostFeedEmbed__playButton">
          <Icon name="play_circle_filled" xxl />
        </div>
      </div>
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
    const { post } = this.props;
    const embeds = embedjs.getAll(post.body);

    if (embeds[0].provider_name === 'YouTube' && !this.state.showIframe) {
      return this.renderThumbFirst(embeds[0].thumbnail);
    } else if (embeds[0].embed) {
      return this.renderWithIframe(embeds[0].embed);
    }
  }
}
