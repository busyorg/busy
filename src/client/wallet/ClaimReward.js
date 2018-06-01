import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  FormattedRelative,
  FormattedNumber,
  FormattedDate,
  FormattedTime,
} from 'react-intl';
import formatter from '../helpers/steemitFormatter';
import BTooltip from '../components/BTooltip';

const getFormattedPayout = (
  rewardSteem,
  rewardSbd,
  rewardVests,
  totalVestingShares,
  totalVestingFundSteem,
) => {
  const payouts = [];
  const parsedRewardSteem = parseFloat(rewardSteem);
  const parsedRewardSbd = parseFloat(rewardSbd);
  const parsedRewardVests = parseFloat(
    formatter.vestToSteem(rewardVests, totalVestingShares, totalVestingFundSteem),
  );

  if (parsedRewardSteem > 0) {
    payouts.push(
      <span key="STEEM" className="UserWalletTransactions__payout-rewards">
        <FormattedNumber
          value={parsedRewardSteem}
          minimumFractionDigits={3}
          maximumFractionDigits={3}
        />
        {' STEEM'}
      </span>,
    );
  }

  if (parsedRewardSbd > 0) {
    payouts.push(
      <span key="SBD" className="UserWalletTransactions__payout-rewards">
        <FormattedNumber
          value={parsedRewardSbd}
          minimumFractionDigits={3}
          maximumFractionDigits={3}
        />
        {' SBD'}
      </span>,
    );
  }

  if (parsedRewardVests > 0) {
    payouts.push(
      <span key="SP" className="UserWalletTransactions__payout-rewards">
        <FormattedNumber
          value={parsedRewardVests}
          minimumFractionDigits={3}
          maximumFractionDigits={3}
        />
        {' SP'}
      </span>,
    );
  }

  return payouts;
};

const ClaimReward = ({
  timestamp,
  rewardSteem,
  rewardSbd,
  rewardVests,
  totalVestingShares,
  totalVestingFundSteem,
}) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__icon-container">
      <i className="iconfont icon-success_fill UserWalletTransactions__icon" />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        <div>
          <FormattedMessage id="claim_rewards" defaultMessage="Claim rewards" />
        </div>
        <div className="UserWalletTransactions__payout">
          {getFormattedPayout(
            rewardSteem,
            rewardSbd,
            rewardVests,
            totalVestingShares,
            totalVestingFundSteem,
          )}
        </div>
      </div>
      <span className="UserWalletTransactions__timestamp">
        <BTooltip
          title={
            <span>
              <FormattedDate value={`${timestamp}Z`} /> <FormattedTime value={`${timestamp}Z`} />
            </span>
          }
        >
          <span>
            <FormattedRelative value={`${timestamp}Z`} />
          </span>
        </BTooltip>
      </span>
    </div>
  </div>
);

ClaimReward.propTypes = {
  timestamp: PropTypes.string.isRequired,
  rewardSteem: PropTypes.string.isRequired,
  rewardSbd: PropTypes.string.isRequired,
  rewardVests: PropTypes.string.isRequired,
  totalVestingShares: PropTypes.string.isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
};

export default ClaimReward;
