/* eslint-disable react/prefer-stateless-function, max-len */
import './SidebarMessages.scss';
import React, { Component, PropTypes } from 'react';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import size from 'lodash/size';
import { Link } from 'react-router';

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
      return (
        <li key={channelName}>
          <Link
            to={`/messages/${channelName}`}
            activeClassName="active"
          >
            {channelName}{' '}
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
        {unreadMessages.length ? (
          <ul className="tags">
            {unreadMessages}
          </ul>
        ) : null}
        {contacts.length ? (
          <ul className="tags">
            {contacts}
          </ul>
        ) : null}
      </div>
    );
  }
}
