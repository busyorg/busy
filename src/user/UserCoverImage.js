import React from 'react';

const UserCoverImage = ({ username, width, height }) => (
  <div style={{ width: `${width}px`, height: `${height}px` }}>
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: `url(${process.env.STEEMCONNECT_IMG_HOST}/@${username}/cover)`,
        backgroundSize: 'cover',
      }}
    >
      {' '}
    </div>
  </div>
);

export default UserCoverImage;
