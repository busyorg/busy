import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import numeral from 'numeral';
import { formatter } from 'steem';
import { connect } from 'react-redux';
import api from '../steemAPI';
import Loading from '../widgets/Loading';
import * as walletActions from '../wallet/walletActions';
import TransferHistory from './TransferHistory';

@connect(
  state => ({
    app: state.app,
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
    const username = this.props.params.name;
    this.props.getWallet(username);
    api.getState('trending/busy', (err, result) => {
      this.setState({ props: result.props });
    });
  }

  render() {
    const rate = this.props.app.rate;
    const username = this.props.params.name;
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
    return (
      <div className="container my-5">
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
