import React from 'react';
import PropTypes from 'prop-types';
import { getTwitterShareURL } from '../../helpers/socialProfiles';
import './ShareButton.less';

const TwitterShare = ({ url, text }) => (
  <a className="ShareButton" href={getTwitterShareURL(text, url)} target="_blank">
    <div className="ShareButton__contents ShareButton__contents__twitter">
      <i className="iconfont icon-twitter ShareButton__icon" />
    </div>
  </a>
);

TwitterShare.propTypes = {
  url: PropTypes.string,
  text: PropTypes.string,
};

TwitterShare.defaultProps = {
  url: '',
  text: '',
};

export default TwitterShare;
