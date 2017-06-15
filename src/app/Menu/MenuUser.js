import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import Icon from '../../widgets/Icon';
import Avatar from '../../widgets/Avatar';

function StatusIndicator({ isOnline }) {
  return (
    <span
      style={{
        borderRadius: '100%',
        display: 'inline-block',
        marginLeft: 5,
        width: 10,
        height: 10,
        backgroundColor: isOnline ? 'green' : 'gray',
      }}
    />
  );
}

StatusIndicator = connect(
  (state, { username }) => ({
    isOnline: state.messages.users[username],
  })
)(StatusIndicator);

const MenuUser = ({ auth, username }) =>
  <ul className="app-nav">
    <li>
      <NavLink to={`/@${username}`} activeClassName="active">
        <Avatar username={username} xs />{' '}
        <span className="hidden-xs">{username}
          <StatusIndicator username={username} />
        </span>
      </NavLink>
    </li>
    <li>
      <NavLink to={`/@${username}/reblogs`} activeClassName="active">
        <Icon name="repeat" />{' '}
        <span className="hidden-xs">
          <FormattedMessage id="reblogs" defaultMessage="Reblogs" />
        </span>
      </NavLink>
    </li>
    <li>
      <NavLink to={`/@${username}/feed`} activeClassName="active">
        <Icon name="subject" />{' '}
        <span className="hidden-xs">
          <FormattedMessage id="feed" defaultMessage="Feed" />
        </span>
      </NavLink>
    </li>
    <li>
      <NavLink to={`/@${username}/replies`} activeClassName="active">
        <Icon name="reply" />{' '}
        <span className="hidden-xs">
          <FormattedMessage id="replies" defaultMessage="Replies" />
        </span>
      </NavLink>
    </li>
    <li>
      <NavLink to={`/@${username}/transfers`} activeClassName="active">
        <Icon name="account_balance_wallet" />{' '}
        <span className="hidden-xs">
          <FormattedMessage id="wallet" defaultMessage="Wallet" />
        </span>
      </NavLink>
    </li>
    {auth.isAuthenticated &&
      <li>
        <NavLink to={`/messages/@${username}`} activeClassName="active">
          <Icon name="chat_bubble_outline" />{' '}
          <span className="hidden-xs">
            <FormattedMessage id="messages" defaultMessage="Messages" />
          </span>
        </NavLink>
      </li>
    }
  </ul>;

export default MenuUser;
