import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReduxInfiniteScroll from 'redux-infinite-scroll';
import { isWalletTransaction, defaultAccountLimit } from '../helpers/apiHelpers';
import WalletTransaction from '../wallet/WalletTransaction';
import Loading from '../components/Icon/Loading';
import UserAction from './UserAction';
import './UserActivityActions.less';

class UserActivityActions extends React.Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape()),
    currentUsername: PropTypes.string.isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    getMoreUserAccountHistory: PropTypes.func.isRequired,
    userHasMoreActions: PropTypes.bool.isRequired,
    loadingMoreUsersAccountHistory: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    actions: [],
  };

  handleLoadMore = () => {
    const { currentUsername, actions } = this.props;
    const lastActionCount = _.last(actions).actionCount;
    const limit = lastActionCount < defaultAccountLimit ? lastActionCount : defaultAccountLimit;
    this.props.getMoreUserAccountHistory(currentUsername, lastActionCount, limit);
  };

  render() {
    const {
      actions,
      currentUsername,
      totalVestingShares,
      totalVestingFundSteem,
      userHasMoreActions,
      loadingMoreUsersAccountHistory,
    } = this.props;

    return (
      <div className="UserActivityActions">
        <ReduxInfiniteScroll
          loadMore={this.handleLoadMore}
          hasMore={userHasMoreActions}
          elementIsScrollable={false}
          threshold={200}
          loader={<div style={{ margin: '20px' }}><Loading /></div>}
          loadingMore={loadingMoreUsersAccountHistory}
        >
          {actions.map(
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
                />),
          )}
        </ReduxInfiniteScroll>
      </div>
    );
  }
}

export default UserActivityActions;
