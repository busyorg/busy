import React, { PropTypes } from 'react';
import classNames from 'classnames';
import './PopoverMenuItem.less';

const PopoverMenuItem = ({ itemKey, children, onClick, bold, disabled }) => (
  <li
    className={classNames('PopoverMenuItem', {
      'PopoverMenuItem--bold': bold,
    })}
  >
    <a disabled={disabled} onClick={(e) => { e.preventDefault(); onClick(itemKey); }}>
      {children}
    </a>
  </li>);

PopoverMenuItem.propTypes = {
  children: PropTypes.any,
  itemKey: PropTypes.string,
  onClick: PropTypes.func,
  bold: PropTypes.bool,
  disabled: PropTypes.bool,
};

PopoverMenuItem.defaultProps = {
  children: null,
  itemKey: '',
  onClick: () => {},
  bold: true,
  disabled: false,
};

export const popoverMenuItemType = PropTypes.shape({
  type: PropTypes.oneOf([PopoverMenuItem]),
});

export default PopoverMenuItem;
