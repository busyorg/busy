import React from 'react';
import Img from 'react-advanced-img';

const UserCoverImage = ({ username, width, height }) => (
  <Img
    src={`${process.env.STEEMCONNECT_IMG_HOST}/@${username}/cover`}
    placeholder="busy.org"
    width={width}
    height={height}
  />
);

export default UserCoverImage;
