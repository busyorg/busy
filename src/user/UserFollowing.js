import React, { Component } from 'react';
import steemdb from 'steemdb';
import Loading from '../widgets/Loading';
import UserList from './UserList';

export default class UserFollowing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentWillMount() {
    steemdb.accounts({
      account: this.props.params.name
    }, (err, result) => {
      this.setState({ users: result[0].following });
    });
  }

  render() {
    return (
      <div className="container">
        <center className="users">
          {this.state.users && <UserList users={this.state.users} />}
          {!this.state.users && <Loading />}
        </center>
      </div>
    );
  }
}
