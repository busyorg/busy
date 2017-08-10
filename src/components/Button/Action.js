import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import classNames from 'classnames';
import './Action.less';

const Action = ({ text, loading, disabled, style, small }) => (
  <button disabled={disabled} style={style} className={classNames('Action', { 'ant-btn-lg': !small })}>
    {loading && <Icon type="loading" />}
    {text}
  </button>);

Action.propTypes = {
  text: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.shape(),
  small: PropTypes.bool,
};

Action.defaultProps = {
  loading: false,
  disabled: false,
  style: {},
  small: false,
};

export default Action;
