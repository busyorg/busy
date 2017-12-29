import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import _ from 'lodash';
import USDDisplay from './Utils/USDDisplay';
import { calculatePayout } from '../vendor/steemitHelpers';

const AmountWithLabel = ({ id, defaultMessage, nonzero, amount }) =>
  _.isNumber(amount) &&
  (nonzero ? amount !== 0 : true) && (
    <div>
      <FormattedMessage
        id={id}
        defaultMessage={defaultMessage}
        values={{
          amount: <USDDisplay value={amount} />,
        }}
      />
    </div>
  );

AmountWithLabel.propTypes = {
  id: PropTypes.string.isRequired,
  defaultMessage: PropTypes.string.isRequired,
  nonzero: PropTypes.bool,
  amount: PropTypes.number,
};

AmountWithLabel.defaultProps = {
  nonzero: false,
  amount: 0,
};

const PayoutDetail = ({ intl, post }) => {
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
    return <FormattedMessage id="payout_declined" defaultMessage="Payout declined" />;
  }

  return (
    <div>
      {payoutLimitHit && (
        <FormattedMessage
          id="payout_limit_reached"
          defaultMessage="Payout limit reached on this post"
        />
      )}
      <AmountWithLabel
        nonzero
        id="payout_promoted_amount"
        defaultMessage="Promoted: {amount}"
        amount={promotionCost}
      />
      {cashoutInTime ? (
        <div>
          <AmountWithLabel
            id="payout_potential_payout_amount"
            defaultMessage="Potential Payout: {amount}"
            amount={potentialPayout}
          />
          <FormattedMessage
            id="payout_will_release_in_time"
            defaultMessage="Will release {time}"
            values={{ time: intl.formatRelative(cashoutInTime) }}
          />
        </div>
      ) : (
        <div>
          <AmountWithLabel
            id="payout_total_past_payout_amount"
            defaultMessage="Total Past Payouts: {amount}"
            amount={pastPayouts}
          />
          <AmountWithLabel
            id="payout_author_payout_amount"
            defaultMessage="Author Payout: {amount}"
            amount={authorPayouts}
          />
          <AmountWithLabel
            id="payout_curators_payout_amount"
            defaultMessage="Curators payout: {amount}"
            amount={curatorPayouts}
          />
        </div>
      )}
    </div>
  );
};

PayoutDetail.propTypes = {
  intl: PropTypes.shape().isRequired,
  post: PropTypes.shape().isRequired,
};

export default injectIntl(PayoutDetail);
