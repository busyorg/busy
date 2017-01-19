import React from 'react';

const UserCoverImage = ({ username, width, height }) => (
  <div style={{ width: `${width}px`, height: `${height}px` }}>
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${process.env.STEEMCONNECT_IMG_HOST}/@${username}/cover) #`,
        backgroundSize: 'cover',
        backgroundColor: '#434f66',
      }}
    >
      {' '}
    </div>
  </div>
);

export default UserCoverImage;
