import React from 'react';
import PropTypes from 'prop-types';
import './ShareButton.less';

const TwitterShare = ({ url, text }) => {
  const shareURL = `https://twitter.com/intent/tweet/?text=${text}&url=${url}`;
  return (
    <a className="ShareButton" href={shareURL} target="_blank">
      <div className="ShareButton__contents ShareButton__contents__twitter">
        <i className="iconfont icon-twitter ShareButton__icon" />
      </div>
    </a>
  );
};

TwitterShare.propTypes = {
  url: PropTypes.string,
  text: PropTypes.string,
};

TwitterShare.defaultProps = {
  url: '',
  text: '',
};

export default TwitterShare;
