import React from 'react';
import PropTypes from 'prop-types';
import UserList from './UserList';
import Loading from '../components/Icon/Loading';
import { getAllFollowing } from '../helpers/apiHelpers';
import './UserFollowing.less';

export default class UserFollowing extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
  };

  state = {
    isLoading: false,
    isLoaded: false,
    users: [],
  };

  componentWillMount() {
    this.setState({ isLoading: true });
    getAllFollowing(this.props.match.params.name).then(users =>
      this.setState({
        isLoading: false,
        isLoaded: true,
        users: users.sort(),
      }),
    );
  }

  render() {
    return (
      <div className="UserFollowing">
        {this.state.users && <UserList users={this.state.users} />}
        {this.state.isLoading && <Loading />}
      </div>
    );
  }
}
