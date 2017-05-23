import React, { PropTypes } from 'react';
import className from 'classnames';

const Follow = ({ isFollowed }) =>
  <button className="btn btn-sm btn-primary">
    {isFollowed
      ? 'Following'
      : 'Follow'
    }
  </button>;

Follow.propTypes = {
  isFollowed: PropTypes.bool
};

export default Follow;
