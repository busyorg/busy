import React from 'react';
import { Link } from 'react-router';
import api from './../steemAPI';
import Loading from './../widgets/Loading';

export default class PostFeedItem extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.setState({ users: [] });
    api.getFollowers(this.props.username, 0, 'blog', 100, (err, followers) => {
      this.setState({ users: followers });
    });
  }
  render() {
    return (
      <center className="users">
        {this.state.users.length > 0 && <ul>
          {this.state.users.map((user, key) => {
            return (<li key={key}>
              <div className="avatar avatar-xl">
                <img src={`https://img.busy6.com/@${user.follower}`} />
              </div>
              <div><Link to={`/@${user.follower}`}>@{user.follower}</Link></div>
            </li>);
          })}
        </ul>}
        {this.state.users.length === 0 && <Loading />}
      </center>
    );
  }
};
