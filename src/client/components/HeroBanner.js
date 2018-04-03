import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Carousel } from 'antd';
import './HeroBanner.less';
import './HeroBannerSlider.less';

const SLIDER_CONTENTS = [
  {
    image: '/images/hero-1.svg',
    titleID: 'hero_slider_title_1',
    defaultTitle: 'Write and publish post',
    descriptionID: 'hero_slider_description_1',
    defaultDescription:
      'Spread your ideas with the world through the easy to use and interactive Busy editor with markdown built-in',
    className: 'HeroBannerSlider__image HeroBannerSlider__image-1',
  },
  {
    image: '/images/hero-2.svg',
    titleID: 'hero_slider_title_2',
    defaultTitle: 'Get upvoted by the community',
    descriptionID: 'hero_slider_description_1',
    defaultDescription:
      'By providing value to the community in any form, the people can upvote you to show their appreciation and reward your efforts',
    className: 'HeroBannerSlider__image',
  },
  {
    image: '/images/hero-3.svg',
    titleID: 'hero_slider_title_3',
    defaultTitle: 'Get rewards in Steem cryptocurrency',
    descriptionID: 'hero_slider_description_1',
    defaultDescription:
      'Contrary to other social media networks, here you can earn cryptocurrency that has a real dollar value for your work',
    className: 'HeroBannerSlider__image',
  },
];

const HeroBanner = ({ visible, onCloseClick }) => {
  if (!visible) return null;

  return (
    <div className="HeroBanner">
      <a onClick={onCloseClick} role="button" tabIndex="0" className="HeroBanner__close">
        <i className="iconfont icon-close" />
      </a>
      <div className="HeroBanner__container">
        <div className="HeroBanner__container__content HeroBannerSlider__container">
          <Carousel effect="fade" autoplay autoplaySpeed={8000}>
            {_.map(SLIDER_CONTENTS, slide => (
              <div key={slide.titleID}>
                <div className="HeroBannerSlider">
                  <div className={slide.className}>
                    <img src={slide.image} alt={slide.titleID} />
                  </div>
                  <div className="HeroBannerSlider__content">
                    <h1 className="HeroBannerSlider__title">
                      <FormattedMessage id={slide.titleID} defaultMessage={slide.defaultTitle} />
                    </h1>
                    <span className="HeroBannerSlider__description">
                      <FormattedMessage
                        id={slide.descriptionID}
                        defaultMessage={slide.defaultDescription}
                      />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

HeroBanner.propTypes = {
  visible: PropTypes.bool,
  onCloseClick: PropTypes.func,
};

HeroBanner.defaultProps = {
  visible: true,
  onCloseClick: () => {},
};

export default HeroBanner;
