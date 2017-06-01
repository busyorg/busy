import React, { PropTypes } from 'react';
import { Button } from 'antd';

const Topic = ({ name, isFavorite }) =>
  <Button ghost type={(isFavorite) ? 'danger' : 'primary'} size="small">
    {name}
  </Button>;

Topic.propTypes = {
  name: PropTypes.string,
  isFavorite: PropTypes.bool
};

export default Topic;
