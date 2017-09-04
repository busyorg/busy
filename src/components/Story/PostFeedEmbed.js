import React from 'react';
import PropTypes from 'prop-types';
import './PostFeedEmbed.less';

export default class PostFeedEmbed extends React.Component {
  static propTypes = {
    embed: PropTypes.shape({
      provider_name: PropTypes.string,
      thumbnail: PropTypes.string,
      embed: PropTypes.string,
    }).isRequired,
  };

  static renderWithIframe(embed) {
    // eslint-disable-next-line react/no-danger
    return <div dangerouslySetInnerHTML={{ __html: embed }} />;
  }

  constructor(props) {
    super(props);
    this.state = {
      showIframe: false,
    };
  }

  handleThumbClick = (e) => {
    e.preventDefault();
    this.setState({ showIframe: true });
  };

  renderThumbFirst(thumb) {
    return (
      <div role="presentation" className="PostFeedEmbed" onClick={this.handleThumbClick}>
        <div className="PostFeedEmbed__playButton">
          <i className="iconfont icon-group icon-playon_fill" />
        </div>
        <img alt="thumbnail" className="PostFeedEmbed__preview" src={thumb} />
      </div>
    );
  }

  render() {
    const { embed } = this.props;

    if (
      (embed.provider_name === 'YouTube' || embed.provider_name === 'DTube')
      && !this.state.showIframe
    ) {
      return this.renderThumbFirst(embed.thumbnail);
    } else if (embed.embed) {
      return PostFeedEmbed.renderWithIframe(embed.embed);
    }
    return <div />;
  }
}
