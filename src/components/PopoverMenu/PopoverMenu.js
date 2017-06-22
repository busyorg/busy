import React, { PropTypes } from 'react';
import classNames from 'classnames';
import './PopoverMenu.less';

const PopoverMenuItem = ({ itemKey, children, onClick, bold }) =>
  <li
    className={classNames({
      'PopoverMenu__item--bold': bold,
    })}
    key={itemKey}
    onClick={() => onClick(itemKey)}
  >
    {children}
  </li>;

PopoverMenuItem.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
  itemKey: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  bold: PropTypes.bool,
};

PopoverMenuItem.defaultProps = {
  onClick: () => {},
  bold: true,
};

const PopoverMenu = ({ children, onSelect, bold }) => (
  <ul className="PopoverMenu">
    {
      children && Array.isArray(children) && children.map(child => (
        <PopoverMenuItem
          key={child.key}
          itemKey={child.key}
          bold={bold}
          onClick={() => onSelect(child.key)}
        >
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
  bold: PropTypes.bool,
};

PopoverMenu.defaultProps = {
  onSelect: () => {},
  bold: true,
};

export default PopoverMenu;
export { PopoverMenuItem };
