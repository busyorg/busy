import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  getUser,
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getTotalVestingShares,
  getTotalVestingFundSteem,
  getUsersAccountHistory,
  getLoadingMoreUsersAccountHistory,
  getUserHasMoreAccountHistory,
  getAccountHistoryFilter,
  getCurrentDisplayedActions,
  getCurrentFilteredActions,
} from '../reducers';
import { isWalletTransaction } from '../helpers/apiHelpers';
import {
  setInitialCurrentDisplayedActions,
  addMoreActionsToCurrentDisplayedActions,
  loadMoreCurrentUsersActions,
} from '../wallet/walletActions';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import WalletTransaction from '../wallet/WalletTransaction';
import UserAction from './UserAction';

@withRouter
@connect(
  (state, ownProps) => ({
    user: ownProps.isCurrentUser
      ? getAuthenticatedUser(state)
      : getUser(state, ownProps.match.params.name),
    totalVestingShares: getTotalVestingShares(state),
    totalVestingFundSteem: getTotalVestingFundSteem(state),
    usersAccountHistory: getUsersAccountHistory(state),
    loadingMoreUsersAccountHistory: getLoadingMoreUsersAccountHistory(state),
    userHasMoreActions: getUserHasMoreAccountHistory(
      state,
      ownProps.isCurrentUser
        ? getAuthenticatedUserName(state)
        : getUser(state, ownProps.match.params.name).name,
    ),
    accountHistoryFilter: getAccountHistoryFilter(state),
    currentDisplayedActions: getCurrentDisplayedActions(state),
    currentFilteredActions: getCurrentFilteredActions(state),
  }),
  {
    setInitialCurrentDisplayedActions,
    addMoreActionsToCurrentDisplayedActions,
    loadMoreCurrentUsersActions,
  },
)
class UserActivityActionsList extends Component {
  static propTypes = {
    userHasMoreActions: PropTypes.bool.isRequired,
    loadingMoreUsersAccountHistory: PropTypes.bool.isRequired,
    setInitialCurrentDisplayedActions: PropTypes.func.isRequired,
    loadMoreCurrentUsersActions: PropTypes.func.isRequired,
    user: PropTypes.shape().isRequired,
    usersAccountHistory: PropTypes.shape().isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    currentDisplayedActions: PropTypes.arrayOf(PropTypes.shape()),
    currentFilteredActions: PropTypes.arrayOf(PropTypes.shape()),
    accountHistoryFilter: PropTypes.arrayOf(PropTypes.string),
    isCurrentUser: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  };

  static defaultProps = {
    accountHistoryFilter: [],
    currentDisplayedActions: [],
    currentFilteredActions: [],
    isCurrentUser: false,
  };

  constructor(props) {
    super(props);
    if (_.isEmpty(props.currentDisplayedActions)) {
      this.props.setInitialCurrentDisplayedActions(props.user.name);
    }
  }

  handleLoadMore = () => {
    const { user } = this.props;
    this.props.loadMoreCurrentUsersActions(user.name);
  };

  render() {
    const {
      usersAccountHistory,
      user,
      totalVestingShares,
      totalVestingFundSteem,
      userHasMoreActions,
      loadingMoreUsersAccountHistory,
      accountHistoryFilter,
      currentDisplayedActions,
      currentFilteredActions,
    } = this.props;
    const currentUsername = user.name;
    const actions = usersAccountHistory[currentUsername];
    const displayedActions = _.isEmpty(accountHistoryFilter)
      ? currentDisplayedActions
      : currentFilteredActions;
    const hasMore = userHasMoreActions || actions.length !== currentDisplayedActions.length;

    return (
      <ReduxInfiniteScroll
        loadMore={this.handleLoadMore}
        hasMore={hasMore}
        elementIsScrollable={false}
        threshold={200}
        loader={null}
        loadingMore={loadingMoreUsersAccountHistory}
      >
        <div />
        {displayedActions.map(
          action =>
            isWalletTransaction(action.op[0]) ? (
              <WalletTransaction
                key={`${action.trx_id}${action.actionCount}`}
                transaction={action}
                currentUsername={currentUsername}
                totalVestingShares={totalVestingShares}
                totalVestingFundSteem={totalVestingFundSteem}
              />
            ) : (
              <UserAction
                key={`${action.trx_id}${action.actionCount}`}
                action={action}
                totalVestingShares={totalVestingShares}
                totalVestingFundSteem={totalVestingFundSteem}
                currentUsername={currentUsername}
              />
            ),
        )}
      </ReduxInfiniteScroll>
    );
  }
}

export default UserActivityActionsList;
