import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import classNames from 'classnames';
import './Action.less';

const Action = ({ className, text, loading, primary, small, onClick, ...restProps }) => (
  <button
    {...restProps}
    className={classNames('Action', className, {
      'ant-btn-lg': !small,
      'Action--primary': primary,
    })}
    onClick={onClick}
  >
    {loading && <Icon type="loading" />}
    {text}
  </button>
);

Action.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  loading: PropTypes.bool,
  primary: PropTypes.bool,
  small: PropTypes.bool,
  onClick: PropTypes.func,
};

Action.defaultProps = {
  className: '',
  loading: false,
  primary: false,
  small: false,
  onClick: () => {},
};

export default Action;
