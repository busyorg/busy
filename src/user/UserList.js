import React from 'react';
import { Link } from 'react-router';
import Avatar from '../widgets/Avatar';

export default class UserList extends React.Component {
  render() {
    return (
      <div className="UserList pvm">
          <Avatar md username={this.props.username} className="mrm" />
          <Link to={`/@${this.props.username}`}>@{this.props.username}</Link>
          <i className="icon icon-md icon-menu material-icons">person_add</i>
      </div>
    );
  }
};
