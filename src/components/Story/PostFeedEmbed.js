import React, { Component } from 'react';
import './PostFeedEmbed.less';

export default class PostFeedEmbed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showIframe: false,
    };
  }

  renderThumbFirst(thumb) {
    return (
      <a className="PostFeedEmbed" onClick={this.handleThumbClick}>
        <div className="PostFeedEmbed__playButton">
          <i className="iconfont icon-group icon-playon_fill" />
        </div>
        <img alt="thumbnail" className="PostFeedEmbed__preview" src={thumb} />
      </a>
    );
  }

  handleThumbClick = (e) => {
    e.preventDefault();
    this.setState({ showIframe: true });
  };

  static renderWithIframe(embed) {
    return <div className="PostFeedCard__thumbs" dangerouslySetInnerHTML={{ __html: embed }} />;
  }

  render() {
    const { embed } = this.props;

    if (embed.provider_name === 'YouTube' && !this.state.showIframe) {
      return this.renderThumbFirst(embed.thumbnail);
    } else if (embed.embed) {
      return PostFeedEmbed.renderWithIframe(embed.embed);
    }
    return <div />;
  }
}
