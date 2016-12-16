import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import numeral from 'numeral';
import { formatter } from 'steem';
import { connect } from 'react-redux';
import api from '../steemAPI';
import Loading from '../widgets/Loading';
import { isEmpty } from 'lodash/lang';
import * as walletActions from '../wallet/walletActions';

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
    const account = this.state.account;
    const base = (!isEmpty(this.state.feedPrice))
      ? (this.state.feedPrice.base).replace(' SBD', '').replace(',', '')
      : 0;
    let power = 0;
    let dollar = 0;
    if (!isEmpty(this.state.feedPrice) && !isEmpty(account)) {
      power = formatter.vestToSteem(account.vesting_shares,
        this.state.props.total_vesting_shares,
        this.state.props.total_vesting_fund_steem);
      dollar = (parseFloat(base) *
        (parseFloat(account.balance) + parseFloat(power)))
        + parseFloat(account.sbd_balance);
    }
    return (
      <div className="container">
        {(!isEmpty(this.state.feedPrice) && !isEmpty(account)) ?
          <div className="ptl text-xs-center">
            <ul className="row text-xs-center">
              <li className="col col-lg-4">
                <h3>Steem</h3>
                <h2>{numeral(account.balance).format('0,0.00')}</h2>
              </li>
              <li className="col col-lg-4">
                <h3>Steem Power</h3>
                <h2>{numeral(power).format('0,0.00')}</h2>
              </li>
              <li className="col col-lg-4">
                <h3>Steem Dollars</h3>
                <h2>{numeral(account.sbd_balance).format('$0,0.00')}</h2>
              </li>
            </ul>
            <div className="my-2">
              <h2>Estimated Account Value: {numeral(dollar).format('$0,0.00')}</h2>
            </div>
          </div>
          :
          <Loading />
        }
      </div>
    );
  }
}
