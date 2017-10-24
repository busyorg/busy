import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelative } from 'react-intl';

const ClaimReward = ({ timestamp, rewardSteem, rewardSbd, rewardVests }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__icon-container">
      <i className="iconfont icon-ranking UserWalletTransactions__icon" />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        <FormattedMessage
          id="claim_rewards"
          defaultMessage="Claim rewards: {rewardSteem}, {rewardSteem}, and {rewardVests}"
          values={{
            rewardSteem,
            rewardSbd,
            rewardVests,
          }}
        />
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
