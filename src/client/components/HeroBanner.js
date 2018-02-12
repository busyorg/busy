import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import SteemConnect from '../steemConnectAPI';
import './HeroBanner.less';

const HeroBanner = ({ visible, location, onCloseClick }) => {
  if (!visible) return null;

  const next = location.pathname.length > 1 ? location.pathname : '';
  return (
    <div className="HeroBanner">
      <a onClick={onCloseClick} role="button" tabIndex="0" className="HeroBanner__close">
        <i className="iconfont icon-close" />
      </a>
      <div className="HeroBanner__container">
        <div className="HeroBanner__container__content">
          <h1>
            <FormattedMessage
              id="hero"
              defaultMessage="Ensuring compensation for the creators of value"
            />
          </h1>
          <div className="HeroBanner__container__content__buttons">
            <a
              className="HeroBanner__container__content__buttons__button HeroBanner__primary"
              target="_blank"
              rel="noopener noreferrer"
              href={process.env.SIGNUP_URL}
            >
              <FormattedMessage id="signup" defaultMessage="Sign up" />
            </a>
            <a
              className="HeroBanner__container__content__buttons__button HeroBanner__secondary"
              href={SteemConnect.getLoginURL(next)}
            >
              <FormattedMessage id="login" defaultMessage="Log in" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

HeroBanner.propTypes = {
  location: PropTypes.shape().isRequired,
  visible: PropTypes.bool,
  onCloseClick: PropTypes.func,
};

HeroBanner.defaultProps = {
  visible: true,
  onCloseClick: () => {},
};

export default withRouter(HeroBanner);
