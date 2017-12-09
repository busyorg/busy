import React from 'react';
import PropTypes from 'prop-types';
import getImage from '../helpers/getImage';
import './Avatar.less';

const Avatar = ({ username, size }) => {
  let style = {
    minWidth: `${size}px`,
    width: `${size}px`,
    height: `${size}px`,
  };

  if (username) {
    style = {
      ...style,
      backgroundImage: `url(${getImage(`@${username}?width=${size}&height=${size}`)})`,
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
