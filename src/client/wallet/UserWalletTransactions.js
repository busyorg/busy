import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedNumber } from 'react-intl';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import { defaultAccountLimit } from '../helpers/apiHelpers';
import Loading from '../components/Icon/Loading';
import ReceiveTransaction from './ReceiveTransaction';
import TransferTransaction from './TransferTransaction';
import SavingsTransaction from './SavingsTransaction';
import PowerUpTransaction from './PowerUpTransaction';
import ClaimReward from './ClaimReward';
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

  getFormattedTransactionAmount = (amount, currency) => {
    if (_.isEmpty(amount)) {
      return null;
    }

    const transaction = amount.split(' ');
    const transactionAmount = parseFloat(transaction[0]);
    const transactionCurrency = currency || transaction[1];
    return (
      <span>
        <FormattedNumber
          value={transactionAmount}
          minimumFractionDigits={3}
          maximumFractionDigits={3}
        />
        {` ${transactionCurrency}`}
      </span>
    );
  };

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
          {transactions.map((transaction, index) => {
            const key = `${transaction.trx_id}${index}`;
            const transactionType = transaction.op[0];
            const transactionDetails = transaction.op[1];

            switch (transactionType) {
              case 'transfer_to_vesting':
                return (
                  <PowerUpTransaction
                    key={key}
                    amount={this.getFormattedTransactionAmount(transactionDetails.amount, 'SP')}
                    timestamp={transaction.timestamp}
                  />
                );
              case 'transfer':
                if (transactionDetails.to === currentUsername) {
                  return (
                    <ReceiveTransaction
                      key={key}
                      from={transactionDetails.from}
                      memo={transactionDetails.memo}
                      amount={this.getFormattedTransactionAmount(transactionDetails.amount)}
                      timestamp={transaction.timestamp}
                    />
                  );
                }
                return (
                  <TransferTransaction
                    key={key}
                    to={transactionDetails.to}
                    memo={transactionDetails.memo}
                    amount={this.getFormattedTransactionAmount(transactionDetails.amount)}
                    timestamp={transaction.timestamp}
                  />
                );
              case 'claim_reward_balance':
                return (
                  <ClaimReward
                    key={key}
                    timestamp={transaction.timestamp}
                    rewardSteem={transactionDetails.reward_steem}
                    rewardSbd={transactionDetails.reward_sbd}
                    rewardVests={transactionDetails.reward_vests}
                    totalVestingShares={totalVestingShares}
                    totalVestingFundSteem={totalVestingFundSteem}
                  />
                );
              case 'transfer_to_savings':
              case 'transfer_from_savings':
              case 'cancel_transfer_from_savings':
                return (
                  <SavingsTransaction
                    key={key}
                    transactionDetails={transactionDetails}
                    transactionType={transactionType}
                    amount={this.getFormattedTransactionAmount(transactionDetails.amount)}
                    timestamp={transaction.timestamp}
                  />
                );
              default:
                return null;
            }
          })}
        </ReduxInfiniteScroll>
      </div>
    );
  }
}

export default UserWalletTransactions;
