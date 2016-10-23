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
        {(!_.isEmpty(this.state.feedPrice) && !_.isEmpty(account)) ?
          <ul>
            <li>
              <h3>Steem <span className="pull-right">{numeral(account.balance).format('0,0.00')} STEEM</span></h3>
              <p>Tradeable tokens that may be transferred anywhere at anytime.<br />
                Steem can be converted to Steem Power in a process called powering up.</p>
            </li>
            <li>
              <h3>Steem Power <span className="pull-right">{numeral(power).format('0,0.00')} STEEM</span></h3>
              <p>Influence tokens which give you more control over post payouts and allow you to earn on curation rewards.</p>
            </li>
            <li>
              <h3>Steem Dollars <span className="pull-right">{numeral(account.sbd_balance).format('$0,0.00')}</span></h3>
              <p>Tokens worth about $1.00 of STEEM, currently collecting 10% APR.</p>
            </li>
            <li>
              <h3>Estimated Account Value <span className="pull-right">{numeral(dollar).format('$0,0.00')}</span></h3>
              <p>The estimated value is based on a 7 day average value of Steem in US Dollars.</p>
            </li>
          </ul> : <Loading />
        }
      </div>
    );
  }
});
