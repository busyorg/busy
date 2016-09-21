/* eslint-disable react/prefer-stateless-function, max-len */
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class SidebarContacts extends Component {
  static propTypes = {
    contacts: PropTypes.array,
    channels: PropTypes.object,
  };

  render() {
    const contacts = this.props.contacts.map((follow, key) => (
      <li key={key}>
        <Link
          to={`/@${follow.following}`}
          activeClassName="active"
        >
          @{follow.following}
        </Link>
      </li>
    ));

    return (
      <ul className="tags">
        {contacts}
      </ul>
    );
  }
}
