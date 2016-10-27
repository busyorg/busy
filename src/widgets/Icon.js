import React from 'react';

const Icon = ({
  name,
  style,
  xSmall = false,
  small = false,
  medium = true,
  large = false,
  xLarge = false,
  xXLarge = false,
}) => {
  let size = '';
  if (xSmall) {
    size = 'icon-xs';
  }
  if (small) {
    size = 'icon-sm';
  }
  if (medium) {
    size = 'icon-md';
  }
  if (large) {
    size = 'icon-lg';
  }
  if (xLarge) {
    size = 'icon-xl';
  }
  if (xXLarge) {
    size = 'icon-xxl';
  }

  return (
    <i className={`icon ${size} material-icons`} style={style}>{ name }</i>
  );
};

export default Icon;
