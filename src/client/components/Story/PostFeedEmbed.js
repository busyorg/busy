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
    inPost: PropTypes.bool,
  };

  static defaultProps = {
    inPost: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      showIframe: false,
    };
  }

  handleThumbClick = e => {
    e.preventDefault();
    this.setState({ showIframe: true });
  };

  renderWithIframe = embed => (
    // eslint-disable-next-line react/no-danger
    <div dangerouslySetInnerHTML={{ __html: embed }} />
  );

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
    const { embed, inPost } = this.props;
    const shouldRenderThumb = inPost ? false : !this.state.showIframe;

    if (
      (embed.provider_name === 'YouTube' || embed.provider_name === 'DTube') &&
      shouldRenderThumb
    ) {
      return this.renderThumbFirst(embed.thumbnail);
    } else if (embed.embed) {
      return this.renderWithIframe(embed.embed);
    }
    return <div />;
  }
}
