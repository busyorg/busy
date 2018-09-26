import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import * as accountHistoryConstants from '../../common/constants/accountHistory';
import ReceiveTransaction from './ReceiveTransaction';
import TransferTransaction from './TransferTransaction';
import SavingsTransaction from './SavingsTransaction';
import PowerUpTransaction from './PowerUpTransaction';
import ClaimReward from './ClaimReward';
import './UserWalletTransactions.less';

const getFormattedTransactionAmount = (amount, currency) => {
  if (!amount) {
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

const WalletTransaction = ({
  transaction,
  currentUsername,
  totalSCORE,
  SCOREbackingTMEfundBalance,
}) => {
  const transactionType = transaction.op[0];
  const transactionDetails = transaction.op[1];
  switch (transactionType) {
    case accountHistoryConstants.transferTMEtoSCOREfund:
      return (
        <PowerUpTransaction
          amount={getFormattedTransactionAmount(transactionDetails.amount, 'SCORE')}
          timestamp={transaction.timestamp}
          to={transactionDetails.to}
          from={transactionDetails.from}
        />
      );
    case accountHistoryConstants.TRANSFER:
      if (transactionDetails.to === currentUsername) {
        return (
          <ReceiveTransaction
            from={transactionDetails.from}
            memo={transactionDetails.memo}
            amount={getFormattedTransactionAmount(transactionDetails.amount)}
            timestamp={transaction.timestamp}
          />
        );
      }
      return (
        <TransferTransaction
          to={transactionDetails.to}
          memo={transactionDetails.memo}
          amount={getFormattedTransactionAmount(transactionDetails.amount)}
          timestamp={transaction.timestamp}
        />
      );
    case accountHistoryConstants.claimRewardBalance:
      return (
        <ClaimReward
          timestamp={transaction.timestamp}
          TMEreward={transactionDetails.TMEreward}
          TSDreward={transactionDetails.TSDreward}
          SCOREreward={transactionDetails.reward_vests}
          totalSCORE={totalSCORE}
          SCOREbackingTMEfundBalance={SCOREbackingTMEfundBalance}
        />
      );
    case accountHistoryConstants.transferToSavings:
    case accountHistoryConstants.transferFromSavings:
    case accountHistoryConstants.cancelTransferFromSavings:
      return (
        <SavingsTransaction
          transactionDetails={transactionDetails}
          transactionType={transactionType}
          amount={getFormattedTransactionAmount(transactionDetails.amount)}
          timestamp={transaction.timestamp}
        />
      );
    default:
      return null;
  }
};

WalletTransaction.propTypes = {
  transaction: PropTypes.shape().isRequired,
  currentUsername: PropTypes.string.isRequired,
  totalSCORE: PropTypes.string.isRequired,
  SCOREbackingTMEfundBalance: PropTypes.string.isRequired,
};

export default WalletTransaction;
