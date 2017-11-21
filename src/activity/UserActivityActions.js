import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import { isWalletTransaction, defaultAccountLimit } from '../helpers/apiHelpers';
import { getMessageForActionType } from '../helpers/accountHistoryHelper';
import WalletTransaction from '../wallet/WalletTransaction';
import Loading from '../components/Icon/Loading';
import UserAction from './UserAction';
import './UserActivityActions.less';

const displayLimit = 100;

@injectIntl class UserActivityActions extends React.Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape()),
    currentUsername: PropTypes.string.isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    getMoreUserAccountHistory: PropTypes.func.isRequired,
    userHasMoreActions: PropTypes.bool.isRequired,
    loadingMoreUsersAccountHistory: PropTypes.bool.isRequired,
    accountHistoryFilter: PropTypes.arrayOf(PropTypes.string).isRequired,
    intl: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    actions: [],
  };

  constructor(props) {
    super(props);
    const displayedActions = props.actions.slice(0, displayLimit);
    const lastAction = _.last(displayedActions);
    this.state = {
      displayedActions,
      lastActionCount: lastAction ? lastAction.actionCount : 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    const displayedActions = this.props.actions.slice(0, displayLimit);
    const lastAction = _.last(displayedActions);

    if (!_.isEqual(this.props.accountHistoryFilter, nextProps.accountHistoryFilter)) {
      this.setState({
        displayedActions,
        lastActionCount: lastAction ? lastAction.actionCount : 0,
      });
    }
  }

  handleLoadMore = () => {
    const { currentUsername, actions } = this.props;
    const { displayedActions } = this.state;
    const lastDisplayedAction = _.last(displayedActions);
    const lastDisplayedActionCount = lastDisplayedAction.actionCount;
    const lastDisplayedActionIndex = _.findIndex(
      actions,
      action => action.actionCount === lastDisplayedActionCount,
    );
    const moreActions = actions.slice(
      lastDisplayedActionIndex + 1,
      lastDisplayedActionIndex + 1 + displayLimit,
    );
    const lastMoreActionsCount = _.last(moreActions).actionCount;

    if (moreActions.length === displayLimit || lastMoreActionsCount === 0) {
      this.setState({
        displayedActions: displayedActions.concat(moreActions),
      });
    } else {
      const lastActionCount = _.last(actions).actionCount;
      const limit = lastActionCount < defaultAccountLimit ? lastActionCount : defaultAccountLimit;
      this.props.getMoreUserAccountHistory(currentUsername, lastActionCount, limit);
    }
  };

  stringMatchesFilters = (string, filters = []) => {
    let filterMatches = false;
    for (let i = 0; i < filters.length; i += 1) {
      const currentFilter = filters[i];
      if (_.includes(string, currentFilter)) {
        filterMatches = true;
        break;
      }
    }
    return filterMatches;
  };

  actionsFilter = (action) => {
    const { accountHistoryFilter, intl, currentUsername } = this.props;
    const actionType = action.op[0];
    const formattedActionType = actionType.replace('_', ' ').toLowerCase();
    const actionDetails = action.op[1];
    const activitySearchIsEmpty = _.isEmpty(accountHistoryFilter);

    if (activitySearchIsEmpty) {
      return true;
    }

    const actionTypeMatchesFilter =
      this.stringMatchesFilters(actionType, accountHistoryFilter) ||
      this.stringMatchesFilters(formattedActionType, accountHistoryFilter);

    if (actionTypeMatchesFilter) {
      return true;
    }

    const messageForActionType = _.lowerCase(
      getMessageForActionType(intl, currentUsername, actionType, actionDetails),
    );

    return this.stringMatchesFilters(messageForActionType, accountHistoryFilter);
  };

  renderSearchMessage(filteredActions) {
    const { loadingMoreUsersAccountHistory } = this.props;
    if (filteredActions.length === 0 && loadingMoreUsersAccountHistory) {
      return (
        <div className="UserActivityActions__search__container">
          <FormattedMessage
            id="loading_more_account_history_for_filters"
            defaultMessage="Loading more of this user's account history for your filters"
          />
        </div>
      );
    } else if (filteredActions.length === 0) {
      return (
        <div className="UserActivityActions__search__container">
          <FormattedMessage
            id="no_results_found_for_search"
            defaultMessage="No results were found for your search input"
          />
        </div>
      );
    }
    return null;
  }

  render() {
    const {
      actions,
      currentUsername,
      totalVestingShares,
      totalVestingFundSteem,
      userHasMoreActions,
      loadingMoreUsersAccountHistory,
      accountHistoryFilter,
    } = this.props;
    const { displayedActions } = this.state;
    const filteredActions = _.isEmpty(accountHistoryFilter)
      ? displayedActions
      : _.filter(displayedActions, this.actionsFilter);
    const hasMore = userHasMoreActions || actions.length !== displayedActions.length;

    return (
      <div className="UserActivityActions">
        {this.renderSearchMessage(filteredActions)}
        <ReduxInfiniteScroll
          loadMore={this.handleLoadMore}
          hasMore={hasMore}
          elementIsScrollable={false}
          threshold={200}
          loader={<div style={{ margin: '20px' }}><Loading /></div>}
          loadingMore={loadingMoreUsersAccountHistory}
        >
          {filteredActions.map(
            action =>
              (isWalletTransaction(action.op[0])
                ? <WalletTransaction
                  key={`${action.trx_id}${action.actionCount}`}
                  transaction={action}
                  currentUsername={currentUsername}
                  totalVestingShares={totalVestingShares}
                  totalVestingFundSteem={totalVestingFundSteem}
                />
                : <UserAction
                  key={`${action.trx_id}${action.actionCount}`}
                  action={action}
                  totalVestingShares={totalVestingShares}
                  totalVestingFundSteem={totalVestingFundSteem}
                  currentUsername={currentUsername}
                />),
          )}
        </ReduxInfiniteScroll>
      </div>
    );
  }
}

export default UserActivityActions;
