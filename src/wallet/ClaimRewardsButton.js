import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import steemConnect from 'sc2-sdk';
import { injectIntl } from 'react-intl';
import { userHasRewards } from '../vendor/steemitHelpers';
import { getAuthenticatedUser } from '../reducers';
import { getUserTransactions } from './walletActions';
import Action from '../components/Button/Action';

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
        if (!err) {
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
    const buttonText = rewardClaimed
      ? intl.formatMessage({
        id: 'reward_claimed',
        defaultMessage: 'Reward Claimed',
      })
      : intl.formatMessage({
        id: 'claim_rewards',
        defaultMessage: 'Claim Rewards',
      });

    if (!userHasRewards(user)) return null;

    return (
      <Action
        text={buttonText}
        disabled={rewardClaimed}
        onClick={this.handleClaimRewards}
        loading={this.state.loading}
      />
    );
  }
}

export default ClaimRewardsButton;
