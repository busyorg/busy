import React, { Component, PropTypes } from 'react';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import startsWith from 'lodash/startsWith';
import size from 'lodash/size';
import { Link } from 'react-router';

import Icon from '../../widgets/Icon';

const getFilteredUsers = (props, state) => {
  const unreadByChannel = groupBy(props.messages.unreadMessages, 'channelName');
  const search = state.search;
  let users = props.contacts.filter((user) => {
    return startsWith(user, search);
  });
  users = users.slice(0, 16);
  users = users.filter((contact) => {
    const channelName = [
      `@${contact}`,
      `@${props.auth.user && props.auth.user.name}`,
    ].sort().toString();
    return !unreadByChannel[channelName] || !unreadByChannel[channelName].length;
  });
  users = users.map((follow, key) => (
    <li key={key}>
      <Link
        to={`/@${follow}`}
        activeClassName="active"
      >
        @{follow}{' '}
        <UnreadCount unread={size(unreadByChannel[`@${follow}`])} />
      </Link>
    </li>
  ));
  return users;
};

const getUnreadMessages = (props) => {
  const unreadByChannel = groupBy(props.messages.unreadMessages, 'channelName');
  return unreadByChannel.length > 0 && unreadByChannel.map((messages, channelName) => {
    let channelNamePrime = channelName;
    if (channelName.indexOf(',') !== -1 &&
      props.auth &&
      props.auth.user) {
      channelNamePrime = find(
        channelName.split(','),
        (c) => c !== `@${props.auth.user.name}`
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
};

function UnreadCount({ unread }) {
  if (!unread) return null;
  return (
    <span className="Sidebar__unreadCount">
      {unread}
    </span>
  );
}

export default class SidebarUsers extends Component {
  static propTypes = {
    contacts: PropTypes.array,
    messages: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };
  }

  search = (e) => {
    this.setState({ search: e.target.value });
  };

  render() {
    const unreadMessages = getUnreadMessages(this.props);
    const users = getFilteredUsers(this.props, this.state);
    return (
      <ul className="Sidebar__tags">
        <li className="Sidebar__search">
          <div className="input-group">
            <span className="input-group-addon"><Icon name="search" sm /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              value={this.props.search}
              onChange={this.search}
            />
          </div>
        </li>
        { unreadMessages.length
          ? unreadMessages
          : null
        }
        { users.length
          ? users
          : null
        }
      </ul>
    );
  }
}
