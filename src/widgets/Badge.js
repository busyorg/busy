import React from 'react';
import numeral from 'numeral';
import './Badge.less';

const Badge = ({
  vestingShares,
}) => {
  const vest = numeral(vestingShares).format('0.0');
  let rank = 'dust';
  rank = vest > 10000 ? 'newbie' : rank;
  rank = vest > 100000 ? 'user' : rank;
  rank = vest > 1000000 ? 'superuser' : rank;
  rank = vest > 10000000 ? 'hero' : rank;
  rank = vest > 100000000 ? 'superhero' : rank;
  rank = vest > 1000000000 ? 'legend' : rank;
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
