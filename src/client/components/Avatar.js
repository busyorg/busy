import React from 'react';
import PropTypes from 'prop-types';
import './Avatar.less';

const Avatar = ({ username, size }) => {
  let style = {
    minWidth: `${size}px`,
    width: `${size}px`,
    height: `${size}px`,
  };

  const url =
    size > 64
      ? `https://steemitimages.com/u/${username}/avatar`
      : `https://steemitimages.com/u/${username}/avatar/small`;

  if (username) {
    style = {
      ...style,
      backgroundImage: `url(${url})`,
    };
  }

  return <div className="Avatar" style={style} />;
};

Avatar.propTypes = {
  username: PropTypes.string.isRequired,
  size: PropTypes.number,
};

Avatar.defaultProps = {
  size: 100,
};

export default Avatar;
