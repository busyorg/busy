import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import formatter from '../helpers/blockchainProtocolFormatter';

const AuthorRewardMessage = ({
  actionDetails,
  intl,
  totalSCORE,
  SCOREbackingTMEfundBalance,
}) => {
  const rewards = [
    { payout: actionDetails.TSDpayout, currency: 'TSD' },
    { payout: actionDetails.TMEpayout, currency: 'TME' },
    { payout: actionDetails.SCOREpayout, currency: 'SCORE' },
  ];

  const parsedRewards = _.reduce(
    rewards,
    (array, reward) => {
      const parsedPayout = parseFloat(reward.payout);

      if (parsedPayout > 0) {
        let rewardsStr;
        if (reward.currency === 'SCORE') {
          const SCORErewardInTMEvalue = formatter.SCOREinTMEvalue(
            parsedPayout,
            totalSCORE,
            SCOREbackingTMEfundBalance,
          );
          rewardsStr = intl.formatNumber(SCORErewardInTMEvalue, {
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
  totalSCORE: PropTypes.string.isRequired,
  SCOREbackingTMEfundBalance: PropTypes.string.isRequired,
};

export default injectIntl(AuthorRewardMessage);
