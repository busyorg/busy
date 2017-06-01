import React from 'react';
import './Avatar.less';

const Avatar = ({ username, size = 34 }) =>
  <img
    className={`Avatar Avatar--${size}`}
    alt={username}
    src={`https://img.steemconnect.com/@${username}?s=${size}`}
  />;

export default Avatar;
