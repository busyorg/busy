import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroller';
import ReceiveTransaction from './ReceiveTransaction';
import TransferTransaction from './TransferTransaction';
import SavingsTransaction from './SavingsTransaction';
import PowerUpTransaction from './PowerUpTransaction';
import ClaimReward from './ClaimReward';
import './UserWalletTransactions.less';

const getFormattedTransactionAmount = (amount, currency) => {
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

const getMoreTransactions = () => {
  console.log('GET MORE TRANSACTIONS');
};

const UserWalletTransactions = ({
  transactions,
  currentUsername,
  totalVestingShares,
  totalVestingFundSteem,
}) => (
  <InfiniteScroll pageStart={0} loadMore={getMoreTransactions} hasMore useWindow>
    <div className="UserWalletTransactions">
      {transactions.reverse().map((transaction, index) => {
        const key = `${transaction.trx_id}${index}`;
        const transactionType = transaction.op[0];
        const transactionDetails = transaction.op[1];

        switch (transactionType) {
          case 'transfer_to_vesting':
            return (
              <PowerUpTransaction
                key={key}
                amount={getFormattedTransactionAmount(transactionDetails.amount, 'SP')}
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
                  amount={getFormattedTransactionAmount(transactionDetails.amount)}
                  timestamp={transaction.timestamp}
                />
              );
            }
            return (
              <TransferTransaction
                key={key}
                to={transactionDetails.to}
                memo={transactionDetails.memo}
                amount={getFormattedTransactionAmount(transactionDetails.amount)}
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
                amount={getFormattedTransactionAmount(transactionDetails.amount)}
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

UserWalletTransactions.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.shape()),
  currentUsername: PropTypes.string,
  totalVestingShares: PropTypes.string.isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
};

UserWalletTransactions.defaultProps = {
  transactions: [],
  currentUsername: '',
};

export default UserWalletTransactions;
