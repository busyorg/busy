import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import Avatar from '../components/Avatar';

const TransferFromSavings = ({ from, memo, amount, timestamp }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__avatar">
      <Avatar username={from} />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        <FormattedMessage
          id="transfer_from_savings"
          defaultMessage="Transfer from savings {amount} to {username}"
          values={{
            amount,
            username: <Link to={`/@${from}`}>{from}</Link>,
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

TransferFromSavings.propTypes = {
  from: PropTypes.string,
  memo: PropTypes.string,
  amount: PropTypes.string,
  timestamp: PropTypes.string,
};

TransferFromSavings.defaultProps = {
  from: '',
  memo: '',
  amount: '',
  timestamp: '',
};

export default TransferFromSavings;
