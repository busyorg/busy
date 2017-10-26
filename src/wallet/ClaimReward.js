import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { numberWithCommas } from '../helpers/regexHelpers';

const getFormattedPayout = (rewardSteem, rewardSbd, rewardVests) => {
  const payouts = [];
  const parsedRewardSteem = parseFloat(rewardSteem);
  const parsedRewardSbd = parseFloat(rewardSbd);
  const parsedRewardVests = parseFloat(rewardVests);

  if (parsedRewardSteem > 0) {
    payouts.push(
      <span
        key={'STEEM'}
        className="UserWalletTransactions__payout-rewards"
      >{`${numberWithCommas(parsedRewardSteem.toFixed(3))} STEEM`}</span>,
    );
  }

  if (parsedRewardSbd > 0) {
    payouts.push(
      <span
        key="SBD"
        className="UserWalletTransactions__payout-rewards"
      >{`${numberWithCommas(parsedRewardSbd.toFixed(3))} SBD`}</span>,
    );
  }

  if (parsedRewardVests > 0) {
    payouts.push(
      <span
        key="SP"
        className="UserWalletTransactions__payout-rewards"
      >{`${numberWithCommas(parsedRewardVests.toFixed(3))} SP`}</span>,
    );
  }

  return payouts;
};

const ClaimReward = ({ timestamp, rewardSteem, rewardSbd, rewardVests }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__icon-container">
      <i className="iconfont icon-success_fill UserWalletTransactions__icon" />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        <FormattedMessage id="claim_rewards" defaultMessage="Claim rewards" />
        <span className="UserWalletTransactions__payout">
          {getFormattedPayout(rewardSteem, rewardSbd, rewardVests)}
        </span>
      </div>
      <span className="UserWalletTransactions__timestamp">
        <FormattedRelative value={`${timestamp}Z`} />
      </span>
    </div>
  </div>
);

ClaimReward.propTypes = {
  timestamp: PropTypes.string.isRequired,
  rewardSteem: PropTypes.string.isRequired,
  rewardSbd: PropTypes.string.isRequired,
  rewardVests: PropTypes.string.isRequired,
};

export default ClaimReward;
