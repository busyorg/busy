import React from 'react';
import PropTypes from 'prop-types';
import './UserWalletSummary.less';
import './UserWalletTransactions.less';
import ReceiveTransaction from './ReceiveTransaction';
import TransferTransaction from './TransferTransaction';
import CurationReward from './CurationReward';
import AuthorReward from './AuthorReward';

const UserWalletTransactions = ({
  transactions,
  currentUsername,
  totalVestingShares,
  totalVestingFundSteem,
}) => (
  <div className="UserWalletTransactions">
    {transactions
      .map((transaction, index) => {
        const key = `${transaction.trx_id}${index}`;
        const transactionType = transaction.op[0];
        const transactionDetails = transaction.op[1];

        switch (transactionType) {
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
          case 'curation_reward':
            return (
              <CurationReward
                key={key}
                timestamp={transaction.timestamp}
                reward={transactionDetails.reward}
                totalVestingShares={totalVestingShares}
                totalVestingFundSteem={totalVestingFundSteem}
              />
            );
          case 'author_reward':
            return (
              <AuthorReward
                key={key}
                sbdPayout={transactionDetails.sbd_payout}
                steemPayout={transactionDetails.steem_payout}
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
  totalVestingShares: PropTypes.string,
  totalVestingFundSteem: PropTypes.string,
};

UserWalletTransactions.defaultProps = {
  transactions: [],
  currentUsername: '',
  totalVestingShares: '',
  totalVestingFundSteem: '',
};

export default UserWalletTransactions;
