import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import './Sidenav.less';

const SidenavReplies = () =>
  (<ul className="Sidenav">
    <li>
      <NavLink to="/replies" activeClassName="Sidenav__item--active">
        <i className="iconfont icon-message_fill" />
        <FormattedMessage id="replies" defaultMessage="Replies" />
      </NavLink>
    </li>
    <li>
      <NavLink to="/settings" activeClassName="Sidenav__item--active">
        <i className="iconfont icon-setup" />
        <FormattedMessage id="settings" defaultMessage="Settings" />
      </NavLink>
    </li>
  </ul>);

export default SidenavReplies;
