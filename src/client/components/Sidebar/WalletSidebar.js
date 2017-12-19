import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { openTransfer } from '../../wallet/walletActions';
import { getAuthenticatedUser } from '../../reducers';
import { STEEM, SBD } from '../../../common/constants/cryptos';
import Action from '../Button/Action';
import ClaimRewardsBlock from '../../wallet/ClaimRewardsBlock';
import CryptoTrendingCharts from './CryptoTrendingCharts';

@withRouter
@injectIntl
@connect(
  state => ({
    user: getAuthenticatedUser(state),
  }),
  {
    openTransfer,
  },
)
class WalletSidebar extends React.Component {
  static propTypes = {
    user: PropTypes.shape(),
    isCurrentUser: PropTypes.bool,
    match: PropTypes.shape().isRequired,
    openTransfer: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    user: {},
    isCurrentUser: false,
  };

  handleOpenTransfer = () => {
    const { match, user, isCurrentUser } = this.props;
    const username = match.params.name === user.name || isCurrentUser ? '' : match.params.name;
    this.props.openTransfer(username);
  };

  render() {
    const { match, user, isCurrentUser } = this.props;
    const displayClaimRewards = match.params.name === user.name || isCurrentUser;
    const cryptos = [STEEM.symbol, SBD.symbol];

    return (
      <div>
        <Action
          primary
          style={{ marginBottom: '10px' }}
          text={this.props.intl.formatMessage({
            id: 'transfer',
            defaultMessage: 'Transfer',
          })}
          onClick={this.handleOpenTransfer}
        />
        <CryptoTrendingCharts cryptos={cryptos} />
        {displayClaimRewards && <ClaimRewardsBlock />}
      </div>
    );
  }
}

export default WalletSidebar;
