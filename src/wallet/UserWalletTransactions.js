import React from 'react';
import PropTypes from 'prop-types';
import './UserWalletSummary.less';
import './UserWalletTransactions.less';
import ReceiveTransaction from './ReceiveTransaction';
import TransferTransaction from './TransferTransaction';
import SavingsTransaction from './SavingsTransaction';
import ClaimReward from './ClaimReward';

const UserWalletTransactions = ({ transactions, currentUsername }) => (
  <div className="UserWalletTransactions">
    {transactions
      .map((transaction, index) => {
        const key = `${transaction.trx_id}${index}`;
        const transactionType = transaction.op[0];
        const transactionDetails = transaction.op[1];

        switch (transactionType) {
          case 'transfer_to_vesting':
          case 'transfer':
            if (transactionDetails.to === currentUsername) {
              return (
                <ReceiveTransaction
                  key={key}
                  from={transactionDetails.from}
                  memo={transactionDetails.memo}
                  amount={transactionDetails.amount}
                  timestamp={transaction.timestamp}
                />
              );
            }
            return (
              <TransferTransaction
                key={key}
                to={transactionDetails.to}
                memo={transactionDetails.memo}
                amount={transactionDetails.amount}
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
                timestamp={transaction.timestamp}
              />
            );
          default:
            return null;
        }
      })
      .reverse()}
  </div>
);

UserWalletTransactions.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.shape()),
  currentUsername: PropTypes.string,
};

UserWalletTransactions.defaultProps = {
  transactions: [],
  currentUsername: '',
};

export default UserWalletTransactions;
