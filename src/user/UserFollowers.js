import React from 'react';
import steemdb from 'steemdb';
import api from '../steemAPI';
import Loading from '../widgets/Loading';
import UserList from './UserList';

module.exports = React.createClass({
  componentWillMount() {
    this.setState({ users: [] });
    api.getFollowers(this.props.params.name, 0, 'blog', 100, (err, followers) => {
      this.setState({ users: followers });
    });
    steemdb.accounts({
      account: this.props.params.name
    }, (err, result) => {
      console.log(result);
    });
  },
  render() {
    return (
      <div className="container">
        <center className="users">
          {this.state.users.length > 0 && <ul>
            {this.state.users.map((user, key) => {
              return (<UserList username={user.follower} key={key} />);
            })}
          </ul>}
          {this.state.users.length === 0 && <Loading />}
        </center>
      </div>
    );
  }
});
