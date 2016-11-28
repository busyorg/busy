import React from 'react';
import { Link } from 'react-router';

import Icon from '../widgets/Icon';
import Avatar from '../widgets/Avatar';

import './UserList.scss';

export default class UserList extends React.Component {
  render() {
    return (
      <div className="UserList pvm">
        <Avatar md username={this.props.username} className="mrm" />
        <Link to={`/@${this.props.username}`}>@{this.props.username}</Link>{ ' ' }
        <Icon name="person_add" />
      </div>
    );
  }
};
