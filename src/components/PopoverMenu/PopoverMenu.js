import React, { PropTypes } from 'react';
import './PopoverMenu.less';

const PopoverMenuItem = ({ children }) =>
  <li>{children}</li>;

PopoverMenuItem.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]),
};

const PopoverMenu = ({ children }) =>
  <ul className="PopoverMenu">
    {children}
  </ul>;

PopoverMenu.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(PopoverMenuItem)),
    PropTypes.instanceOf(PopoverMenuItem),
    PropTypes.string,
  ]),
};

export default PopoverMenu;
export { PopoverMenuItem };
