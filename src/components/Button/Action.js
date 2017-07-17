import React, { PropTypes } from 'react';
import classNames from 'classnames';
import './Action.less';

const Action = ({ text, disabled, style, small }) => (
  <button disabled={disabled} style={style} className={classNames('Action', { 'ant-btn-lg': !small })}>
    {text}
  </button>);

Action.propTypes = {
  text: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.shape(),
  small: PropTypes.bool,
};

Action.defaultProps = {
  disabled: false,
  style: {},
  small: false,
};

export default Action;
