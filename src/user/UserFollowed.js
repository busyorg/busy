import React from 'react';
import api from '../steemAPI';
import Loading from '../widgets/Loading';
import UserList from './UserList';

module.exports = React.createClass({
  componentWillMount() {
    this.setState({ users: [] });
    api.getFollowing(this.props.params.name, 0, 'blog', 100, (err, following) => {
      this.setState({ users: following });
    });
  },
  render() {
    return (
      <div className="container">
        <center className="users">
          {this.state.users.length > 0 && <ul>
            {this.state.users.map((user, key) => {
              return (<UserList username={user.following} key={key} />);
            })}
          </ul>}
          {this.state.users.length === 0 && <Loading />}
        </center>
      </div>
    );
  }
});
