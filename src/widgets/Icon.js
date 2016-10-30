import React from 'react';

const Icon = ({
  name,
  style,
  n = false,
  xs = false,
  s = false,
  m = true,
  l = false,
  x = false,
  xl = false,
  xxl = false,
}) => {
  let size = '';
  size = (n) ? 'icon-n' : size;
  size = (xs) ? 'icon-xs' : size;
  size = (s) ? 'icon-s' : size;
  size = (m) ? 'icon-m' : size;
  size = (l) ? 'icon-l' : size;
  size = (x) ? 'icon-x' : size;
  size = (xl) ? 'icon-xl' : size;
  size = (xxl) ? 'icon-xxl' : size;
  return (
    <i className={`icon ${size} material-icons`} style={style}>{ name }</i>
  );
};

export default Icon;
