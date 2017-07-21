import React, { PropTypes } from 'react';
import './Avatar.less';

const Avatar = ({ username, size }) => (
  <img
    className="Avatar"
    style={{ width: `${size}px`, height: `${size}px` }}
    alt={username}
    src={`https://img.steemconnect.com/@${username || 'steemconnect'}?s=${size}`}
  />);

Avatar.propTypes = {
  username: PropTypes.string,
  size: PropTypes.number,
};

Avatar.defaultProps = {
  username: undefined,
  size: 34,
};

export default Avatar;
