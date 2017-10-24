import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import Loading from '../components/Icon/Loading';
import './UserWalletSummary.less';
import USDDisplay from '../components/Utils/USDDisplay';

const UserWalletSummary = ({ user, estAccountValue, loading, loadingAccountValue }) => (
  <div className="UserWalletSummary">
    <div className="UserWalletSummary__item">
      <i className="iconfont icon-steem UserWalletSummary__icon" />
      <div className="UserWalletSummary__label">
        <FormattedMessage id="steem" defaultMessage="Steem" />
      </div>
      <div className="UserWalletSummary__value">
        {loading
          ? <Loading />
          : <span><FormattedNumber value={parseFloat(user.balance)} />{' STEEM'}</span>}
      </div>
    </div>
    <div className="UserWalletSummary__item">
      <i className="iconfont icon-flashlight_fill UserWalletSummary__icon" />
      <div className="UserWalletSummary__label">
        <FormattedMessage id="steem_dollar" defaultMessage="Steem Dollar" />
      </div>
      <div className="UserWalletSummary__value">
        {loading
          ? <Loading />
          : <span><FormattedNumber value={parseFloat(user.sbd_balance)} />{' SBD'}</span>}
      </div>
    </div>
    <div className="UserWalletSummary__item">
      <i className="iconfont icon-Dollar UserWalletSummary__icon" />
      <div className="UserWalletSummary__label">
        <FormattedMessage id="steem_power" defaultMessage="Steem Power" />
      </div>
      <div className="UserWalletSummary__value">
        {loading
          ? <Loading />
          : <span>
            <FormattedNumber value={parseFloat(user.steem_power)} />
            {' SP'}
          </span>}
      </div>
    </div>
    <div className="UserWalletSummary__item">
      <i className="iconfont icon-savings UserWalletSummary__icon" />
      <div className="UserWalletSummary__label">
        <FormattedMessage id="savings" defaultMessage="Savings" />
      </div>
      <div className="UserWalletSummary__value">
        {loading
          ? <Loading />
          : <span>
            <FormattedNumber value={parseFloat(user.savings_balance)} />{' STEEM'}<br />
            <FormattedNumber value={parseFloat(user.savings_sbd_balance)} />{' SBD'}
          </span>}
      </div>
    </div>
    <div className="UserWalletSummary__item">
      <i className="iconfont icon-people_fill UserWalletSummary__icon" />
      <div className="UserWalletSummary__label">
        <FormattedMessage id="est_account_value" defaultMessage="Est. Account Value" />
      </div>
      <div className="UserWalletSummary__value">
        {loadingAccountValue ? <Loading /> : <USDDisplay value={parseFloat(estAccountValue)} />}
      </div>
    </div>
  </div>
);

UserWalletSummary.propTypes = {
  user: PropTypes.shape().isRequired,
  estAccountValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  loading: PropTypes.bool.isRequired,
  loadingAccountValue: PropTypes.bool.isRequired,
};

export default UserWalletSummary;
