import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './PopoverMenuItem.less';

const PopoverMenuItem = ({ itemKey, children, onClick, bold, disabled }) =>
  (<li
    className={classNames('PopoverMenuItem', {
      'PopoverMenuItem--bold': bold,
    })}
  >
    <a
      role="presentation"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        onClick(itemKey);
      }}
    >
      {children}
    </a>
  </li>);

PopoverMenuItem.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
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
