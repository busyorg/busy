import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { openTransfer, openPowerUpOrDown } from '../wallet/walletActions';
import { getAuthenticatedUser } from '../reducers';
import Action from '../components/Button/Action';
import ClaimRewardsBlock from '../wallet/ClaimRewardsBlock';
import './UserWalletButtons.less';

@withRouter
@connect(
  state => ({
    user: getAuthenticatedUser(state),
  }),
  {
    openTransfer,
    openPowerUpOrDown,
  },
)
class UserWalletButtons extends React.Component {
  static propTypes = {
    user: PropTypes.shape(),
    isCurrentUser: PropTypes.bool,
    match: PropTypes.shape().isRequired,
    openTransfer: PropTypes.func.isRequired,
    openPowerUpOrDown: PropTypes.func.isRequired,
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

  handleOpenPowerUp = () => {
    this.props.openPowerUpOrDown();
  };

  handleOpenPowerDown = () => {
    this.props.openPowerUpOrDown(true);
  };

  render() {
    const { match, user, isCurrentUser } = this.props;
    const ownProfile = match.params.name === user.name || isCurrentUser;

    return (
      <div className="UserWalletButtons">
        <div className="UserWalletButtons__transfer_and_power">
          <Action
            big
            className="UserWalletButtons__transfer"
            primary
            onClick={this.handleOpenTransfer}
          >
            <FormattedMessage id="transfer" defaultMessage="Transfer" />
          </Action>
          {ownProfile && (
            <div className="UserWalletButtons__power">
              <Action big onClick={this.handleOpenPowerUp}>
                <FormattedMessage id="power_up" defaultMessage="Power up" />
              </Action>
              <Action big onClick={this.handleOpenPowerDown}>
                <FormattedMessage id="power_down" defaultMessage="Power down" />
              </Action>
            </div>
          )}
        </div>
        {ownProfile && <ClaimRewardsBlock />}
      </div>
    );
  }
}

export default UserWalletButtons;
