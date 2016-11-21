import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';

import Icon from '../../widgets/Icon';

const MenuUser = ({ username }) => {
  return (
    <ul className="app-nav">
      <li>
        <Link to={`/@${username}`} activeClassName="active">
          <Icon name="assignment_ind" />{' '}
          <span className="hidden-xs"><FormattedMessage id="profile" /></span>
        </Link>
      </li>
      <li>
        <Link to={`#@${username}/activity`} activeClassName="active">
          <Icon name="history" />{' '}
          <span className="hidden-xs"><FormattedMessage id="activity" /></span>
        </Link>
      </li>
      <li>
        <Link to={`/@${username}/feed`} activeClassName="active">
          <Icon name="subject" />{' '}
          <span className="hidden-xs"><FormattedMessage id="feed" /></span>
        </Link>
      </li>
      <li>
        <Link to={`/@${username}/transfers`} activeClassName="active">
          <Icon name="account_balance_wallet" />{' '}
          <span className="hidden-xs"><FormattedMessage id="wallet" /></span>
        </Link>
      </li>
    </ul>
  );
};

export default MenuUser;
