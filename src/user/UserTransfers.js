import _ from 'lodash';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import numeral from 'numeral';
import { formatter } from 'steem';
import steemconnect from 'sc2-sdk';
import { connect } from 'react-redux';
import api from '../steemAPI';
import Loading from '../widgets/Loading';
import * as walletActions from '../wallet/walletActions';
import TransferHistory from './TransferHistory';

const CLAIMED = 'CLAIMED';
const CLAIMING = 'CLAIMING';
@connect(
  state => ({
    app: state.app,
    auth: state.auth,
    wallet: state.wallet,
  }),
  dispatch => bindActionCreators({
    getWallet: walletActions.getWallet,
  }, dispatch)
)
export default class UserTransfers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {},
    };
  }

  componentDidMount() {
    const username = this.props.match.params.name;
    this.props.getWallet(username);
    api.getState('trending/busy', (err, result) => {
      this.setState({ props: result.props });
    });
  }

  claimReward = () => {
    const user = this.props.user;
    const account = user.name;
    const rewardSteem = user.reward_steem_balance;
    const rewardSbd = user.reward_sbd_balance;
    const rewardVests = user.reward_vesting_balance;
    this.setState({ claimStatus: CLAIMING });
    steemconnect
      .send('claimRewardBalance', { account, rewardSteem, rewardSbd, rewardVests })
      .then(() => {
        this.setState({ claimStatus: CLAIMED });
        this.props.getWallet(user.name);
      });
  }

  render() {
    const rate = this.props.app.rate;
    const username = this.props.match.params.name;
    const account = this.props.user;

    let power = 0;
    let dollar = 0;
    if (rate && account && this.state.props) {
      power = formatter.vestToSteem(account.vesting_shares,
        this.state.props.total_vesting_shares,
        this.state.props.total_vesting_fund_steem);
      dollar = (parseFloat(rate) *
        (parseFloat(account.balance) + parseFloat(power)))
        + parseFloat(account.sbd_balance);
    }

    const isMyAccount = account.name && (_.get(this.props.auth, 'user.name') === account.name);

    let rewardsStr; const rewards = [];
    const { claimStatus } = this.state;
    let claimBtnText = 'Claim Reward';
    if (claimStatus === CLAIMING) {
      claimBtnText = 'Claiming Reward';
    } else if (claimStatus === CLAIMED) {
      claimBtnText = 'Reward Claimed';
    }

    if (isMyAccount) {
      // refer https://github.com/steemit/condenser/blob/b0fc795ed321d712a4c0b6656197d6f8ff952063/app/components/modules/UserWallet.jsx#L214
      const rewardSteem = parseFloat(account.reward_steem_balance.split(' ')[0]) > 0 ? account.reward_steem_balance : null;
      const rewardSbd = parseFloat(account.reward_sbd_balance.split(' ')[0]) > 0 ? account.reward_sbd_balance : null;
      const rewardSp = parseFloat(account.reward_vesting_steem.split(' ')[0]) > 0 ? account.reward_vesting_steem.replace('STEEM', 'SP') : null;

      if (rewardSteem) rewards.push(rewardSteem);
      if (rewardSbd) rewards.push(rewardSbd);
      if (rewardSp) rewards.push(rewardSp);

      switch (rewards.length) {
        case 3:
          rewardsStr = `${rewards[0]}, ${rewards[1]} and ${rewards[2]}`;
          break;
        case 2:
          rewardsStr = `${rewards[0]} and ${rewards[1]}`;
          break;
        case 1:
          rewardsStr = `${rewards[0]}`;
          break;
        default:
          rewardsStr = '';
      }
      if (claimStatus === CLAIMED) {
        rewardsStr = `Reward Claimed: ${rewardsStr}`;
      } else {
        rewardsStr = `Current reward: ${rewardsStr}`;
      }
    }

    return (
      <div className="container my-5">
        {isMyAccount && (rewards.length > 0) &&
          <h3 className="text-center mb-5">{rewardsStr}
            <button
              disabled={claimStatus === CLAIMING || claimStatus === CLAIMED}
              className="btn btn-sm btn-primary ml-2"
              onClick={this.claimReward}
            >{claimBtnText}</button>
          </h3>
        }
        {power ?
          <div className="ptl text-center">
            <ul className="row text-center">
              <li className="col-lg-3">
                <h3>Steem</h3>
                <h2>{numeral(account.balance).format('0,0.00')}</h2>
              </li>
              <li className="col-lg-3">
                <h3>Steem Power</h3>
                <h2>{numeral(power).format('0,0.00')}</h2>
              </li>
              <li className="col-lg-3">
                <h3>Steem Dollars</h3>
                <h2>{numeral(account.sbd_balance).format('$0,0.00')}</h2>
              </li>
              <li className="col-lg-3">
                <h3><FormattedMessage id="estimated_value" defaultMessage="Total ≈" /></h3>
                <h2>{numeral(dollar).format('$0,0.00')}</h2>
              </li>
            </ul>
          </div>
          :
          <Loading />
        }
        <TransferHistory
          list={this.props.wallet.history[username] || []}
          username={username}
        />
      </div>
    );
  }
}
