import React from 'react';
import numeral from 'numeral';
import { formatter } from 'steem';
import api from '../steemAPI';

module.exports = React.createClass({
  componentWillMount() {
    this.setState({
      account: {},
      props: {},
      feedPrice: {},
    });
    api.getAccounts([this.props.params.name], (err, result) => {
      this.setState({ account: result[0] });
    });
    api.getState('trending/busy', (err, result) => {
      this.setState({
        props: result.props,
        feedPrice: result.feed_price
      });
    });
  },
  render() {
    const account = this.state.account;
    const base = (!_.isEmpty(this.state.feedPrice)) ? (this.state.feedPrice.base).replace(' SBD', '').replace(',', '') : 0;
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
      <div className="container ptm">
        <h1>Wallet</h1>
        {!_.isEmpty(this.state.feedPrice) && !_.isEmpty(account) &&
          <ul>
            <li><h3>1 Steem <span className="pull-right">{numeral(base).format('$0,0.00')}</span></h3></li>
            <li><h3>Steem <span className="pull-right">{numeral(account.balance).format('0,0.00')}</span></h3></li>
            <li><h3>Steem Power <span className="pull-right">{numeral(power).format('0,0.00')}</span></h3></li>
            <li><h3>Steem Dollars <span className="pull-right">{numeral(account.sbd_balance).format('0,0.00')}</span></h3></li>
            <li><h3>Steem Dollars <span className="pull-right">{numeral(dollar).format('$0,0.00')}</span></h3></li>
          </ul>
        }
      </div>
    );
  }
});
