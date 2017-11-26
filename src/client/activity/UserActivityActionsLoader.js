import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLoadingMoreUsersAccountHistory } from '../reducers';
import Loading from '../components/Icon/Loading';

@connect(state => ({
  loadingMoreUsersAccountHistory: getLoadingMoreUsersAccountHistory(state),
}))
class UserActivityActionsLoader extends React.Component {
  static propTypes = {
    loadingMoreUsersAccountHistory: PropTypes.bool.isRequired,
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.loadingMoreUsersAccountHistory;
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
