import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import numeral from 'numeral';
import { FormattedRelative } from 'react-intl';
import { calculatePayout } from '../vendor/steemitHelpers';

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

const AmountWithLabelNonZero = ({ label, amount }) =>
  (_.isNumber(amount) && amount !== 0
    ? <div>
      {label}: {numeral(amount).format('$0,0.00')}
    </div>
    : null);

AmountWithLabelNonZero.propTypes = {
  label: PropTypes.string.isRequired,
  amount: PropTypes.number,
};

AmountWithLabelNonZero.defaultProps = {
  amount: 0,
};

const PayoutDetail = ({ post }) => {
  const {
    payoutLimitHit,
    potentialPayout,
    promotionCost,
    cashoutInTime,
    isPayoutDeclined,
    pastPayouts,
    authorPayouts,
    curatorPayouts,
  } = calculatePayout(post);

  if (isPayoutDeclined) {
    return <div>Declined Payout</div>;
  }

  return (
    <div>
      {payoutLimitHit && <div>Payout limit reached on this post</div>}
      <AmountWithLabelNonZero label="Promoted" amount={promotionCost} />
      {cashoutInTime ?
        <div>
          <AmountWithLabel label="Potential Payout" amount={potentialPayout} />
          Will release <FormattedRelative value={cashoutInTime} />
        </div> :
        <div>
          <AmountWithLabel label="Total Past Payouts" amount={pastPayouts} />
          <AmountWithLabel label="Author Payout" amount={authorPayouts} />
          <AmountWithLabel label="Curators Payout" amount={curatorPayouts} />
        </div>
      }
    </div>
  );
};

PayoutDetail.propTypes = {
  post: PropTypes.shape().isRequired,
};

export default PayoutDetail;
