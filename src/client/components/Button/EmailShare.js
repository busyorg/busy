import React from 'react';
import PropTypes from 'prop-types';
import './ShareButton.less';

const EmailShare = ({ url, text }) => {
  const shareURL = `mailto:?subject=${text}&body=${url}`;
  return (
    <a className="ShareButton" href={shareURL}>
      <div className="ShareButton__contents ShareButton__contents__email">
        <i className="iconfont icon-mail_fill ShareButton__icon" />
      </div>
    </a>
  );
};

EmailShare.propTypes = {
  url: PropTypes.string,
  text: PropTypes.string,
};

EmailShare.defaultProps = {
  url: '',
  text: '',
};

export default EmailShare;
