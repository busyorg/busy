import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import UserWalletSummary from '../wallet/UserWalletSummary';
import UserWalletTransactions from '../wallet/UserWalletTransactions';
import Loading from '../components/Icon/Loading';
import {
  getUser,
  getAuthenticatedUserName,
  getTotalVestingShares,
  getTotalVestingFundSteem,
  getUsersTransactions,
  getUsersTransactionsLoading,
  getUsersEstAccountsValues,
} from '../reducers';
import {
  getGlobalProperties,
  getUserTransactions,
  getUserEstAccountValue,
} from '../wallet/walletActions';
import { getAccountWithFollowingCount } from './usersActions';

@withRouter
@connect(
  (state, ownProps) => ({
    user: getUser(
      state,
      ownProps.isCurrentUser ? state.auth.user.name : ownProps.match.params.name,
    ),
    authenticatedUserName: getAuthenticatedUserName(state),
    totalVestingShares: getTotalVestingShares(state),
    totalVestingFundSteem: getTotalVestingFundSteem(state),
    usersTransactions: getUsersTransactions(state),
    usersTransactionsLoading: getUsersTransactionsLoading(state),
    usersEstAccountsValues: getUsersEstAccountsValues(state),
  }),
  {
    getGlobalProperties,
    getUserTransactions,
    getAccountWithFollowingCount,
    getUserEstAccountValue,
  },
)
class Wallet extends Component {
  static propTypes = {
    location: PropTypes.shape().isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    user: PropTypes.shape().isRequired,
    getGlobalProperties: PropTypes.func.isRequired,
    getUserTransactions: PropTypes.func.isRequired,
    getUserEstAccountValue: PropTypes.func.isRequired,
    getAccountWithFollowingCount: PropTypes.func.isRequired,
    usersTransactions: PropTypes.shape().isRequired,
    usersEstAccountsValues: PropTypes.shape().isRequired,
    usersTransactionsLoading: PropTypes.bool.isRequired,
    isCurrentUser: PropTypes.bool,
    authenticatedUserName: PropTypes.string,
  };

  static defaultProps = {
    isCurrentUser: false,
    authenticatedUserName: '',
  };

  componentWillMount() {
    const {
      totalVestingShares,
      totalVestingFundSteem,
      usersEstAccountsValues,
      usersTransactions,
      user,
      isCurrentUser,
      authenticatedUserName,
    } = this.props;
    const username = isCurrentUser
      ? authenticatedUserName
      : this.props.location.pathname.match(/@(.*)(.*?)\//)[1];

    if (_.isEmpty(totalVestingFundSteem) || _.isEmpty(totalVestingShares)) {
      this.props.getGlobalProperties();
    }

    if (_.isEmpty(usersTransactions[username])) {
      this.props.getUserTransactions(username);
    }

    if (_.isEmpty(user)) {
      this.props.getAccountWithFollowingCount({ name: username });
    }

    if (_.isEmpty(usersEstAccountsValues[username]) && !_.isEmpty(user.name)) {
      this.props.getUserEstAccountValue(user);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { user, isCurrentUser } = this.props;
    const username = isCurrentUser
      ? user.name
      : this.props.location.pathname.match(/@(.*)(.*?)\//)[1];
    if (_.isEmpty(nextProps.usersEstAccountsValues[username]) && !_.isEmpty(user.name)) {
      this.props.getUserEstAccountValue(user);
    }
  }

  render() {
    const {
      user,
      totalVestingShares,
      totalVestingFundSteem,
      usersTransactions,
      usersTransactionsLoading,
      usersEstAccountsValues,
    } = this.props;
    const transactions = usersTransactions[user.name] || [];
    const estAccountValue = usersEstAccountsValues[user.name] || 0;

    return (
      <div>
        <UserWalletSummary
          user={user}
          estAccountValue={estAccountValue}
          loading={user.isFetching}
          totalVestingShares={totalVestingShares}
          totalVestingFundSteem={totalVestingFundSteem}
        />
        {transactions.length === 0 && usersTransactionsLoading
          ? <Loading style={{ marginTop: '20px' }} />
          : <UserWalletTransactions
            transactions={usersTransactions[user.name]}
            currentUsername={user.name}
          />}
      </div>
    );
  }
}

export default Wallet;
