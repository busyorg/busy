import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import Avatar from '../components/Avatar';
import { numberWithCommas } from '../helpers/regexHelpers';

const getSavingsTransactionMessage = (transactionType, transactionDetails) => {
  switch (transactionType) {
    case 'cancel_transfer_from_savings':
      return (
        <FormattedMessage
          id="cancel_transfer_from_savings"
          defaultMessage="Cancel transfer from savings (request {requestId})"
          values={{
            requestId: transactionDetails.request_id,
          }}
        />
      );
    case 'transfer_to_savings':
      return (
        <FormattedMessage
          id="transfer_to_savings"
          defaultMessage="Transfer to savings {amount} to {username}"
          values={{
            amount: numberWithCommas(transactionDetails.amount),
            username: <Link to={`/@${transactionDetails.to}`}>{transactionDetails.to}</Link>,
          }}
        />
      );
    case 'transfer_from_savings':
    default:
      return (
        <FormattedMessage
          id="transfer_from_savings"
          defaultMessage="Transfer from savings {amount} to {username}"
          values={{
            amount: numberWithCommas(transactionDetails.amount),
            username: <Link to={`/@${transactionDetails.from}`}>{transactionDetails.from}</Link>,
          }}
        />
      );
  }
};

const SavingsTransaction = ({ timestamp, transactionType, transactionDetails }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__avatar">
      <Avatar
        username={
          transactionType === 'transfer_to_savings'
            ? transactionDetails.to
            : transactionDetails.from
        }
        size={40}
      />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        {getSavingsTransactionMessage(transactionType, transactionDetails)}
      </div>
      <span className="UserWalletTransactions__timestamp">
        <FormattedRelative value={`${timestamp}Z`} />
      </span>
      <span className="UserWalletTransactions__memo">
        {transactionDetails.memo}
      </span>
    </div>
  </div>
);

SavingsTransaction.propTypes = {
  timestamp: PropTypes.string,
  transactionDetails: PropTypes.shape(),
  transactionType: PropTypes.string,
};

SavingsTransaction.defaultProps = {
  timestamp: '',
  transactionDetails: {},
  transactionType: PropTypes.string,
};

export default SavingsTransaction;
