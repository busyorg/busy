import React from 'react';
import Img from 'react-advanced-img';

const UserCoverImage = ({ username, width, height }) => (
  <div style={{ width: `${width}px`, height: `${height}px` }}>
    <Img
      src={`${process.env.STEEMCONNECT_IMG_HOST}/@${username}/cover`}
      placeholder="busy.org"
      width={width}
      height={height}
    />
  </div>
);

export default UserCoverImage;
