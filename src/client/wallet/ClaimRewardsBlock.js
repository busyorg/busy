import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import weauthjsInstance from '../weauthjsInstance';
import { getAuthenticatedUser } from '../reducers';
import { getUserAccountHistory } from './walletActions';
import { reload } from '../auth/authActions';
import Action from '../components/Button/Action';
import './ClaimRewardsBlock.less';
import '../components/Sidebar/SidebarContentBlock.less';

@injectIntl
@connect(
  state => ({
    user: getAuthenticatedUser(state),
  }),
  {
    getUserAccountHistory,
    reload,
  },
)
class ClaimRewardsBlock extends Component {
  static propTypes = {
    user: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    getUserAccountHistory: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
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
    const {
      name,
      TMEreward_balance: TMEbalance,
      reward_TSDbalance: TSDbalance,
      reward_vesting_balance: SCOREbalance,
    } = user;
    this.setState({
      loading: true,
    });
    weauthjsInstance.claimRewardBalance(name, TMEbalance, TSDbalance, SCOREbalance, err => {
      if (!err) {
        this.setState({
          loading: false,
          rewardClaimed: true,
        });
        this.props.getUserAccountHistory(name).then(() => this.props.reload());
      } else {
        this.setState({
          loading: false,
        });
      }
    });
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
    const TMEreward = parseFloat(user.TMEreward_balance);
    const TSDreward = parseFloat(user.reward_TSDbalance);
    const rewardSCORE = parseFloat(user.reward_SCOREvalueInTME);
    const userHasRewards = TMEreward > 0 || TSDreward > 0 || rewardSCORE > 0;

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
      <div className="SidebarContentBlock ClaimRewardsBlock">
        <h4 className="SidebarContentBlock__title">
          <i className="iconfont icon-ranking SidebarContentBlock__icon" />{' '}
          <FormattedMessage id="rewards" defaultMessage="Rewards" />
        </h4>
        <div className="SidebarContentBlock__content">
          {!rewardClaimed && (
            <div>
              {TMEreward > 0 && this.renderReward(TMEreward, 'STEEM', 'steem')}
              {TSDreward > 0 && this.renderReward(TSDreward, 'TSD', 'TSD')}
              {rewardSCORE > 0 && this.renderReward(rewardSCORE, 'SCORE', 'SCORE')}
            </div>
          )}
          <Action
            primary
            big
            disabled={rewardClaimed}
            loading={this.state.loading}
            style={{ width: '100%' }}
            onClick={this.handleClaimRewards}
          >
            {buttonText}
          </Action>
        </div>
      </div>
    );
  }
}

export default ClaimRewardsBlock;
