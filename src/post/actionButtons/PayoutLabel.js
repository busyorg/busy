import React from 'react';
import numeral from 'numeral';
import Icon from '../../widgets/Icon';

const PayoutLabel = ({ post, onClick }) => {
  const pendingPayoutValue = parseFloat(post.pending_payout_value);
  const totalPayoutValue = parseFloat(post.total_payout_value);
  const payout = totalPayoutValue || pendingPayoutValue;
  const maxAcceptedPayout = parseFloat(post.max_accepted_payout);
  return (
    <a onClick={onClick}>
      <span className="hidden-xs">
        <Icon name="attach_money" sm />
      </span>
      <span className={maxAcceptedPayout === 0 && 'del'}>
        {numeral(payout).format('$0,0.00')}
      </span>
    </a>
  );
};

export default PayoutLabel;
