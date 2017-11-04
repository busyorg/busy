import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReduxInfiniteScroll from 'redux-infinite-scroll';
import { defaultAccountLimit } from '../helpers/apiHelpers';
import Loading from '../components/Icon/Loading';
import WalletTransaction from './WalletTransaction';
import './UserWalletTransactions.less';

class UserWalletTransactions extends React.Component {
  static propTypes = {
    transactions: PropTypes.arrayOf(PropTypes.shape()),
    getMoreUserAccountHistory: PropTypes.func.isRequired,
    currentUsername: PropTypes.string,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
  };

  static defaultProps = {
    transactions: [],
    currentUsername: '',
  };

  constructor(props) {
    super(props);
    const firstTransaction = _.head(props.transactions);
    this.state = {
      userHasMoreTransactions: firstTransaction.actionCount > defaultAccountLimit,
      lastActionCount: firstTransaction ? firstTransaction.actionCount : 0,
      loadingMoreTransactions: false,
    };
  }

  handleLoadMore = () => {
    const { currentUsername } = this.props;
    const { lastActionCount } = this.state;
    const limit = lastActionCount < defaultAccountLimit ? lastActionCount : defaultAccountLimit;
    this.setState({
      loadingMoreTransactions: true,
    });
    this.props
      .getMoreUserAccountHistory(currentUsername, lastActionCount, limit)
      .then((result) => {
        const newLastActionCount = _.last(result.value.userAccountHistory).actionCount;
        if (newLastActionCount === 0) {
          this.setState({
            userHasMoreTransactions: false,
            loadingMoreTransactions: false,
          });
        } else {
          this.setState({
            lastActionCount: newLastActionCount,
            loadingMoreTransactions: false,
          });
        }
      })
      .catch(() => {
        this.setState({
          userHasMoreTransactions: false,
          loadingMoreTransactions: false,
        });
      });
  };

  render() {
    const { transactions, currentUsername, totalVestingShares, totalVestingFundSteem } = this.props;
    const { loadingMoreTransactions } = this.state;

    return (
      <div className="UserWalletTransactions">
        <ReduxInfiniteScroll
          loadMore={this.handleLoadMore}
          hasMore={this.state.userHasMoreTransactions}
          elementIsScrollable={false}
          threshold={200}
          loader={<div style={{ margin: '20px' }}><Loading /></div>}
          loadingMore={loadingMoreTransactions}
        >
          {transactions.map(transaction => (
            <WalletTransaction
              key={`${transaction.trx_id}${transaction.actionCount}`}
              transaction={transaction}
              currentUsername={currentUsername}
              totalVestingShares={totalVestingShares}
              totalVestingFundSteem={totalVestingFundSteem}
            />
          ))}
        </ReduxInfiniteScroll>
      </div>
    );
  }
}

export default UserWalletTransactions;
