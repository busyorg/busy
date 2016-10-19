import React from 'react';
import { Link } from 'react-router';

export default class UserList extends React.Component {
  render() {
    return (
      <div className="UserList">
        <div className="avatar avatar-md">
          <img src={`https://img.busy6.com/@${this.props.username}`} />
        </div>
        <div className="caption"><Link to={`/@${this.props.username}`}>@{this.props.username}</Link></div>
      </div>
    );
  }
};
