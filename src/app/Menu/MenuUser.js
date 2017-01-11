import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import Icon from '../../widgets/Icon';
import Avatar from '../../widgets/Avatar';

const MenuUser = ({ username }) => {
  return (
    <ul className="app-nav">
      <li>
        <Link to={`/@${username}`} activeClassName="active">
          <Avatar username={username} xs />{ ' ' }
          <span className="hidden-xs">@{ username }</span>
        </Link>
      </li>
      <li>
        <Link to={`/@${username}/feed`} activeClassName="active">
          <Icon name="subject" />{ ' ' }
          <span className="hidden-xs"><FormattedMessage id="feed" /></span>
        </Link>
      </li>
      <li>
        <Link to={`/@${username}/transfers`} activeClassName="active">
          <Icon name="account_balance_wallet" />{ ' ' }
          <span className="hidden-xs"><FormattedMessage id="wallet" /></span>
        </Link>
      </li>
      <li>
        <Link to={`/messages/@${username}`} activeClassName="active">
          <Icon name="chat_bubble_outline" />{ ' ' }
          <span className="hidden-xs"><FormattedMessage id="messages" /></span>
        </Link>
      </li>
    </ul>
  );
};

export default MenuUser;
