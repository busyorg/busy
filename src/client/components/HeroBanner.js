import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import SteemConnect from '../steemConnectAPI';
import './HeroBanner.less';

const HeroBanner = ({ location, handleCloseClick }) => {
  const next = location.pathname.length > 1 ? location.pathname : '';
  return (
    <div className="HeroBanner">
      <a onClick={handleCloseClick} role="button" tabIndex="0" className="HeroBanner__close">
        <i className="iconfont icon-close" />
      </a>
      <div className="feed-layout container">
        <div className="leftContainer" />
        <div className="HeroBanner__container center">
          <div className="HeroBanner__container__content">
            <h1>
              <FormattedMessage
                id="hero"
                defaultMessage="Ensuring compensation for the creators of value"
              />
            </h1>
            <div className="HeroBanner__container__content__buttons">
              <a target="_blank" rel="noopener noreferrer" href="https://steemit.com/pick_account">
                <FormattedMessage id="signup" defaultMessage="Sign up" />
              </a>
              <span className="HeroBanner__container__content__buttons__spacer">|</span>
              <a href={SteemConnect.getLoginURL(next)}>
                <FormattedMessage id="login" defaultMessage="Log in" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

HeroBanner.propTypes = {
  location: PropTypes.shape().isRequired,
  handleCloseClick: PropTypes.func,
};

HeroBanner.defaultProps = {
  handleCloseClick: () => {},
};

export default withRouter(HeroBanner);
