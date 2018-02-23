import React from 'react';
import PropTypes from 'prop-types';
import { getFacebookShareURL } from '../../helpers/socialProfiles';
import './ShareButton.less';

const FacebookShare = ({ url }) => (
  <a className="ShareButton" href={getFacebookShareURL(url)} target="_blank">
    <div className="ShareButton__contents ShareButton__contents__facebook">
      <i className="iconfont icon-facebook ShareButton__icon" />
    </div>
  </a>
);

FacebookShare.propTypes = {
  url: PropTypes.string,
};

FacebookShare.defaultProps = {
  url: '',
};

export default FacebookShare;
