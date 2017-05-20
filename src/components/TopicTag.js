import React, { PropTypes } from 'react';

const styles = {
  main: {
    borderRadius: '15px',
    lineHeight: 1.4,
    display: 'inline-block',
    padding: '2px 15px',
    color: '#f00',
    border: '2px solid #f00',
    fontFamily: '"Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif',
  },
  isFavorite: {
    color: '#0ff',
    border: '2px solid #0ff',
  }
};

const TopicTag = (props) => {
  let style = styles.main;
  if (props.isFavorite) {
    style = {
      ...style,
      ...styles.isFavorite
    };
  }
  return (<div style={style}>
    {props.name}
  </div>);
};

TopicTag.propTypes = {
  name: PropTypes.string,
  isFavorite: PropTypes.bool
};

export default TopicTag;
