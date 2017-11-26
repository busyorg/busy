import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  getLoadingMoreUsersAccountHistory,
  getCurrentDisplayedActions,
  getCurrentFilteredActions,
  getAccountHistoryFilter,
  getUserHasMoreAccountHistory,
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getUser,
  getUsersAccountHistory,
} from '../reducers';
import Loading from '../components/Icon/Loading';

@withRouter
@connect((state, ownProps) => ({
  user: ownProps.isCurrentUser
    ? getAuthenticatedUser(state)
    : getUser(state, ownProps.match.params.name),
  loadingMoreUsersAccountHistory: getLoadingMoreUsersAccountHistory(state),
  currentDisplayedActions: getCurrentDisplayedActions(state),
  currentFilteredActions: getCurrentFilteredActions(state),
  accountHistoryFilter: getAccountHistoryFilter(state),
  usersAccountHistory: getUsersAccountHistory(state),
  userHasMoreActions: getUserHasMoreAccountHistory(
    state,
    ownProps.isCurrentUser
      ? getAuthenticatedUserName(state)
      : getUser(state, ownProps.match.params.name).name,
  ),
}))
class UserActivityActionsLoader extends React.Component {
  static propTypes = {
    currentDisplayedActions: PropTypes.arrayOf(PropTypes.shape()),
    userHasMoreActions: PropTypes.bool.isRequired,
    usersAccountHistory: PropTypes.shape().isRequired,
    loadingMoreUsersAccountHistory: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    currentDisplayedActions: [],
    currentFilteredActions: [],
    accountHistoryFilter: [],
  };

  shouldComponentUpdate(nextProps) {
    const currentUsername = nextProps.user.name;
    const actions = nextProps.usersAccountHistory[currentUsername];
    const hasMore =
      nextProps.userHasMoreActions || actions.length !== nextProps.currentDisplayedActions.length;

    return nextProps.loadingMoreUsersAccountHistory || !hasMore;
  }

  render() {
    const { loadingMoreUsersAccountHistory } = this.props;
    if (loadingMoreUsersAccountHistory) {
      return <div style={{ margin: '20px' }}><Loading /></div>;
    }
    return null;
  }
}

export default UserActivityActionsLoader;
