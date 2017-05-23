import React from 'react';

const Avatar = ({ username, size = 34 }) =>
  <span className={`Avatar ${size}`}>
    <img
      key={username}
      className="rounded"
      src={`https://img.steemconnect.com/@${username}?s=${size}`}
    />
  </span>;

export default Avatar;
