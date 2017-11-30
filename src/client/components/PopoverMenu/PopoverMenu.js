import React from 'react';
import PropTypes from 'prop-types';
import PopoverMenuItem, { popoverMenuItemType } from './PopoverMenuItem';
import './PopoverMenu.less';

const PopoverMenu = ({ children, onSelect, bold, className }) =>
  (<ul className={className}>
    {React.Children.map(children, (child) => {
      const { children: itemChildren, ...otherProps } = child.props;

      return (
        <PopoverMenuItem
          key={child.key}
          {...otherProps}
          itemKey={child.key}
          bold={bold}
          onClick={() => onSelect(child.key)}
        >
          {child.props.children}
        </PopoverMenuItem>
      );
    })}
  </ul>);

PopoverMenu.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(popoverMenuItemType), popoverMenuItemType]),
  onSelect: PropTypes.func,
  bold: PropTypes.bool,
  className: PropTypes.string,
};

PopoverMenu.defaultProps = {
  children: null,
  onSelect: () => {},
  bold: true,
  className: "PopoverMenu",
};

export default PopoverMenu;
export { PopoverMenuItem };
