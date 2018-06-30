import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from 'antd';
import './Action.less';

const Action = ({ className, primary, big, loading, children, ...restProps }) => (
  <button
    className={classNames('Action', className, {
      'Action--big': big,
      'Action--primary': primary,
    })}
    {...restProps}
  >
    {loading && <Icon type="loading" />}
    {children}
  </button>
);

Action.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  primary: PropTypes.bool,
  big: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
};

Action.defaultProps = {
  className: '',
  loading: false,
  primary: false,
  big: false,
  onClick: () => {},
};

export default Action;
