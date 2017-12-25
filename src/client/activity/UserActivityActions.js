import React from 'react';
import PropTypes from 'prop-types';
import UserActivityActionsList from './UserActivityActionsList';
import UserActivitySearchMessage from './UserActivitySearchMessage';
import UserActivityActionsLoader from './UserActivityActionsLoader';
import './UserActivityActions.less';

const UserActivityActions = ({ isCurrentUser }) => (
  <div className="UserActivityActions">
    <UserActivitySearchMessage />
    <UserActivityActionsList isCurrentUser={isCurrentUser} />
    <UserActivityActionsLoader isCurrentUser={isCurrentUser} />
  </div>
);

UserActivityActions.propTypes = {
  isCurrentUser: PropTypes.bool,
};

UserActivityActions.defaultProps = {
  isCurrentUser: false,
};

export default UserActivityActions;
