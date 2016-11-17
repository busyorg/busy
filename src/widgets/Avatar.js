import React from 'react';
import { formatter } from 'steem';
import './Avatar.scss';

const Avatar = ({
  username,
  reputation,
  xs,
  sm,
  md,
  lg,
  xl,
  className = '',
}) => {
  let size = '';
  size = (xs) ? 'avatar-xs' : size;
  size = (sm) ? 'avatar-sm' : size;
  size = (md) ? 'avatar-md' : size;
  size = (lg) ? 'avatar-lg' : size;
  size = (xl) ? 'avatar-xl' : size;
  size += ` ${className}`;
  return (
    <span className={`avatar ${size}`}>
      {reputation && <span className="reputation">{formatter.reputation(reputation)}</span>}
      <img src={`https://img.steemconnect.com/@${username}`} />
    </span>
  );
};

export default Avatar;
