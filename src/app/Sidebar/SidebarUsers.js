import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import Icon from '../../widgets/Icon';
import Avatar from '../../widgets/Avatar';

const UnreadCount = ({ unread }) => {
  if (!unread) return null;
  return (
    <span className="Sidebar__unreadCount">
      {unread}
    </span>
  );
};

/**
 * List of users that sent a message and the message is unread
 * @param props
 * @returns {Array|*}
 */
const getUnreadUsersList = (props) => {
  const unreadByChannel = _.groupBy(props.messages.unreadMessages, 'channelName');
  return _.map(unreadByChannel, (messages) => {
    const { senderUsername } = messages[0];
    return {
      username: senderUsername,
      hasUnread: true,
      unreadLength: messages.length,
    };
  });
};

const getFavoritedUsersList = props => props.favorites.users.sort().map(
  username => ({
    username,
    favorited: true,
  })
);

const getUsersList = props => props.contacts.sort().map(username => ({ username }));

const filterUsersBySearch = (users, keyword) =>
  users.filter(user => _.startsWith(user.username, keyword));

const renderUsers = (props, state) => {
  const { search } = state;
  const unreadUsers = getUnreadUsersList(props);
  const favoritedUsers = getFavoritedUsersList(props);
  const users = getUsersList(props);

  const usersList = filterUsersBySearch([
    ...unreadUsers,
    ...favoritedUsers,
    ...users,
  ], search);

  return _.uniqWith(usersList,
    (listA, listB) => listA.username === listB.username
  )
  .slice(0, 20)
  .map((user, idx) => (
    <li key={idx} className="pb-1">
      <Link
        to={
          user.hasUnread
            ? `/messages/@${user.username}`
            : `/@${user.username}`
        }
        activeClassName="active"
      >
        <Avatar username={user.username} xs /> {user.username}
        {' '}
        {user.favorited && <Icon name="star" xs />}
        {user.hasUnread && <UnreadCount unread={user.unreadLength} />}
      </Link>
    </li>
  ));
};

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
    return (
      <ul>
        <li>
          <ul>
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
            {renderUsers(this.props, this.state)}
          </ul>
        </li>
      </ul>
    );
  }
}
