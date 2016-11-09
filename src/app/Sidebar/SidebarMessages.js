/* eslint-disable react/prefer-stateless-function, max-len */
import React, { Component, PropTypes } from 'react';
import filter from 'lodash/filter';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import size from 'lodash/size';
import { Link } from 'react-router';

import './SidebarMessages.scss';

function UnreadCount({ unread }) {
  if (!unread) return null;
  return (
    <span className="SidebarMessages__unreadCount">
      <span>
        {unread}
      </span>
    </span>
  );
}

export default class SidebarMessages extends Component {
  static propTypes = {
    contacts: PropTypes.array,
    messages: PropTypes.object,
  };

  render() {
    const unreadByChannel = groupBy(this.props.messages.unreadMessages, 'channelName');
    const unreadMessages = map(unreadByChannel, (messages, channelName) => {
      let channelNamePrime = channelName;

      if (channelName.indexOf(',') !== -1 &&
          this.props.auth &&
          this.props.auth.user) {
        channelNamePrime = find(
          channelName.split(','),
          (c) => c !== `@${this.props.auth.user.name}`
        );
      }

      return (
        <li key={channelNamePrime}>
          <Link
            to={`/messages/${channelNamePrime}`}
            activeClassName="active"
          >
            {channelNamePrime}{' '}
            <UnreadCount unread={messages.length} />
          </Link>
        </li>
      );
    });

    let contacts = this.props.contacts.slice(0, 20);
    contacts = map(filter(contacts, ({ following }) => {
      return !unreadByChannel[`@${following}`] || !unreadByChannel[`@${following}`].length;
    }), (follow, key) => (
      <li key={key}>
        <Link
          to={`/messages/@${follow}`}
          activeClassName="active"
        >
          @{follow}{' '}
          <UnreadCount unread={size(unreadByChannel[`@${follow}`])} />
        </Link>
      </li>
    ));

    return (
      <div className="SidebarMessages">
        <ul className="tags">
        {unreadMessages.length ? (
          {unreadMessages}
        ) : null}
        {contacts.length ? (
          {contacts}
        ) : null}
        </ul>
      </div>
    );
  }
}
