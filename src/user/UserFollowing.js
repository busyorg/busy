import React, { Component } from 'react';
import UserList from './UserList';
import Loading from '../widgets/Loading';
import { getAllFollowing } from '../helpers/apiHelpers';

export default class UserFollowing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isLoaded: false,
      users: [],
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    getAllFollowing(this.props.params.name)
      .then(users => this.setState({
        isLoading: false,
        isLoaded: true,
        users: users.sort()
      }));
  }

  render() {
    return (
      <div>
        <div className="container">
          {this.state.users && <UserList users={this.state.users} />}
          {this.state.isLoading && <Loading />}
        </div>
      </div>
    );
  }
}
