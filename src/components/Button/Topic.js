import React, { PropTypes } from 'react';
import './Topic.less';

const Topic = ({ name, isFavorite }) =>
  <button className={`Topic ${(isFavorite) ? 'Topic--favorite' : ''}`}>
    {name}
  </button>;

Topic.propTypes = {
  name: PropTypes.string,
  isFavorite: PropTypes.bool
};

export default Topic;
