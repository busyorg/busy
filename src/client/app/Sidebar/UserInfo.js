import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import _ from 'lodash';
import { getUser, getRewardFund, getRate } from '../../reducers';
import { getVoteValue } from '../../helpers/user';
import { calculateVotingPower } from '../../vendor/steemitHelpers';
import SocialLinks from '../../components/SocialLinks';
import USDDisplay from '../../components/Utils/USDDisplay';

@injectIntl
@connect((state, ownProps) => ({
  user: getUser(state, ownProps.match.params.name),
  rewardFund: getRewardFund(state),
  rate: getRate(state),
}))
class UserInfo extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    rate: PropTypes.number.isRequired,
  };

  render() {
    const { intl, user, rewardFund, rate } = this.props;
    const location = user && _.get(user.json_metadata, 'profile.location');
    const profile = (user && _.get(user.json_metadata, 'profile')) || {};

    const voteWorth = getVoteValue(
      user,
      rewardFund.recent_claims,
      rewardFund.reward_balance,
      rate,
      10000,
    );

    return (
      <div>
        {user.name && (
          <div style={{ wordBreak: 'break-word' }}>
            {_.get(user && user.json_metadata, 'profile.about')}
            <div style={{ marginTop: 16, marginBottom: 16 }}>
              {location && (
                <div>
                  <i className="iconfont icon-coordinates text-icon" />
                  {location}
                </div>
              )}
              <div>
                <i className="iconfont icon-time text-icon" />
                <FormattedMessage
                  id="joined_date"
                  defaultMessage="Joined {date}"
                  values={{
                    date: intl.formatDate(user.created, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }),
                  }}
                />
              </div>
              <div>
                <i className="iconfont icon-flashlight text-icon" />
                <FormattedMessage id="voting_power" defaultMessage="Voting Power" />
                :{' '}
                <FormattedNumber
                  style="percent" // eslint-disable-line react/style-prop-object
                  value={calculateVotingPower(user)}
                  maximumFractionDigits={0}
                />
              </div>
              <div>
                <i className="iconfont icon-dollar text-icon" />
                <FormattedMessage id="vote_value" defaultMessage="Vote Value" />
                :{' '}
                {isNaN(voteWorth) ? (
                  <Icon type="loading" className="text-icon-right" />
                ) : (
                  <USDDisplay value={voteWorth} />
                )}
              </div>
              <SocialLinks profile={profile} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default UserInfo;
