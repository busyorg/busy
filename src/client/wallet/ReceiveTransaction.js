import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import { Tooltip } from 'antd';
import Avatar from '../components/Avatar';

const ReceiveTransaction = ({ from, memo, amount, timestamp }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__avatar">
      <Avatar username={from} size={40} />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        <FormattedMessage
          id="received_from"
          defaultMessage="Received from {username}"
          values={{
            username: (
              <Link to={`/@${from}`}>
                <span className="username">{from}</span>
              </Link>
            ),
          }}
        />
        <span className="UserWalletTransactions__received">
          {'+ '}
          {amount}
        </span>
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
      <span className="UserWalletTransactions__memo">{memo}</span>
    </div>
  </div>
);

ReceiveTransaction.propTypes = {
  from: PropTypes.string,
  memo: PropTypes.string,
  amount: PropTypes.element,
  timestamp: PropTypes.string,
};

ReceiveTransaction.defaultProps = {
  from: '',
  memo: '',
  amount: <span />,
  timestamp: '',
};

export default ReceiveTransaction;
