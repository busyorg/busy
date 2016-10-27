import React from 'react';
import numeral from 'numeral';
import { formatter } from 'steem';
import api from '../steemAPI';
import Loading from '../widgets/Loading';

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
    let shares = 0;
    if (!_.isEmpty(this.state.feedPrice) && !_.isEmpty(account)) {
      shares = (100 / (parseFloat(this.state.props.total_vesting_shares) - 210792436466.193333)) * parseFloat(account.vesting_shares);
      power = formatter.vestToSteem(account.vesting_shares,
        this.state.props.total_vesting_shares,
        this.state.props.total_vesting_fund_steem);
      dollar = (parseFloat(base) *
        (parseFloat(account.balance) + parseFloat(power)))
        + parseFloat(account.sbd_balance);
    }
    return (
      <div className="container">
        {(!_.isEmpty(this.state.feedPrice) && !_.isEmpty(account)) ?
          <center className="ptl">
            <div>
              <h3>Estimated Account Value</h3>
              <h1>{numeral(dollar).format('$0,0.00')}</h1>
            </div>
            <ul className="row">
              <li className="col col-lg-4">
                <h3>Steem</h3>
                <h1>{numeral(account.balance).format('0,0.00')}</h1>
              </li>
              <li className="col col-lg-4">
                <h3>Steem Power</h3>
                <h1>{numeral(power).format('0,0.00')}<br /><small>{numeral(shares).format('0,0.000')}%*</small></h1>
              </li>
              <li className="col col-lg-4">
                <h3>Steem Dollars</h3>
                <h1>{numeral(account.sbd_balance).format('$0,0.00')}</h1>
              </li>
            </ul>
          </center> : <Loading />
        }
      </div>
    );
  }
});
