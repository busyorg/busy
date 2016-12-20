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
  let size = 'Icon--md';
  size = (xs) ? 'Icon--xs' : size;
  size = (sm) ? 'Icon--sm' : size;
  size = (md) ? 'Icon--md' : size;
  size = (lg) ? 'Icon--lg' : size;
  size = (xl) ? 'Icon--xl' : size;
  return (
    <i className={`material-icons Icon ${size} ${className}`} style={style}>{ name }</i>
  );
};

export default Icon;
