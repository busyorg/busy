import React from 'react';
import './Loading.scss';

export default ({ color, className }) =>
  <div
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
