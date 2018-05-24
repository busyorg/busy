import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Action.less';

const Action = ({ className, children, primary, small, ...restProps }) => (
  <a
    {...restProps}
    className={classNames('Action', className, {
      'ant-btn-lg': !small,
      'Action--primary': primary,
    })}
  >
    {children}
  </a>
);

Action.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  primary: PropTypes.bool,
  small: PropTypes.bool,
};

Action.defaultProps = {
  className: '',
  children: null,
  primary: false,
  small: false,
};

export default Action;
