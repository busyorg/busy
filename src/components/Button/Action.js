import React, { PropTypes } from 'react';
import './Action.less';

const Action = ({ text }) => (
  <button className="Action ant-btn-lg">
    {text}
  </button>);

Action.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Action;
