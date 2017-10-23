import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import Avatar from '../components/Avatar';

const ReceiveTransaction = ({ from, memo, amount, timestamp }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__avatar">
      <Avatar username={from} />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        <FormattedMessage
          id="received_from"
          defaultMessage="Received from {username}"
          values={{
            username: <Link to={`/@${from}`}>{from}</Link>,
          }}
        />
        <span className="UserWalletTransactions__received">{`+ ${amount}`}</span>
      </div>
      <FormattedRelative value={`${timestamp}Z`} />
      <span className="UserWalletTransactions__memo">
        {memo}
      </span>
    </div>
  </div>
);

ReceiveTransaction.propTypes = {
  from: PropTypes.string,
  memo: PropTypes.string,
  amount: PropTypes.string,
  timestamp: PropTypes.string,
};

ReceiveTransaction.defaultProps = {
  from: '',
  memo: '',
  amount: '',
  timestamp: '',
};

export default ReceiveTransaction;
