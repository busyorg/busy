import React from 'react';

const Avatar = ({
  username,
  xs,
  sm,
  md,
  lg,
  xl,
}) => {
  let size = '';
  size = (xs) ? 'avatar-xs' : size;
  size = (sm) ? 'avatar-sm' : size;
  size = (md) ? 'avatar-md' : size;
  size = (lg) ? 'avatar-lg' : size;
  size = (xl) ? 'avatar-xl' : size;
  return (
    <span className={`avatar ${size}`}>
      <img src={`https://img.busy.org/@${username}`} />
    </span>
  );
};

export default Avatar;
