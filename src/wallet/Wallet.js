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

@injectIntl
@connect(null, {
  openTransfer,
})
class Wallet extends React.Component {
  static propTypes = {
    openTransfer: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
  };

  handleOpenTransfer = () => {
    this.props.openTransfer('');
  };

  render() {
    return (
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
                primary
                style={{ marginBottom: '10px' }}
                text={this.props.intl.formatMessage({
                  id: 'transfer',
                  defaultMessage: 'Transfer',
                })}
                onClick={this.handleOpenTransfer}
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
  }
}

export default Wallet;
