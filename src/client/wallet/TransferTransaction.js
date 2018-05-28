import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import BTooltip from '../components/BTooltip';
import Avatar from '../components/Avatar';

const TransferTransaction = ({ to, memo, amount, timestamp }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__avatar">
      <Avatar username={to} size={40} />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        <div>
          <FormattedMessage
            id="transferred_to"
            defaultMessage="Transferred to {username}"
            values={{
              username: (
                <Link to={`/@${to}`}>
                  <span className="username">{to}</span>
                </Link>
              ),
            }}
          />
        </div>
        <div className="UserWalletTransactions__transfer">
          {'- '}
          {amount}
        </div>
      </div>
      <span className="UserWalletTransactions__timestamp">
        <BTooltip
          title={
            <span>
              <FormattedDate value={`${timestamp}Z`} /> <FormattedTime value={`${timestamp}Z`} />
            </span>
          }
        >
          <span>
            <FormattedRelative value={`${timestamp}Z`} />
          </span>
        </BTooltip>
      </span>
      <span className="UserWalletTransactions__memo">{memo}</span>
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
