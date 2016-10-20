import React from 'react';
import api from './../steemAPI';
import Loading from './../widgets/Loading';
import UserList from './UserList';

export default class Followed extends React.Component {
  componentWillMount() {
    this.setState({ users: [] });
    api.getFollowing(this.props.username, 0, 'blog', 100, (err, following) => {
      this.setState({ users: following });
    });
  }
  render() {
    return (
      <center className="users">
        {this.state.users.length > 0 && <ul>
          {this.state.users.map((user, key) => {
            return (<UserList username={user.following} key={key} />);
          })}
        </ul>}
        {this.state.users.length === 0 && <Loading />}
      </center>
    );
  }
};
