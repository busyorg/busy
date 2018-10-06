import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import formatter from '../helpers/blockchainProtocolFormatter';
import { calculateTotalDelegatedSCORE, calculateEstAccountValue } from '../vendor/blockchainProtocolHelpers';
import BTooltip from '../components/BTooltip';
import Loading from '../components/Icon/Loading';
import USDDisplay from '../components/Utils/USDDisplay';
import './UserWalletSummary.less';

const getFormattedTotalDelegatedSCORE = (user, totalSCORE, SCOREbackingTMEfundBalance) => {
  const totalDelegatedSCORE = calculateTotalDelegatedSCORE(
    user,
    totalSCORE,
    SCOREbackingTMEfundBalance,
  );

  if (totalDelegatedSCORE !== 0) {
    return (
      <BTooltip
        title={
          <span>
            <FormattedMessage
              id="SCORE_delegated_to_account_tooltip"
              defaultMessage="SCORE delegated to this account"
            />
          </span>
        }
      >
        <span>
          {totalDelegatedSCORE > 0 ? '(+' : '('}
          <FormattedNumber
            value={calculateTotalDelegatedSCORE(user, totalSCORE, SCOREbackingTMEfundBalance)}
          />
          {' POWER)'}
        </span>
      </BTooltip>
    );
  }

  return null;
};

const UserWalletSummary = ({
  user,
  loading,
  totalSCORE,
  SCOREbackingTMEfundBalance,
  loadingGlobalProperties,
  TMErate,
  TSDrate,
  TMErateLoading,
}) => (
  <div className="UserWalletSummary">
    <div className="UserWalletSummary__item">
      <i className="iconfont icon-steem UserWalletSummary__icon" />
      <div className="UserWalletSummary__label">
        <FormattedMessage id="TME" defaultMessage="TME" />
      </div>
      <div className="UserWalletSummary__value">
        {loading ? (
          <Loading />
        ) : (
          <span>
            <FormattedNumber value={parseFloat(user.balance)} />
            {' TME'}
          </span>
        )}
      </div>
    </div>
    <div className="UserWalletSummary__item">
      <i className="iconfont icon-flashlight_fill UserWalletSummary__icon" />
      <div className="UserWalletSummary__label">
        <FormattedMessage id="POWER" defaultMessage="POWER" />
      </div>
      <div className="UserWalletSummary__value">
        {loading || loadingGlobalProperties ? (
          <Loading />
        ) : (
          <span>
            <FormattedNumber
              value={parseFloat(
                formatter.SCOREinTMEvalue(
                  user.SCORE,
                  totalSCORE,
                  SCOREbackingTMEfundBalance,
                ),
              )}
            />
            {' POWER '}
            {getFormattedTotalDelegatedSCORE(user, totalSCORE, SCOREbackingTMEfundBalance)}
          </span>
        )}
      </div>
    </div>
    <div className="UserWalletSummary__item">
      <i className="iconfont icon-Dollar UserWalletSummary__icon" />
      <div className="UserWalletSummary__label">
        <FormattedMessage id="TSD" defaultMessage="TSD" />
      </div>
      <div className="UserWalletSummary__value">
        {loading ? (
          <Loading />
        ) : (
          <span>
            <FormattedNumber value={parseFloat(user.TSDbalance)} />
            {' TSD'}
          </span>
        )}
      </div>
    </div>
    <div className="UserWalletSummary__item">
      <i className="iconfont icon-savings UserWalletSummary__icon" />
      <div className="UserWalletSummary__label">
        <FormattedMessage id="savings" defaultMessage="Savings" />
      </div>
      <div className="UserWalletSummary__value">
        {loading ? (
          <Loading />
        ) : (
          <span>
            <FormattedNumber value={parseFloat(user.TMEsavingsBalance)} />
            {' TME, '}
            <FormattedNumber value={parseFloat(user.TSDsavingsBalance)} />
            {' TSD'}
          </span>
        )}
      </div>
    </div>
    {/* <div className="UserWalletSummary__item">
      <i className="iconfont icon-people_fill UserWalletSummary__icon" />
      <div className="UserWalletSummary__label">
        <FormattedMessage id="est_account_value" defaultMessage="Est. Account Value" />
      </div>
      <div className="UserWalletSummary__value">
        {loading || loadingGlobalProperties || TMErateLoading ? (
          <Loading />
        ) : (
          <USDDisplay
            value={calculateEstAccountValue(
              user,
              totalSCORE,
              SCOREbackingTMEfundBalance,
              TMErate,
              TSDrate,
            )}
          />
        )}
      </div>
    </div> */}
  </div>
);

UserWalletSummary.propTypes = {
  loadingGlobalProperties: PropTypes.bool.isRequired,
  user: PropTypes.shape().isRequired,
  totalSCORE: PropTypes.string.isRequired,
  SCOREbackingTMEfundBalance: PropTypes.string.isRequired,
  TMErate: PropTypes.number,
  TSDrate: PropTypes.number,
  loading: PropTypes.bool,
  TMErateLoading: PropTypes.bool,
};

UserWalletSummary.defaultProps = {
  TMErate: 1,
  TSDrate: 1,
  loading: false,
  TMErateLoading: false,
};

export default UserWalletSummary;
