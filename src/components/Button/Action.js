import React, { PropTypes } from 'react';
import { Button } from 'antd';

const Action = ({ text }) =>
  <Button size="large">
    {text}
  </Button>;

Action.propTypes = {
  text: PropTypes.string
};

export default Action;
