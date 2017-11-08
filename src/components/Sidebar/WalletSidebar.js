import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { openTransfer } from '../../wallet/walletActions';
import { getAuthenticatedUser } from '../../reducers';
import Action from '../Button/Action';
import ClaimRewardsBlock from '../../wallet/ClaimRewardsBlock';
import SteemTrendingCharts from './SteemTrendingCharts';

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
    this.props.openTransfer('');
  };

  render() {
    const { match, user, isCurrentUser } = this.props;
    if (match.params.name === user.name || isCurrentUser) {
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
          <SteemTrendingCharts />
          <ClaimRewardsBlock />
        </div>
      );
    }

    return <SteemTrendingCharts />;
  }
}

export default WalletSidebar;
