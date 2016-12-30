import React from 'react';
import Icon from '../../widgets/Icon';

const PayoutLabel = ({ value }) =>
  <span>
    <span className="hidden-xs">
      <Icon name="attach_money" sm />
    </span>
    { value }
  </span>;

export default PayoutLabel;
