import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import { Tooltip } from 'antd';
import Avatar from '../components/Avatar';

const getSavingsTransactionMessage = (transactionType, transactionDetails, amount) => {
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
            amount,
            username: (
              <Link to={`/@${transactionDetails.to}`}>
                <span className="username">{transactionDetails.to}</span>
              </Link>
            ),
          }}
        />
      );
    case 'transfer_from_savings':
      return (
        <FormattedMessage
          id="transfer_from_savings"
          defaultMessage="Transfer from savings {amount} to {username}"
          values={{
            amount,
            username: (
              <Link to={`/@${transactionDetails.from}`}>
                <span className="username">{transactionDetails.from}</span>
              </Link>
            ),
          }}
        />
      );
    default:
      return null;
  }
};

const SavingsTransaction = ({ timestamp, transactionType, transactionDetails, amount }) => (
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
        {getSavingsTransactionMessage(transactionType, transactionDetails, amount)}
      </div>
      <span className="UserWalletTransactions__timestamp">
        <Tooltip
          title={
            <span>
              <FormattedDate value={`${timestamp}Z`} /> <FormattedTime value={`${timestamp}Z`} />
            </span>
          }
        >
          <span>
            <FormattedRelative value={`${timestamp}Z`} />
          </span>
        </Tooltip>
      </span>
      <span className="UserWalletTransactions__memo">{transactionDetails.memo}</span>
    </div>
  </div>
);

SavingsTransaction.propTypes = {
  timestamp: PropTypes.string,
  transactionDetails: PropTypes.shape(),
  transactionType: PropTypes.string,
  amount: PropTypes.element,
};

SavingsTransaction.defaultProps = {
  timestamp: '',
  transactionDetails: {},
  transactionType: PropTypes.string,
  amount: <span />,
};

export default SavingsTransaction;
