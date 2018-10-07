import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import UserWalletSummary from '../wallet/UserWalletSummary';
import { TSD, TME } from '../../common/constants/cryptos';
import { getUserDetailsKey } from '../helpers/stateHelpers';
import UserWalletTransactions from '../wallet/UserWalletTransactions';
import Loading from '../components/Icon/Loading';
import {
  getUser,
  getAuthenticatedUser,
  getAuthenticatedUserName,
  gettotalSCORE,
  getSCOREbackingTMEfundBalance,
  getUsersTransactions,
  getUsersAccountHistory,
  getUsersAccountHistoryLoading,
  getLoadingGlobalProperties,
  getLoadingMoreUsersAccountHistory,
  getUserHasMoreAccountHistory,
  getCryptosPriceHistory,
} from '../reducers';
import {
  getGlobalProperties,
  getUserAccountHistory,
  getMoreUserAccountHistory,
} from '../wallet/walletActions';
import { getAccount } from './usersActions';
import WalletSidebar from '../components/Sidebar/WalletSidebar';

@withRouter
@connect(
  (state, ownProps) => ({
    user:
      ownProps.isCurrentUser || ownProps.match.params.name === getAuthenticatedUserName(state)
        ? getAuthenticatedUser(state)
        : getUser(state, ownProps.match.params.name),
    authenticatedUserName: getAuthenticatedUserName(state),
    totalSCORE: gettotalSCORE(state),
    SCOREbackingTMEfundBalance: getSCOREbackingTMEfundBalance(state),
    usersTransactions: getUsersTransactions(state),
    usersAccountHistory: getUsersAccountHistory(state),
    usersAccountHistoryLoading: getUsersAccountHistoryLoading(state),
    loadingGlobalProperties: getLoadingGlobalProperties(state),
    loadingMoreUsersAccountHistory: getLoadingMoreUsersAccountHistory(state),
    userHasMoreActions: getUserHasMoreAccountHistory(
      state,
      ownProps.isCurrentUser
        ? getAuthenticatedUserName(state)
        : getUser(state, ownProps.match.params.name).name,
    ),
    cryptosPriceHistory: getCryptosPriceHistory(state),
  }),
  {
    getGlobalProperties,
    getUserAccountHistory,
    getMoreUserAccountHistory,
    getAccount,
  },
)
class Wallet extends Component {
  static propTypes = {
    location: PropTypes.shape().isRequired,
    totalSCORE: PropTypes.string.isRequired,
    SCOREbackingTMEfundBalance: PropTypes.string.isRequired,
    user: PropTypes.shape().isRequired,
    getGlobalProperties: PropTypes.func.isRequired,
    getUserAccountHistory: PropTypes.func.isRequired,
    getMoreUserAccountHistory: PropTypes.func.isRequired,
    getAccount: PropTypes.func.isRequired,
    usersTransactions: PropTypes.shape().isRequired,
    usersAccountHistory: PropTypes.shape().isRequired,
    cryptosPriceHistory: PropTypes.shape().isRequired,
    usersAccountHistoryLoading: PropTypes.bool.isRequired,
    loadingGlobalProperties: PropTypes.bool.isRequired,
    loadingMoreUsersAccountHistory: PropTypes.bool.isRequired,
    userHasMoreActions: PropTypes.bool.isRequired,
    isCurrentUser: PropTypes.bool,
    authenticatedUserName: PropTypes.string,
  };

  static defaultProps = {
    isCurrentUser: false,
    authenticatedUserName: '',
  };

  componentDidMount() {
    const {
      totalSCORE,
      SCOREbackingTMEfundBalance,
      usersTransactions,
      user,
      isCurrentUser,
      authenticatedUserName,
    } = this.props;
    const username = isCurrentUser
      ? authenticatedUserName
      : this.props.location.pathname.match(/@(.*)(.*?)\//)[1];

    if (_.isEmpty(SCOREbackingTMEfundBalance) || _.isEmpty(totalSCORE)) {
      this.props.getGlobalProperties();
    }

    if (_.isEmpty(usersTransactions[getUserDetailsKey(username)])) {
      this.props.getUserAccountHistory(username);
    }

    if (_.isEmpty(user)) {
      this.props.getAccount(username);
    }
  }

  render() {
    const {
      user,
      totalSCORE,
      SCOREbackingTMEfundBalance,
      loadingGlobalProperties,
      usersTransactions,
      usersAccountHistoryLoading,
      loadingMoreUsersAccountHistory,
      userHasMoreActions,
      usersAccountHistory,
			cryptosPriceHistory,
			isCurrentUser
    } = this.props;
    const userKey = getUserDetailsKey(user.name);
    const transactions = _.get(usersTransactions, userKey, []);
    const actions = _.get(usersAccountHistory, userKey, []);
    const currentTMERate = _.get(
      cryptosPriceHistory,
      `${TME.symbol}.priceDetails.currentUSDPrice`,
      null,
    );
    const currentTSDRate = _.get(
      cryptosPriceHistory,
      `${TSD.symbol}.priceDetails.currentUSDPrice`,
      null,
    );
    const TMErateLoading = _.isNull(currentTMERate) || _.isNull(currentTSDRate);

    return (
			<div className="UserWalletContent">
				<WalletSidebar isCurrentUser={isCurrentUser} showMarket={false} />
        <UserWalletSummary
          user={user}
          loading={user.fetching}
          totalSCORE={totalSCORE}
          SCOREbackingTMEfundBalance={SCOREbackingTMEfundBalance}
          loadingGlobalProperties={loadingGlobalProperties}
          TMErate={currentTMERate}
          TSDrate={currentTSDRate}
          TMErateLoading={TMErateLoading}
        />
        {transactions.length === 0 && usersAccountHistoryLoading ? (
          <Loading style={{ marginTop: '20px' }} />
        ) : (
          <UserWalletTransactions
            transactions={transactions}
            actions={actions}
            currentUsername={user.name}
            totalSCORE={totalSCORE}
            SCOREbackingTMEfundBalance={SCOREbackingTMEfundBalance}
            getMoreUserAccountHistory={this.props.getMoreUserAccountHistory}
            loadingMoreUsersAccountHistory={loadingMoreUsersAccountHistory}
            userHasMoreActions={userHasMoreActions}
          />
        )}
      </div>
    );
  }
}

export default Wallet;
