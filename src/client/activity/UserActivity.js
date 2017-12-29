import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  getUser,
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getTotalVestingShares,
  getTotalVestingFundSteem,
  getUsersAccountHistory,
  getUsersAccountHistoryLoading,
  getUsersEstAccountsValues,
  getLoadingGlobalProperties,
  getAccountHistoryFilter,
  getCurrentDisplayedActions,
} from '../reducers';
import {
  getGlobalProperties,
  getUserEstAccountValue,
  getUserAccountHistory,
  getMoreUserAccountHistory,
  updateAccountHistoryFilter,
  setInitialCurrentDisplayedActions,
} from '../wallet/walletActions';
import { getAccount } from '../user/usersActions';
import Loading from '../components/Icon/Loading';
import UserActivityActions from './UserActivityActions';

@withRouter
@connect(
  (state, ownProps) => ({
    user: ownProps.isCurrentUser
      ? getAuthenticatedUser(state)
      : getUser(state, ownProps.match.params.name),
    authenticatedUserName: getAuthenticatedUserName(state),
    totalVestingShares: getTotalVestingShares(state),
    totalVestingFundSteem: getTotalVestingFundSteem(state),
    usersAccountHistory: getUsersAccountHistory(state),
    usersAccountHistoryLoading: getUsersAccountHistoryLoading(state),
    usersEstAccountsValues: getUsersEstAccountsValues(state),
    loadingGlobalProperties: getLoadingGlobalProperties(state),
    accountHistoryFilter: getAccountHistoryFilter(state),
    currentDisplayedActions: getCurrentDisplayedActions(state),
  }),
  {
    getGlobalProperties,
    getUserAccountHistory,
    getMoreUserAccountHistory,
    getAccount,
    getUserEstAccountValue,
    updateAccountHistoryFilter,
    setInitialCurrentDisplayedActions,
  },
)
class UserActivity extends React.Component {
  static propTypes = {
    usersAccountHistoryLoading: PropTypes.bool.isRequired,
    loadingGlobalProperties: PropTypes.bool.isRequired,
    getGlobalProperties: PropTypes.func.isRequired,
    getUserAccountHistory: PropTypes.func.isRequired,
    getUserEstAccountValue: PropTypes.func.isRequired,
    getAccount: PropTypes.func.isRequired,
    updateAccountHistoryFilter: PropTypes.func.isRequired,
    setInitialCurrentDisplayedActions: PropTypes.func.isRequired,
    location: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    usersAccountHistory: PropTypes.shape().isRequired,
    usersEstAccountsValues: PropTypes.shape().isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    currentDisplayedActions: PropTypes.arrayOf(PropTypes.shape()),
    isCurrentUser: PropTypes.bool,
    authenticatedUserName: PropTypes.string,
  };

  static defaultProps = {
    currentDisplayedActions: [],
    isCurrentUser: false,
    authenticatedUserName: '',
  };

  componentDidMount() {
    const {
      totalVestingShares,
      totalVestingFundSteem,
      usersEstAccountsValues,
      usersAccountHistory,
      user,
      isCurrentUser,
      authenticatedUserName,
      currentDisplayedActions,
    } = this.props;
    const username = isCurrentUser
      ? authenticatedUserName
      : this.props.location.pathname.match(/@(.*)(.*?)\//)[1];

    if (_.isEmpty(totalVestingFundSteem) || _.isEmpty(totalVestingShares)) {
      this.props.getGlobalProperties();
    }

    if (_.isEmpty(usersAccountHistory[username])) {
      this.props.getUserAccountHistory(username);
    }

    if (_.isEmpty(user)) {
      this.props.getAccount(username);
    }

    if (_.isEmpty(usersEstAccountsValues[username]) && !_.isEmpty(user.name)) {
      this.props.getUserEstAccountValue(user);
    }

    if (_.isEmpty(currentDisplayedActions)) {
      this.props.setInitialCurrentDisplayedActions(user.name);
    }

    this.props.updateAccountHistoryFilter({
      username: user.name,
      accountHistoryFilter: [],
    });
  }

  render() {
    const {
      user,
      usersAccountHistory,
      usersAccountHistoryLoading,
      loadingGlobalProperties,
      isCurrentUser,
    } = this.props;
    const actions = usersAccountHistory[user.name] || [];

    return (
      <div>
        {actions.length === 0 || usersAccountHistoryLoading || loadingGlobalProperties ? (
          <Loading style={{ marginTop: '20px' }} />
        ) : (
          <UserActivityActions isCurrentUser={isCurrentUser} />
        )}
      </div>
    );
  }
}

export default UserActivity;
