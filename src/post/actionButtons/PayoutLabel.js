import React from 'react';
import Icon from '../../widgets/Icon';

const PayoutLabel = ({ value, onClick }) =>
  <span onClick={onClick && onClick} >
    <span className="hidden-xs">
      <Icon name="attach_money" sm />
    </span>
    {value}
  </span >;

export default PayoutLabel;
