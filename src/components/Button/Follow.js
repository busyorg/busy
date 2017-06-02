import React, { PropTypes } from 'react';
import './Follow.less';

const Follow = ({ isFollowed }) =>
  <button className="Follow">
    {isFollowed
      ? 'Following'
      : 'Follow'
    }
  </button>;

Follow.propTypes = {
  isFollowed: PropTypes.bool
};

export default Follow;
