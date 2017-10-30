import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import steemConnect from 'sc2-sdk';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { getAuthenticatedUser } from '../reducers';
import { getUserTransactions } from './walletActions';
import Action from '../components/Button/Action';
import './ClaimRewardsButton.less';

@injectIntl
@connect(
  state => ({
    user: getAuthenticatedUser(state),
  }),
  {
    getUserTransactions,
  },
)
class ClaimRewardsButton extends Component {
  static propTypes = {
    user: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    getUserTransactions: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: {},
  };

  state = {
    loading: false,
    rewardClaimed: false,
  };

  handleClaimRewards = () => {
    const { user } = this.props;
    const { reward_steem_balance, reward_sbd_balance, reward_vesting_balance, name } = user;
    this.setState({
      loading: true,
    });
    steemConnect.claimRewardBalance(
      name,
      reward_steem_balance,
      reward_sbd_balance,
      reward_vesting_balance,
      (err) => {
        if (err) {
          this.setState({
            loading: false,
            rewardClaimed: true,
          });
          this.props.getUserTransactions(name);
        } else {
          this.setState({
            loading: false,
          });
        }
      },
    );
  };

  render() {
    const { user, intl } = this.props;
    const { rewardClaimed } = this.state;
    const rewardSteem = parseFloat(user.reward_steem_balance);
    const rewardSbd = parseFloat(user.reward_sbd_balance);
    const rewardSP = parseFloat(user.reward_vesting_steem);
    const hasRewards = rewardSteem > 0 || rewardSbd > 0 || rewardSP > 0;
    const buttonText = rewardClaimed
      ? intl.formatMessage({
        id: 'reward_claimed',
        defaultMessage: 'Reward Claimed',
      })
      : intl.formatMessage({
        id: 'claim_rewards',
        defaultMessage: 'Claim Rewards',
      });

    if (!hasRewards) return null;

    return (
      <div>
        {!rewardClaimed &&
          <div className="ClaimRewardsButton__title">
            <FormattedMessage
              id="current_user_reward_amount"
              defaultMessage="Your current rewards"
            />
            {': '}<div>
              {rewardSteem > 0 &&
                <span key="STEEM" className="ClaimRewardsButton__reward">
                  <FormattedNumber
                    value={rewardSteem}
                    minimumFractionDigits={3}
                    maximumFractionDigits={3}
                  />
                  {' STEEM'}
                </span>}
              {rewardSbd > 0 &&
                <span key="SBD" className="ClaimRewardsButton__reward">
                  <FormattedNumber
                    value={rewardSbd}
                    minimumFractionDigits={3}
                    maximumFractionDigits={3}
                  />
                  {' SBD'}
                </span>}
              {rewardSP > 0 &&
                <span key="SP" className="ClaimRewardsButton__reward">
                  <FormattedNumber
                    value={rewardSP}
                    minimumFractionDigits={3}
                    maximumFractionDigits={3}
                  />
                  {' SP'}
                </span>}
            </div>
          </div>}
        <Action
          text={buttonText}
          disabled={rewardClaimed}
          onClick={this.handleClaimRewards}
          loading={this.state.loading}
        />
      </div>
    );
  }
}

export default ClaimRewardsButton;
