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
  };

  static defaultProps = {
    actions: [],
  };

  constructor(props) {
    super(props);
    const firstAction = _.head(props.actions);
    this.state = {
      userHasMoreActions: firstAction.actionCount > defaultAccountLimit,
      lastActionCount: firstAction ? firstAction.actionCount : 0,
      loadingMoreActions: false,
    };
  }

  handleLoadMore = () => {
    const { currentUsername } = this.props;
    const { lastActionCount } = this.state;
    const limit = lastActionCount < defaultAccountLimit ? lastActionCount : defaultAccountLimit;
    this.setState({
      loadingMoreActions: true,
    });
    this.props
      .getMoreUserAccountHistory(currentUsername, lastActionCount, limit)
      .then((result) => {
        const newLastActionCount = _.last(result.value.userAccountHistory).actionCount;
        if (newLastActionCount === 0) {
          this.setState({
            userHasMoreActions: false,
            loadingMoreActions: false,
          });
        } else {
          this.setState({
            lastActionCount: newLastActionCount,
            loadingMoreActions: false,
          });
        }
      })
      .catch(() => {
        this.setState({
          userHasMoreActions: false,
          loadingMoreActions: false,
        });
      });
  };

  render() {
    const {
      actions,
      currentUsername,
      totalVestingShares,
      totalVestingFundSteem,
    } = this.props;
    const { loadingMoreActions } = this.state;
    return (
      <div className="UserActivityActions">
        <ReduxInfiniteScroll
          loadMore={this.handleLoadMore}
          hasMore={this.state.userHasMoreActions}
          elementIsScrollable={false}
          threshold={200}
          loader={<div style={{ margin: '20px' }}><Loading /></div>}
          loadingMore={loadingMoreActions}
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
