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
    description:
      'Lorem ipsum Lorem ipsumL orem ipsumLorem ipsuLorem ipsumLorem ipsummLorem ipsumLorem ipsumipsum',
    className: 'HeroBannerSlider__image HeroBannerSlider__image-1',
  },
  {
    image: '/images/hero-2.svg',
    titleID: 'hero_slider_title_2',
    defaultTitle: 'Get upvoted by the community',
    description:
      'Lorem ipsum Lorem ipsumL orem ipsumLorem ipsuLorem ipsumLorem ipsummLorem ipsumLorem ipsumipsum',
    className: 'HeroBannerSlider__image',
  },
  {
    image: '/images/hero-3.svg',
    titleID: 'hero_slider_title_3',
    defaultTitle: 'Get rewards in Steem cryptocurrency',
    description:
      'Lorem ipsum Lorem ipsumL orem ipsumLorem ipsuLorem ipsumLorem ipsummLorem ipsumLorem ipsumipsum',
    className: 'HeroBannerSlider__image',
  },
];

const HeroBanner = ({ visible, onCloseClick }) => {
  if (!visible) return null;

  return (
    <div className="HeroBanner">
      <div className="HeroBanner__container">
        <div className="HeroBanner__container__content HeroBannerSlider__container">
          <a onClick={onCloseClick} role="button" tabIndex="0" className="HeroBanner__close">
            <i className="iconfont icon-close" />
          </a>
          <Carousel effect="fade" autoplay autoplaySpeed={8000} focusOnSelect adaptiveHeight>
            {_.map(SLIDER_CONTENTS, slide => (
              <div key={slide.titleID}>
                <div className="HeroBannerSlider">
                  <img src={slide.image} className={slide.className} alt={slide.titleID} />
                  <div className="HeroBannerSlider__content">
                    <h1 className="HeroBannerSlider__title">
                      <FormattedMessage id={slide.titleID} defaultMessage={slide.defaultTitle} />
                    </h1>
                    <span className="HeroBannerSlider__description">{slide.description}</span>
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
