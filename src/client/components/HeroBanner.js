import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { Carousel } from 'antd';
import './HeroBanner.less';
import './HeroBannerSlider.less';

const SLIDER_CONTENTS = [
  {
    image: '/images/hero-1.svg',
    titleID: 'hero_banner_title_1',
    defaultTitle: 'Write and publish a post on Steem',
    className: 'HeroBannerSlider__image HeroBannerSlider__image-1',
  },
  {
    image: '/images/hero-2.svg',
    titleID: 'hero_banner_title_2',
    defaultTitle: 'The community upvotes your post',
    className: 'HeroBannerSlider__image',
  },
  {
    image: '/images/hero-3.svg',
    titleID: 'hero_banner_title_3',
    defaultTitle: 'Earn rewards in Steem',
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
        <div className="HeroBanner__content-container">
          <div className="HeroBanner__content">
            <img
              src="/images/hero-1.svg"
              className="HeroBanner__content__image"
              alt="Write and publish a post on Steem"
            />
            <div className="HeroBanner__content__description">
              <div className="HeroBanner__content__number">1</div>
              <div className="HeroBanner__content__title">
                <FormattedMessage
                  id="hero_banner_title_1"
                  defaultMessage="Write and publish a post on Steem"
                />
              </div>
            </div>
          </div>
          <div className="HeroBanner__content">
            <img
              src="/images/hero-2.svg"
              className="HeroBanner__content__image"
              alt="The community upvotes your post"
            />
            <div className="HeroBanner__content__description">
              <div className="HeroBanner__content__number">2</div>
              <div className="HeroBanner__content__title">
                <FormattedMessage
                  id="hero_banner_title_2"
                  defaultMessage="The community upvotes your post"
                />
              </div>
            </div>
          </div>
          <div className="HeroBanner__content">
            <img
              src="/images/hero-3.svg"
              className="HeroBanner__content__image"
              alt="Earn rewards in Steem"
            />
            <div className="HeroBanner__content__description">
              <div className="HeroBanner__content__number">3</div>
              <div className="HeroBanner__content__title" style={{ width: '130px' }}>
                <FormattedMessage id="hero_banner_title_3" defaultMessage="Earn rewards in Steem" />
              </div>
            </div>
          </div>
        </div>
        <div className="HeroBannerSlider__container">
          <Carousel effect="fade" autoplay autoplaySpeed={8000}>
            {_.map(SLIDER_CONTENTS, slide => (
              <div key={slide.titleID}>
                <div className="HeroBannerSlider">
                  <div className={slide.className}>
                    <img src={slide.image} alt={slide.titleID} />
                  </div>
                  <div className="HeroBannerSlider__content">
                    <div className="HeroBannerSlider__title">
                      <FormattedMessage id={slide.titleID} defaultMessage={slide.defaultTitle} />
                    </div>
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
