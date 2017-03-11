import React from 'react';
import './Loading.scss';

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
