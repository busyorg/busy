import React from 'react';
import PropTypes from 'prop-types';
import HeroBannerSlider from './HeroBannerSlider';
import './HeroBanner.less';

const HeroBanner = ({ visible, onCloseClick }) => {
  if (!visible) return null;

  return (
    <div className="HeroBanner">
      <a onClick={onCloseClick} role="button" tabIndex="0" className="HeroBanner__close">
        <i className="iconfont icon-close" />
      </a>
      <div className="HeroBanner__container">
        <div className="HeroBanner__container__content">
          <HeroBannerSlider />
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
