import React, { PropTypes } from 'react';
import classNames from 'classnames';
import './Action.less';

const Action = ({ text, style, small }) => (
  <button style={style} className={classNames('Action', { 'ant-btn-lg': !small })}>
    {text}
  </button>);

Action.propTypes = {
  text: PropTypes.string.isRequired,
  style: PropTypes.shape(),
  small: PropTypes.bool,
};

Action.defaultProps = {
  style: {},
  small: false,
};

export default Action;
