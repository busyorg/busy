import React from 'react';
import PropTypes from 'prop-types';
import './MoreCommentsLink.less';

const MoreCommentsLink = ({ comments, visibleComments, onClick }) => {
  if (comments === 0 || visibleComments >= comments) {
    return null;
  }
  return (
    <button className="MoreCommentsLink" onClick={onClick}>
      <span className="MoreCommentsLink__text">
        Show more comments ({comments - visibleComments})
      </span>
      <i className="iconfont icon-unfold" />
    </button>
  );
};

MoreCommentsLink.propTypes = {
  comments: PropTypes.number.isRequired,
  visibleComments: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MoreCommentsLink;
