import React, { PropTypes } from 'react';
import './PopoverMenu.less';

const PopoverMenuItem = ({ itemKey, children, onClick }) =>
  <li key={itemKey} onClick={() => onClick(itemKey)}>{children}</li>;

PopoverMenuItem.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
  itemKey: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

PopoverMenuItem.defaultProps = {
  onClick: () => {},
};

const PopoverMenu = ({ children, onSelect }) => (
  <ul className="PopoverMenu">
    {
      children && Array.isArray(children) && children.map(child => (
        <PopoverMenuItem key={child.key} itemKey={child.key} onClick={() => onSelect(child.key)}>
          {child.props.children}
        </PopoverMenuItem>))
    }
    {
      children
        && !Array.isArray(children)
        && <PopoverMenuItem
          key={children.key}
          itemKey={children.key}
          onClick={() => onSelect(children.key)}
        >
          {children.props.children}
        </PopoverMenuItem>
    }
  </ul>);

PopoverMenu.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.instanceOf(PopoverMenuItem),
  ]).isRequired,
  onSelect: PropTypes.func,
};

PopoverMenu.defaultProps = {
  onSelect: () => {},
};

export default PopoverMenu;
export { PopoverMenuItem };
