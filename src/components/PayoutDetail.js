import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import numeral from 'numeral';
import { FormattedRelative } from 'react-intl';
import { calculatePayout } from '../helpers/steemitHelpers';

const AmountWithLabel = ({ label, amount }) =>
  (_.isNumber(amount)
    ? <div>
      {label}: {numeral(amount).format('$0,0.00')}
    </div>
    : null);

AmountWithLabel.propTypes = {
  label: PropTypes.string.isRequired,
  amount: PropTypes.number,
};

AmountWithLabel.defaultProps = {
  amount: 0,
};

const PayoutDetail = ({ post }) => {
  const {
    payoutLimitHit,
    potentialPayout,
    promotionCost,
    cashoutInTime,
    isPayoutDeclined,
    maxAcceptedPayout,
    pastPayouts,
    authorPayouts,
    curatorPayouts,
  } = calculatePayout(post);

  return (
    <div>
      {payoutLimitHit && <div>Payout limit reached on this post</div>}
      <AmountWithLabel label="Potential Payout" amount={potentialPayout} />
      <AmountWithLabel label="Promoted" amount={promotionCost} />
      {!isPayoutDeclined &&
        cashoutInTime &&
        <div>
          Will release <FormattedRelative value={cashoutInTime} />
        </div>}
      {isPayoutDeclined && <div>Declined Payout</div>}
      <AmountWithLabel label="Max Accepted Payout" amount={maxAcceptedPayout} />
      <AmountWithLabel label="Total Past Payouts" amount={pastPayouts} />
      <AmountWithLabel label="Authors Payout" amount={authorPayouts} />
      <AmountWithLabel label="Curators Payout" amount={curatorPayouts} />
      {!pastPayouts && !potentialPayout ? 'No payout' : ''}
    </div>
  );
};

PayoutDetail.propTypes = {
  post: PropTypes.shape().isRequired,
};

export default PayoutDetail;
