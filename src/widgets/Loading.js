import React from 'react';
import './Loading.less';

export default ({ color, className, style }) =>
  <div
    style={style}
    className={
      color
        ? `Loading Loading--${color} text-center ${className}`
        : `Loading text-center ${className}`
    }
  >
    <span>●</span>
    <span>●</span>
    <span>●</span>
  </div>;
