import React from 'react';

const Icon = ({ name, style }) => {
  return (
    <i className="icon icon-md material-icons" style={style}>{ name }</i>
  );
};

export default Icon;
