import React from 'react';
import PropTypes from 'prop-types';
import UserActivityActionsList from './UserActivityActionsList';
import UserActivitySearchMessage from './UserActivitySearchMessage';
import UserActivityActionsLoader from './UserActivityActionsLoader';
import './UserActivityActions.less';

class UserActivityActions extends React.Component {
  static propTypes = {
    isCurrentUser: PropTypes.bool,
  };

  static defaultProps = {
    isCurrentUser: false,
  };

  render() {
    const { isCurrentUser } = this.props;
    return (
      <div className="UserActivityActions">
        <UserActivitySearchMessage />
        <UserActivityActionsList isCurrentUser={isCurrentUser} />
        <UserActivityActionsLoader isCurrentUser={isCurrentUser} />
      </div>
    );
  }
}

export default UserActivityActions;
