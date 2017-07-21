import React, { PropTypes } from 'react';
import classNames from 'classnames';
import './PopoverMenuItem.less';

const PopoverMenuItem = ({ itemKey, children, onClick, bold }) => (
  <li
    className={classNames('PopoverMenuItem', {
      'PopoverMenuItem--bold': bold,
    })}
  >
    <a onClick={(e) => { e.preventDefault(); onClick(itemKey); }}>
      {children}
    </a>
  </li>);

PopoverMenuItem.propTypes = {
  children: PropTypes.any,
  itemKey: PropTypes.string,
  onClick: PropTypes.func,
  bold: PropTypes.bool,
};

PopoverMenuItem.defaultProps = {
  children: null,
  itemKey: '',
  onClick: () => {},
  bold: true,
};

export const popoverMenuItemType = PropTypes.shape({
  type: PropTypes.oneOf([PopoverMenuItem]),
});

export default PopoverMenuItem;
