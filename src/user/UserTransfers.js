import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import numeral from 'numeral';
import { formatter } from 'steem';
import { connect } from 'react-redux';
import _ from 'lodash';
import api from '../steemAPI';
import Loading from '../widgets/Loading';
import * as walletActions from '../wallet/walletActions';
import TransferHistory from './TransferHistory';

@connect(
  state => ({
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
      account: {},
      props: {},
      feedPrice: {},
    };
  }

  componentDidMount() {
    const username = this.props.params.name;
    this.props.getWallet(username);

    api.getAccounts([username], (err, result) => {
      this.setState({ account: result[0] });
    });
    api.getState('trending/busy', (err, result) => {
      this.setState({
        props: result.props,
        feedPrice: result.feed_price
      });
    });
  }

  render() {
    const username = this.props.params.name;
    const account = this.state.account;
    const base = (!_.isEmpty(this.state.feedPrice))
      ? (this.state.feedPrice.base).replace(' SBD', '').replace(',', '')
      : 0;
    let power = 0;
    let dollar = 0;
    if (!_.isEmpty(this.state.feedPrice) && !_.isEmpty(account)) {
      power = formatter.vestToSteem(account.vesting_shares,
        this.state.props.total_vesting_shares,
        this.state.props.total_vesting_fund_steem);
      dollar = (parseFloat(base) *
        (parseFloat(account.balance) + parseFloat(power)))
        + parseFloat(account.sbd_balance);
    }
    return (
      <div className="container my-5">
        {(!_.isEmpty(this.state.feedPrice) && !_.isEmpty(account)) ?
          <div className="ptl text-center">
            <ul className="row text-center">
              <li className="col col-lg-3">
                <h3>Steem</h3>
                <h2>{numeral(account.balance).format('0,0.00')}</h2>
              </li>
              <li className="col col-lg-3">
                <h3>Steem Power</h3>
                <h2>{numeral(power).format('0,0.00')}</h2>
              </li>
              <li className="col col-lg-3">
                <h3>Steem Dollars</h3>
                <h2>{numeral(account.sbd_balance).format('$0,0.00')}</h2>
              </li>
              <li className="col col-lg-3">
                <h3><FormattedMessage id="estimated_value" /></h3>
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
