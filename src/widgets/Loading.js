import React from 'react';

import './Loading.sass';

const Loading = ({ color }) => {
  let className = (color === 'white') ? 'loading-white' : 'loading';
  className += ' align-center';
  return (
    <div>
      <div className={className}>
        <span>●</span><span>●</span><span>●</span>
      </div>
    </div>
  );
};

export default Loading;
