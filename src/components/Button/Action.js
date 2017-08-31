import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import classNames from 'classnames';
import './Action.less';

const Action = ({ text, loading, disabled, style, small, onClick }) => (
  <button disabled={disabled} style={style} className={classNames('Action', { 'ant-btn-lg': !small })} onClick={onClick}>
    {loading && <Icon type="loading" />}
    {text}
  </button>);

Action.propTypes = {
  text: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.shape(),
  small: PropTypes.bool,
  onClick: PropTypes.func,
};

Action.defaultProps = {
  loading: false,
  disabled: false,
  style: {},
  small: false,
  onClick: () => {},
};

export default Action;
