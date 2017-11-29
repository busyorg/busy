import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import {
  getLoadingMoreUsersAccountHistory,
  getCurrentDisplayedActions,
  getCurrentFilteredActions,
  getAccountHistoryFilter,
} from '../reducers';

const UserActivitySearchMessage = ({
  loadingMoreUsersAccountHistory,
  currentDisplayedActions,
  currentFilteredActions,
  accountHistoryFilter,
}) => {
  const displayedActions = _.isEmpty(accountHistoryFilter)
    ? currentDisplayedActions
    : currentFilteredActions;
  if (_.isEmpty(displayedActions) && loadingMoreUsersAccountHistory) {
    return (
      <div className="UserActivityActions__search__container">
        <FormattedMessage
          id="loading_more_account_history_for_filters"
          defaultMessage="Loading more of this user's account history for your filters..."
        />
      </div>
    );
  } else if (_.isEmpty(displayedActions)) {
    return (
      <div className="UserActivityActions__search__container">
        <FormattedMessage
          id="no_results_found_for_search"
          defaultMessage="No results were found for your filters."
        />
      </div>
    );
  }
  return null;
};

UserActivitySearchMessage.propTypes = {
  currentDisplayedActions: PropTypes.arrayOf(PropTypes.shape()),
  currentFilteredActions: PropTypes.arrayOf(PropTypes.shape()),
  accountHistoryFilter: PropTypes.arrayOf(PropTypes.string),
  loadingMoreUsersAccountHistory: PropTypes.bool.isRequired,
};

UserActivitySearchMessage.defaultProps = {
  currentDisplayedActions: [],
  currentFilteredActions: [],
  accountHistoryFilter: [],
};

export default connect(state => ({
  loadingMoreUsersAccountHistory: getLoadingMoreUsersAccountHistory(state),
  currentDisplayedActions: getCurrentDisplayedActions(state),
  currentFilteredActions: getCurrentFilteredActions(state),
  accountHistoryFilter: getAccountHistoryFilter(state),
}))(UserActivitySearchMessage);
