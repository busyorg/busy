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
  getUsersTransactions,
  getUsersAccountHistory,
  getUsersTransactionsLoading,
  getUsersEstAccountsValues,
  getLoadingEstAccountValue,
  getLoadingGlobalProperties,
} from '../reducers';
import {
  getGlobalProperties,
  getUserEstAccountValue,
  getUserAccountHistory,
  getMoreUserAccountHistory,
} from '../wallet/walletActions';
import { getAccountWithFollowingCount } from '../user/usersActions';
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
    usersTransactions: getUsersTransactions(state),
    usersAccountHistory: getUsersAccountHistory(state),
    usersTransactionsLoading: getUsersTransactionsLoading(state),
    usersEstAccountsValues: getUsersEstAccountsValues(state),
    loadingEstAccountValue: getLoadingEstAccountValue(state),
    loadingGlobalProperties: getLoadingGlobalProperties(state),
  }),
  {
    getGlobalProperties,
    getUserAccountHistory,
    getMoreUserAccountHistory,
    getAccountWithFollowingCount,
    getUserEstAccountValue,
  },
)
class UserActivity extends React.Component {
  static propTypes = {
    location: PropTypes.shape().isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    user: PropTypes.shape().isRequired,
    getGlobalProperties: PropTypes.func.isRequired,
    getUserAccountHistory: PropTypes.func.isRequired,
    getMoreUserAccountHistory: PropTypes.func.isRequired,
    getUserEstAccountValue: PropTypes.func.isRequired,
    getAccountWithFollowingCount: PropTypes.func.isRequired,
    usersAccountHistory: PropTypes.shape().isRequired,
    usersEstAccountsValues: PropTypes.shape().isRequired,
    usersTransactionsLoading: PropTypes.bool.isRequired,
    isCurrentUser: PropTypes.bool,
    authenticatedUserName: PropTypes.string,
  };

  static defaultProps = {
    isCurrentUser: false,
    authenticatedUserName: '',
  };

  componentWillMount() {
    const {
      totalVestingShares,
      totalVestingFundSteem,
      usersEstAccountsValues,
      usersAccountHistory,
      user,
      isCurrentUser,
      authenticatedUserName,
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
      this.props.getAccountWithFollowingCount({ name: username });
    }

    if (_.isEmpty(usersEstAccountsValues[username]) && !_.isEmpty(user.name)) {
      this.props.getUserEstAccountValue(user);
    }
  }

  render() {
    const {
      user,
      usersAccountHistory,
      totalVestingShares,
      totalVestingFundSteem,
      usersTransactionsLoading,
    } = this.props;
    const actions = usersAccountHistory[user.name] || [];

    return (
      <div>
        {actions.length === 0 && usersTransactionsLoading
          ? <Loading style={{ marginTop: '20px' }} />
          : <UserActivityActions
            actions={actions}
            currentUsername={user.name}
            getMoreUserAccountHistory={this.props.getMoreUserAccountHistory}
            totalVestingShares={totalVestingShares}
            totalVestingFundSteem={totalVestingFundSteem}
          />}
      </div>
    );
  }
}

export default UserActivity;
