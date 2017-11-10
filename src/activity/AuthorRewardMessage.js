import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

const AuthorRewardMessage = ({ actionDetails, intl }) => {
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
        const rewardsStr = intl.formatNumber(parsedPayout, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        });
        array.push(`${rewardsStr} ${reward.currency}`);
      }

      return array;
    },
    [],
  );

  return (
    <FormattedMessage
      id="author_reward_for_post"
      defaultMessage="Author Reward: {rewards} for {author} ({postLink})"
      values={{
        rewards: parsedRewards.join(', '),
        author: actionDetails.author,
        postLink: (
          <Link to={`/p/@${actionDetails.author}/${actionDetails.permlink}`}>
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
};

export default injectIntl(AuthorRewardMessage);
