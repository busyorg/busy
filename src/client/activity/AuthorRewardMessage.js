import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import formatter from '../helpers/steemitFormatter';

const AuthorRewardMessage = ({
  actionDetails,
  intl,
  totalVestingShares,
  totalVestingFundSteem,
}) => {
  const rewards = [
    { payout: actionDetails.sbd_payout, currency: 'SBD' },
    { payout: actionDetails.steem_payout, currency: 'STEEM' },
    { payout: actionDetails.vesting_payout, currency: 'SP' },
  ];

  const parsedRewards = _.reduce(
    rewards,
    (array, reward) => {
      const parsedPayout = parseFloat(reward.payout);

      if (parsedPayout > 0) {
        let rewardsStr;
        if (reward.currency === 'SP') {
          const vestsToSP = formatter.vestToSteem(
            parsedPayout,
            totalVestingShares,
            totalVestingFundSteem,
          );
          rewardsStr = intl.formatNumber(vestsToSP, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          });
        } else {
          rewardsStr = intl.formatNumber(parsedPayout, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          });
        }

        array.push(`${rewardsStr} ${reward.currency}`);
      }

      return array;
    },
    [],
  );

  return (
    <FormattedMessage
      id="author_reward_for_post"
      defaultMessage="Author reward: {rewards} for {author} ({postLink})"
      values={{
        rewards: parsedRewards.join(', '),
        author: actionDetails.author,
        postLink: (
          <Link to={`/@${actionDetails.author}/${actionDetails.permlink}`}>
            {actionDetails.permlink}
          </Link>
        ),
      }}
    />
  );
};

AuthorRewardMessage.propTypes = {
  actionDetails: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  totalVestingShares: PropTypes.string.isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
};

export default injectIntl(AuthorRewardMessage);
