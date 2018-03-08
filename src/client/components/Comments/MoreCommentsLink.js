import React from 'react';
import PropTypes from 'prop-types';

const MoreCommentsLink = ({ comments, visibleComments, onClick }) => {
  if (comments === 0 || visibleComments >= comments) {
    return null;
  }
  return (
    <div role="button" tabIndex="-1" onClick={onClick}>
      <a>show more comments ({comments - visibleComments})</a>
    </div>
  );
};

MoreCommentsLink.propTypes = {
  comments: PropTypes.number.isRequired,
  visibleComments: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MoreCommentsLink;
