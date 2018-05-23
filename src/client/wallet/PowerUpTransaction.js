import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import BTooltip from '../components/BTooltip';

const PowerUpTransaction = ({ timestamp, amount }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__icon-container">
      <i className="iconfont icon-flashlight_fill UserWalletTransactions__icon" />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        <div>
          <FormattedMessage id="powered_up" defaultMessage="Powered up " />
        </div>
        <div className="UserWalletTransactions__payout">{amount}</div>
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
    </div>
  </div>
);

PowerUpTransaction.propTypes = {
  timestamp: PropTypes.string.isRequired,
  amount: PropTypes.element.isRequired,
};

export default PowerUpTransaction;
