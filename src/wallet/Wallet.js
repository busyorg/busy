import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { openTransfer } from '../wallet/walletActions';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import Action from '../components/Button/Action';
import SteemTrendingCharts from '../components/Sidebar/SteemTrendingCharts';
import UserWallet from '../user/UserWallet';
import ClaimRewardsBlock from './ClaimRewardsBlock';

const Wallet = props => (
  <div className="shifted">
    <div className="feed-layout container">
      <Affix className="leftContainer" stickPosition={77}>
        <div className="left">
          <LeftSidebar />
        </div>
      </Affix>
      <Affix className="rightContainer" stickPosition={77}>
        <div className="right">
          <Action
            style={{ marginBottom: '10px' }}
            text={props.intl.formatMessage({
              id: 'transfer',
              defaultMessage: 'Transfer',
            })}
            onClick={() => props.openTransfer('')}
            primary
          />
          <SteemTrendingCharts />
          <ClaimRewardsBlock />
        </div>
      </Affix>
      <div className="center">
        <UserWallet isCurrentUser />
      </div>
    </div>
  </div>
);

Wallet.propTypes = {
  openTransfer: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

export default connect(null, {
  openTransfer,
})(injectIntl(Wallet));
