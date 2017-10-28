import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../components/Avatar';

const TransferTransaction = ({ to, memo, amount, timestamp }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__avatar">
      <Avatar username={to} size={40} />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        <FormattedMessage
          id="transferred_to"
          defaultMessage="Transferred to {username}"
          values={{
            username: <Link to={`/@${to}`}>{to}</Link>,
          }}
        />
        <span className="UserWalletTransactions__transfer">
          {'- '}{amount}
        </span>
      </div>
      <span className="UserWalletTransactions__timestamp">
        <FormattedRelative value={`${timestamp}Z`} />
      </span>
      <span className="UserWalletTransactions__memo">
        {memo}
      </span>
    </div>
  </div>
);

TransferTransaction.propTypes = {
  to: PropTypes.string,
  memo: PropTypes.string,
  amount: PropTypes.element,
  timestamp: PropTypes.string,
};

TransferTransaction.defaultProps = {
  to: '',
  memo: '',
  amount: <span />,
  timestamp: '',
};

export default TransferTransaction;
