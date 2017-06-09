import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import './Topic.less';

const Topic = ({ name, isFavorite }) =>
  <Link to={`/trending/${name}`} className={`Topic ${(isFavorite) ? 'Topic--favorite' : ''}`}>
    {name}
  </Link>;

Topic.propTypes = {
  name: PropTypes.string,
  isFavorite: PropTypes.bool
};

export default Topic;
