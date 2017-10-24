import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import Avatar from '../components/Avatar';

const TransferToSavings = ({ to, memo, amount, timestamp }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__avatar">
      <Avatar username={to} />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        <FormattedMessage
          id="transfer_to_savings"
          defaultMessage="Transfer to savings {amount} to {username}"
          values={{
            amount,
            username: <Link to={`/@${to}`}>{to}</Link>,
          }}
        />
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

TransferToSavings.propTypes = {
  to: PropTypes.string,
  memo: PropTypes.string,
  amount: PropTypes.string,
  timestamp: PropTypes.string,
};

TransferToSavings.defaultProps = {
  to: '',
  memo: '',
  amount: '',
  timestamp: '',
};

export default TransferToSavings;
