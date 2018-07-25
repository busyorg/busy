import React from 'react';
import PropTypes from 'prop-types';
import './VideoEmbed.less';

export default class VideoEmbed extends React.Component {
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
    <div className="VideoEmbed__container">
      <iframe width="270" height="158" src="https://www.youtube.com/embed/kKZ1CixLG2s?autoplay=1&amp;autohide=1&amp;enablejsapi=0&amp;rel=0&amp;origin=https://steemit.com" frameborder="0" allowfullscreen=""></iframe>
    </div>
  );

  renderThumbFirst(thumb) {
    return (
      <div role="presentation" className="VideoEmbed" onClick={this.handleThumbClick}>
        <div className="VideoEmbed__playButton">
          <i className="iconfont icon-group icon-playon_fill" />
        </div>
        <img alt="thumbnail" className="VideoEmbed__preview" src={thumb} />
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