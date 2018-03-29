import React from 'react';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import './HeroBannerSlider.less';

class HeroBannerSlider extends React.Component {
  static SLIDER_CONTENTS = [
    {
      image: '/images/hero-1.svg',
      titleID: 'hero_slider_title_1',
      defaultTitle: 'Write and publish post',
      description:
        'Lorem ipsum Lorem ipsumL orem ipsumLorem ipsuLorem ipsumLorem ipsummLorem ipsumLorem ipsumipsum',
    },
    {
      image: '/images/hero-2.svg',
      titleID: 'hero_slider_title_2',
      defaultTitle: 'Get upvoted by the community',
      description:
        'Lorem ipsum Lorem ipsumL orem ipsumLorem ipsuLorem ipsumLorem ipsummLorem ipsumLorem ipsumipsum',
    },
    {
      image: '/images/hero-3.svg',
      titleID: 'hero_slider_title_3',
      defaultTitle: 'Get rewards in Steem cryptocurrency',
      description:
        'Lorem ipsum Lorem ipsumL orem ipsumLorem ipsuLorem ipsumLorem ipsummLorem ipsumLorem ipsumipsum',
    },
  ];
  constructor(props) {
    super(props);

    this.state = {
      currentSlide: 0,
    };

    this.changeSlider = this.changeSlider.bind(this);
  }

  componentDidMount() {
    const interval = 10000;
    this.sliderTimer = setInterval(this.changeSlider, interval);
  }

  componentWillUnmount() {
    clearInterval(this.sliderTimer);
  }

  changeSlider() {
    let currentSlide = this.state.currentSlide + 1;
    const lastIndex = HeroBannerSlider.SLIDER_CONTENTS.length - 1;

    if (currentSlide > lastIndex) {
      currentSlide = 0;
    }

    this.setState({
      currentSlide,
    });
  }

  handleChangeSlider = index => () => {
    this.setState({ currentSlide: index });
  };

  render() {
    const currentSlide = HeroBannerSlider.SLIDER_CONTENTS[this.state.currentSlide];

    return (
      <div>
        <div
          className="HeroBannerSlider fade-in-left"
          onClick={this.changeSlider}
          key={currentSlide.titleID}
          role="presentation"
        >
          <img
            src={currentSlide.image}
            className="HeroBannerSlider__image"
            alt={currentSlide.titleID}
          />
          <div className="HeroBannerSlider__content">
            <h1 className="HeroBannerSlider__title">
              <FormattedMessage
                id={currentSlide.titleID}
                defaultMessage={currentSlide.defaultTitle}
              />
            </h1>
            <span className="HeroBannerSlider__description">{currentSlide.description}</span>
          </div>
        </div>
        <div className="HeroBannerSlider__controls">
          {_.map(HeroBannerSlider.SLIDER_CONTENTS, (slide, index) => (
            <div
              role="presentation"
              onClick={this.handleChangeSlider(index)}
              key={slide.titleID}
              className={classNames('HeroBannerSlider__controls__item', {
                'HeroBannerSlider__controls__item--selected': index === this.state.currentSlide,
              })}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default HeroBannerSlider;