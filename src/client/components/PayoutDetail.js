import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
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

const getBeneficiariesPercent = user => {
  const weight = parseFloat(_.get(user, 'weight', 0)) / 10000;

  // eslint-disable-next-line react/style-prop-object
  return <FormattedNumber value={_.isNan(weight) ? 0 : weight} style="percent" />;
};

const getBeneficaries = post => {
  const beneficiaries = _.get(post, 'beneficiaries', []);

  if (_.isEmpty(beneficiaries)) return null;

  return _.map(beneficiaries, user => (
    <p key={user.account}>
      <Link to={`/@${user.account}`}>{user.account}</Link>{' '}
      <span style={{ opacity: '0.5' }}>{getBeneficiariesPercent(user)}</span>
    </p>
  ));
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
  const beneficaries = getBeneficaries(post);

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
          {beneficaries}
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
