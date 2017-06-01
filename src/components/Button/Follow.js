import React, { PropTypes } from 'react';
import { Button } from 'antd';

const Follow = ({ isFollowed }) =>
  <Button type="primary">
    {isFollowed
      ? 'Following'
      : 'Follow'
    }
  </Button>;

Follow.propTypes = {
  isFollowed: PropTypes.bool
};

export default Follow;
