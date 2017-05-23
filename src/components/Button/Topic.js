import React, { PropTypes } from 'react';
import className from 'classnames';

const Topic = ({ name, isFavorite }) =>
  <div
    className={className('btn btn-sm', {
      'btn-outline-warning': isFavorite,
      'btn-outline-success': !isFavorite
    })}
  >
    {name}
  </div>;

Topic.propTypes = {
  name: PropTypes.string,
  isFavorite: PropTypes.bool
};

export default Topic;
