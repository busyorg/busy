import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import steem from 'steem';

const CurationReward = ({ timestamp, reward, totalVestingShares, totalVestingFundSteem }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__icon">
      <i className="iconfont icon-ranking" />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        <FormattedMessage id="claim_rewards" defaultMessage="Claim rewards" />
        <span className="UserWalletTransactions__payout">
          {`${steem.formatter.vestToSteem(reward, totalVestingShares, totalVestingFundSteem)} SP`}
        </span>
      </div>
      <span className="UserWalletTransactions__timestamp">
        <FormattedRelative value={`${timestamp}Z`} />
      </span>
    </div>
  </div>
);

CurationReward.propTypes = {
  timestamp: PropTypes.string.isRequired,
  reward: PropTypes.string.isRequired,
  totalVestingShares: PropTypes.string.isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
};

export default CurationReward;
