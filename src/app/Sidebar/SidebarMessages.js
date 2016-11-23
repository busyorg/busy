/* eslint-disable react/prefer-stateless-function, max-len */
import React, { Component, PropTypes } from 'react';
import filter from 'lodash/filter';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import startsWith from 'lodash/startsWith';
import map from 'lodash/map';
import size from 'lodash/size';
import { Link } from 'react-router';

import Icon from '../../widgets/Icon';

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

    const search = this.state.search;
    let users = filter(this.props.contacts, (user) => {
      return startsWith(user, search);
    });
    users = users.slice(0, 20);
    users = map(filter(users, (contact) => {
      const channelName = [
        `@${contact}`,
        `@${this.props.auth.user && this.props.auth.user.name}`,
      ].sort().toString();
      return !unreadByChannel[channelName] || !unreadByChannel[channelName].length;
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
          <li className="search">
            <div className="input-group">
              <span className="input-group-addon"><Icon name="search" sm /></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={search}
                onChange={this.search}
              />
            </div>
          </li>
          {unreadMessages.length ? (
            unreadMessages
          ) : null}
          {users.length ? (
            users
          ) : null}
        </ul>
      </div>
    );
  }
}
