import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import steem from 'steem';
import { Tooltip } from 'antd';
import { calculateTotalDelegatedSP, userHasRewards } from '../vendor/steemitHelpers';
import Loading from '../components/Icon/Loading';
import USDDisplay from '../components/Utils/USDDisplay';
import './UserWalletSummary.less';

const getFormattedTotalDelegatedSP = (user, totalVestingShares, totalVestingFundSteem) => {
  const totalDelegatedSP = calculateTotalDelegatedSP(
    user,
    totalVestingShares,
    totalVestingFundSteem,
  );

  if (totalDelegatedSP !== 0) {
    return (
      <Tooltip
        title={
          <span>
            <FormattedMessage
              id="steem_power_delegated_to_account_tooltip"
              defaultMessage="Steem Power delegated to this account"
            />
          </span>
        }
      >
        <span>
          {totalDelegatedSP > 0 ? '(+' : '('}
          <FormattedNumber
            value={calculateTotalDelegatedSP(user, totalVestingShares, totalVestingFundSteem)}
          />
          {' SP)'}
        </span>
      </Tooltip>
    );
  }

  return null;
};

const getRewards = (user) => {
  const rewardSteem = parseFloat(user.reward_steem_balance);
  const rewardSbd = parseFloat(user.reward_sbd_balance);
  const rewardSP = parseFloat(user.reward_vesting_steem);

  return (
    <span>
      {rewardSteem > 0 &&
        <span key="STEEM" className="UserWalletSummary__reward">
          <FormattedNumber
            value={rewardSteem}
            minimumFractionDigits={3}
            maximumFractionDigits={3}
          />
          {' STEEM'}
        </span>}
      {rewardSbd > 0 &&
        <span key="SBD" className="UserWalletSummary__reward">
          <FormattedNumber
            value={rewardSbd}
            minimumFractionDigits={3}
            maximumFractionDigits={3}
          />
          {' SBD'}
        </span>}
      {rewardSP > 0 &&
        <span key="SP" className="UserWalletSummary__reward">
          <FormattedNumber value={rewardSP} minimumFractionDigits={3} maximumFractionDigits={3} />
          {' SP'}
        </span>}
    </span>
  );
};

const UserWalletSummary = ({
  user,
  estAccountValue,
  loading,
  totalVestingShares,
  totalVestingFundSteem,
  loadingEstAccountValue,
  loadingGlobalProperties,
  isCurrentUser,
}) => (
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
        <FormattedMessage id="steem_power" defaultMessage="Steem Power" />
      </div>
      <div className="UserWalletSummary__value">
        {loading || loadingGlobalProperties
          ? <Loading />
          : <span>
            <FormattedNumber
              value={parseFloat(
                steem.formatter.vestToSteem(
                  user.vesting_shares,
                  totalVestingShares,
                  totalVestingFundSteem,
                ),
              )}
            />
            {' SP '}
            {getFormattedTotalDelegatedSP(user, totalVestingShares, totalVestingFundSteem)}
          </span>}
      </div>
    </div>
    <div className="UserWalletSummary__item">
      <i className="iconfont icon-Dollar UserWalletSummary__icon" />
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
      <i className="iconfont icon-savings UserWalletSummary__icon" />
      <div className="UserWalletSummary__label">
        <FormattedMessage id="savings" defaultMessage="Savings" />
      </div>
      <div className="UserWalletSummary__value">
        {loading
          ? <Loading />
          : <span>
            <FormattedNumber value={parseFloat(user.savings_balance)} />{' STEEM, '}
            <FormattedNumber value={parseFloat(user.savings_sbd_balance)} />{' SBD'}
          </span>}
      </div>
    </div>
    {(isCurrentUser && userHasRewards(user)) &&
      <div className="UserWalletSummary__item">
        <i className="iconfont icon-ranking UserWalletSummary__icon" />
        <div className="UserWalletSummary__label">
          <FormattedMessage id="rewards" defaultMessage="Rewards" />
        </div>
        <div className="UserWalletSummary__value">
          {loading ? <Loading /> : getRewards(user)}
        </div>
      </div>}
    <div className="UserWalletSummary__item">
      <i className="iconfont icon-people_fill UserWalletSummary__icon" />
      <div className="UserWalletSummary__label">
        <FormattedMessage id="est_account_value" defaultMessage="Est. Account Value" />
      </div>
      <div className="UserWalletSummary__value">
        {loadingEstAccountValue || !estAccountValue
          ? <Loading />
          : <USDDisplay value={parseFloat(estAccountValue)} />}
      </div>
    </div>
  </div>
);

UserWalletSummary.propTypes = {
  user: PropTypes.shape().isRequired,
  estAccountValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  totalVestingShares: PropTypes.string.isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  loadingEstAccountValue: PropTypes.bool,
  loadingGlobalProperties: PropTypes.bool.isRequired,
  isCurrentUser: PropTypes.bool,
};

UserWalletSummary.defaultProps = {
  loading: false,
  loadingEstAccountValue: false,
  estAccountValue: null,
  isCurrentUser: false,
};

export default UserWalletSummary;
