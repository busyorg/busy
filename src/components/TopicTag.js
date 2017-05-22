import React, { PropTypes } from 'react';
import className from 'classnames';
import './TopicTag.scss';

const TopicTag = props =>
  (<div className={className('main', { isFavorite: props.isFavorite })}>
    {props.name}
  </div>);

TopicTag.propTypes = {
  name: PropTypes.string,
  isFavorite: PropTypes.bool
};

export default TopicTag;
