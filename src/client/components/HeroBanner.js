import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import './HeroBanner.less';

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
              <div className="HeroBanner__content__title">
                <FormattedMessage id="hero_banner_title_3" defaultMessage="Earn rewards in Steem" />
              </div>
            </div>
          </div>
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
