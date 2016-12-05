import React from 'react';

import './Badge.scss';

const Badge = ({
  vestingShares,
}) => {
  let rank = 'dust';
  rank = vestingShares > 10000 ? 'newbie' : rank;
  rank = vestingShares > 100000 ? 'user' : rank;
  rank = vestingShares > 1000000 ? 'superuser' : rank;
  rank = vestingShares > 10000000 ? 'hero' : rank;
  rank = vestingShares > 100000000 ? 'superhero' : rank;
  rank = vestingShares > 1000000000 ? 'legend' : rank;
  return (
    <span className="Badge">
      <svg className={`Badge__icon Badge__icon--${rank}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M10,0A10,10,0,1,0,20,10,10,10,0,0,0,10,0Zm0,15a5,5,0,1,1,5-5A5,5,0,0,1,10,15Z" />
      </svg>
      { ' ' }{ rank }
    </span>
  );
};

export default Badge;
