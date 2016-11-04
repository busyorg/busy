import React from 'react';
import { Link } from 'react-router';

export default class UserList extends React.Component {
  render() {
    return (
      <div className="UserList pvm">
          <div className="avatar avatar-md mrm">
            <img src={`https://img.busy.org/@${this.props.username}`} />
          </div>
          <Link to={`/@${this.props.username}`}>@{this.props.username}</Link>
          <i className="icon icon-md icon-menu material-icons">person_add</i>
      </div>
    );
  }
};
