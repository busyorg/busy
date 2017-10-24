import React, { Component } from 'react';
import PropTypes from 'prop-types';
import steem from 'steem';
import Promise from 'bluebird';
import { withRouter } from 'react-router-dom';
import {
  getAccount,
  getTransactionHistory,
  getDynamicGlobalProperties,
} from '../helpers/apiHelpers';
import UserWalletSummary from '../wallet/UserWalletSummary';
import UserWalletTransactions from '../wallet/UserWalletTransactions';

@withRouter class Wallet extends Component {
  static propTypes = {
    location: PropTypes.shape().isRequired,
  };

  state = {
    transactions: [],
    user: {
      name: '',
    },
    estAccountValue: '',
    loading: true,
    loadingAccountValue: true,
  };

  componentDidMount() {
    const username = this.props.location.pathname.match(/@(.*)(.*?)\//)[1];
    Promise.all([
      getTransactionHistory(username),
      getAccount(username),
      getDynamicGlobalProperties(),
    ]).then((response) => {
      const transactions = response[0];
      const user = response[1];
      const globals = response[2];
      this.setState({
        transactions,
        user: {
          ...user,
          steem_power: steem.formatter.vestToSteem(
            user.vesting_shares,
            globals.total_vesting_shares,
            globals.total_vesting_fund_steem,
          ),
        },
        loading: false,
      });
      steem.formatter.estimateAccountValue(user).then((result) => {
        this.setState({
          estAccountValue: result,
          loadingAccountValue: false,
        });
      });
    });
  }

  render() {
    const { transactions, user, loading, estAccountValue, loadingAccountValue } = this.state;

    return (
      <div>
        <UserWalletSummary
          user={user}
          estAccountValue={estAccountValue}
          loading={loading}
          loadingAccountValue={loadingAccountValue}
        />
        {transactions.length > 0 &&
          <UserWalletTransactions transactions={transactions} currentUsername={user.name} />}
      </div>
    );
  }
}

export default Wallet;
