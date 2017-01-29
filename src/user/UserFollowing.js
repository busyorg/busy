import React, { Component } from 'react';
import UserList from './UserList';
import Loading from '../widgets/Loading';
import { getAllFollowing } from '../helpers/apiHelpers';

export default class UserFollowing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentWillMount() {
    getAllFollowing(this.props.params.name)
      .then(users => this.setState({ users: users.sort() }));
  }

  render() {
    return (
      <div>
        <div className="container">
          {this.state.users && <UserList users={this.state.users} />}
          {!this.state.users && <Loading />}
        </div>
      </div>
    );
  }
}
