import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import steemConnect from 'sc2-sdk';
import _ from 'lodash';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { getAuthenticatedUser } from '../reducers';
import { getUserAccountHistory } from './walletActions';
import { updateAuthUser } from '../auth/authActions';
import Action from '../components/Button/Action';
import './ClaimRewardsBlock.less';

@injectIntl
@connect(
  state => ({
    user: getAuthenticatedUser(state),
  }),
  {
    getUserAccountHistory,
    updateAuthUser,
  },
)
class ClaimRewardsBlock extends Component {
  static propTypes = {
    user: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    getUserAccountHistory: PropTypes.func.isRequired,
    updateAuthUser: PropTypes.func.isRequired,
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
          this.props.getUserAccountHistory(name).then(() => this.props.updateAuthUser(name));
        } else {
          this.setState({
            loading: false,
          });
        }
      },
    );
  };

  renderReward = (value, currency, rewardField) => (
    <div className="ClaimRewardsBlock__reward">
      <span className="ClaimRewardsBlock__reward__field">
        <FormattedMessage
          id={rewardField}
          defaultMessage={_.startCase(rewardField.replace('_', ''))}
        />
      </span>
      <span className="ClaimRewardsBlock__reward__value">
        <FormattedNumber value={value} minimumFractionDigits={3} maximumFractionDigits={3} />
        {` ${currency}`}
      </span>
    </div>
  );

  render() {
    const { user, intl } = this.props;
    const { rewardClaimed } = this.state;
    const rewardSteem = parseFloat(user.reward_steem_balance);
    const rewardSbd = parseFloat(user.reward_sbd_balance);
    const rewardSP = parseFloat(user.reward_vesting_steem);
    const userHasRewards = rewardSteem > 0 || rewardSbd > 0 || rewardSP > 0;

    const buttonText = rewardClaimed
      ? intl.formatMessage({
        id: 'reward_claimed',
        defaultMessage: 'Reward Claimed',
      })
      : intl.formatMessage({
        id: 'claim_rewards',
        defaultMessage: 'Claim Rewards',
      });

    if (!userHasRewards || rewardClaimed) return null;

    return (
      <div className="ClaimRewardsBlock">
        <h4 className="ClaimRewardsBlock__title SidebarBlock__content-title">
          <i className="iconfont icon-ranking ClaimRewardsBlock__icon" />
          {' '}
          <FormattedMessage id="rewards" defaultMessage="Rewards" />
        </h4>
        {!rewardClaimed &&
          <div>
            {rewardSteem > 0 && this.renderReward(rewardSteem, 'STEEM', 'steem')}
            {rewardSbd > 0 && this.renderReward(rewardSbd, 'SBD', 'steem_dollar')}
            {rewardSP > 0 && this.renderReward(rewardSP, 'SP', 'steem_power')}
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

export default ClaimRewardsBlock;
