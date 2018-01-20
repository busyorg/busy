import React from 'react';
import PropTypes from 'prop-types';
import './ShareButton.less';

const FacebookShare = ({ url }) => {
  const shareURL = `https://facebook.com/sharer/sharer.php?u=${url}`;
  return (
    <a className="ShareButton" href={shareURL} target="_blank">
      <div className="ShareButton__contents ShareButton__contents__facebook">
        <i className="iconfont icon-facebook ShareButton__icon" />
      </div>
    </a>
  );
};

FacebookShare.propTypes = {
  url: PropTypes.string,
};

FacebookShare.defaultProps = {
  url: '',
};

export default FacebookShare;
