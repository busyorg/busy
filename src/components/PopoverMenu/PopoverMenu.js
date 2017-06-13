import React, { PropTypes } from 'react';
import './PopoverMenu.less';

const PopoverMenuItem = ({ children, key, onClick }) =>
  <li key={key} onClick={() => onClick(key)}>{children}</li>;

PopoverMenuItem.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]),
  key: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

PopoverMenuItem.defaultProps = {
  onClick: () => {},
};

const PopoverMenu = ({ children, onSelect }) =>
  <ul className="PopoverMenu">
    {
      children && Array.isArray(children) && children.map(child =>
        <PopoverMenuItem key={child.key} onClick={() => onSelect(child.key)}>
          {child.props.children}
        </PopoverMenuItem>)
    }
    {
      children
        && !Array.isArray(children)
        && <PopoverMenuItem key={children.key} onClick={() => onSelect(children.key)}>
          {children.props.children}
        </PopoverMenuItem>
    }
  </ul>;

PopoverMenu.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(PopoverMenuItem)),
    PropTypes.instanceOf(PopoverMenuItem),
  ]),
  onSelect: PropTypes.func,
};

PopoverMenu.defaultProps = {
  onSelect: () => {},
};

export default PopoverMenu;
export { PopoverMenuItem };
