import React, { Component } from 'react';
import numeral from 'numeral';
import { formatter } from 'steem';
import api from '../steemAPI';
import Loading from '../widgets/Loading';
import { isEmpty } from 'lodash/lang';

export default class UserTransfers extends Component {
  constructor(props) {
    super(props);
  }

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
  }

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
      <div className="container">
        {(!_.isEmpty(this.state.feedPrice) && !_.isEmpty(account)) ?
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
          </div> : <Loading />
        }
      </div>
    );
  }
}
