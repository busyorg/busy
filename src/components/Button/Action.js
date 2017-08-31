import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import classNames from 'classnames';
import './Action.less';

const Action = ({ text, loading, disabled, primary, style, small }) => (
  <button disabled={disabled} style={style} className={classNames('Action', { 'ant-btn-lg': !small, 'Action--primary': primary })}>
    {loading && <Icon type="loading" />}
    {text}
  </button>);

Action.propTypes = {
  text: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  primary: PropTypes.bool,
  style: PropTypes.shape(),
  small: PropTypes.bool,
};

Action.defaultProps = {
  loading: false,
  disabled: false,
  primary: false,
  style: {},
  small: false,
};

export default Action;
