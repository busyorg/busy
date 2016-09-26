/* eslint-disable react/prefer-stateless-function, max-len */
import React, { Component, PropTypes } from 'react';
import map from 'lodash/map';
import { Link } from 'react-router';

export default class SidebarContacts extends Component {
  static propTypes = {
    contacts: PropTypes.array,
    channels: PropTypes.object,
  };

  render() {
    const contacts = map(this.props.contacts, (follow, key) => (
      <li key={key}>
        <Link
          to={`/messages/@${follow.following}`}
          activeClassName="active"
        >
          @{follow.following}
        </Link>
      </li>
    ));

    const channels = map(this.props.channels, (channel, key) => (
      <li key={channel.name}>
        <Link
          to={`/messages/${channel.name}`}
          activeClassName="active"
        >
          #{channel.name}
        </Link>
      </li>
    ));


    return (
      <div className="SidebarContacts">
        <ul className="tags">
          {contacts}
        </ul>

        <ul className="tags">
          {channels}
        </ul>
      </div>
    );
  }
}
