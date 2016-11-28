import React from 'react';

import '../fonts/MaterialIcons.scss';
import './Icon.scss';

const Icon = ({
  name,
  style,
  className = '',
  xs = false,
  sm = false,
  md = false,
  lg = false,
  xl = false,
}) => {
  let size = 'icon-md';
  size = (xs) ? 'icon-xs' : size;
  size = (sm) ? 'icon-sm' : size;
  size = (md) ? 'icon-md' : size;
  size = (lg) ? 'icon-lg' : size;
  size = (xl) ? 'icon-xl' : size;
  return (
    <i className={`material-icons icon ${size} ${className}`} style={style}>{ name }</i>
  );
};

export default Icon;
