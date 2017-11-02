import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedNumber } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroller';
import ReceiveTransaction from './ReceiveTransaction';
import TransferTransaction from './TransferTransaction';
import SavingsTransaction from './SavingsTransaction';
import PowerUpTransaction from './PowerUpTransaction';
import ClaimReward from './ClaimReward';
import './UserWalletTransactions.less';

class UserWalletTransactions extends Component {
  static propTypes = {
    transactions: PropTypes.arrayOf(PropTypes.shape()),
    getMoreUserTransactions: PropTypes.func.isRequired,
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
      userHasMoreTransactions: true,
      lastActionId: firstTransaction ? firstTransaction.actionId : 0,
    };
  }

  componentWillReceiveProps() {

  }

  getFormattedTransactionAmount = (amount, currency) => {
    const transaction = amount.split(' ');
    const transactionAmount = parseFloat(transaction[0]).toFixed(3);
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
    const { lastActionId } = this.state;
    console.log('HANDLE LOAD MORE ENABLED');
    this.props
      .getMoreUserTransactions(currentUsername, lastActionId)
      .then((result) => {
        const newLastActionID = _.head(result.value.transactions).actionId;
        if (lastActionId === newLastActionID) {
          this.setState({
            userHasMoreTransactions: false,
          });
        } else {
          this.setState({
            lastActionId: newLastActionID,
          });
        }
      })
      .catch(() => {
        console.log('CAUGHT USER WALLET TRANSACTIONS ERROR LOADING');
        this.setState({
          userHasMoreTransactions: false,
        });
      });
  };

  render() {
    const { transactions, currentUsername, totalVestingShares, totalVestingFundSteem } = this.props;
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.handleLoadMore}
        hasMore={this.state.userHasMoreTransactions}
        useWindow
      >
        <div className="UserWalletTransactions">
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
        </div>
      </InfiniteScroll>
    );
  }
}

export default UserWalletTransactions;
