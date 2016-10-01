/* eslint-disable react/prefer-stateless-function, max-len */
import './SidebarContacts.scss';
import React, { Component, PropTypes } from 'react';
import map from 'lodash/map';
import { Link } from 'react-router';

function UnreadCount({ unread }) {
  if (!unread) return null;
  return (
    <span className="SidebarContacts__unreadCount">
      <span>{unread}</span>
    </span>
  );
}


export default class SidebarContacts extends Component {
  static propTypes = {
    contacts: PropTypes.array
  };

  render() {
    const contacts = map(this.props.contacts, (follow, key) => (
      <li key={key}>
        <Link
          to={`/messages/@${follow.following}`}
          activeClassName="active"
        >
          @{follow.following}{' '}
          <UnreadCount unread={0} />
        </Link>
      </li>
    ));

    return (
      <div className="SidebarContacts">
        <ul className="tags">
          {contacts}
        </ul>
      </div>
    );
  }
}
