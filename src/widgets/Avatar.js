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
  let s = '';
  size = (xs) ? 'Avatar--xs' : size;
  size = (sm) ? 'Avatar--sm' : size;
  size = (md) ? 'Avatar--md' : size;
  size = (lg) ? 'Avatar--lg' : size;
  size = (xl) ? 'Avatar--xl' : size;
  s = (xs) ? 48 : s;
  s = (sm) ? 80 : s;
  s = (md) ? 100 : s;
  s = (lg) ? 120 : s;
  s = (xl) ? 140 : s;
  size += ` ${className}`;
  return (
    <span className={`Avatar ${size}`}>
      {reputation &&
        <span className="Avatar__reputation">
          {formatter.reputation(reputation)}
        </span>
      }
      <img className="Avatar__img" src={`https://img.steemconnect.com/${username}?s=${s}`} />
    </span>
  );
};

export default Avatar;
