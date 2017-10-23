import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelative } from 'react-intl';

const AuthorReward = ({ sbdPayout, steemPayout, timestamp }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__avatar">
      <i className="iconfont icon-ranking" />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        <FormattedMessage id="claim_rewards" defaultMessage="Claim rewards" />
      </div>
      <span className="UserWalletTransactions__timestamp">
        <FormattedRelative value={`${timestamp}Z`} />
      </span>
      <span className="UserWalletTransactions__payout">
        {sbdPayout}<br />
        {steemPayout}
      </span>
    </div>
  </div>
);

AuthorReward.propTypes = {
  sbdPayout: PropTypes.string.isRequired,
  steemPayout: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
};

export default AuthorReward;
