import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import steemconnect from 'steemconnect';
import Loading from '../../widgets/Loading';
import Icon from '../../widgets/Icon';
import Avatar from '../../widgets/Avatar';
import './SidebarHeader.scss';

const SidebarHeader = ({
  auth,
  user,
  hideSidebar,
  onClickMenu,
}) =>
  <div className="SidebarHeader">
    <a className="hide-sidebar" onClick={() => hideSidebar()}>
      <Icon name="arrow_back" className="Icon--menu" />
    </a>
    <div className="SidebarHeader__log">
      {
        auth.isFetching &&
          <Loading color="white" />
      }
      {
        !auth.isAuthenticated && !auth.isFetching &&
          <a href={steemconnect.getLoginURL()}>
            <Icon name="lock_outline" />
            { ' ' }<FormattedMessage id="login" />
          </a>
      }
      {
        auth.isAuthenticated &&
          <div>
            <Link to={`/@${user.name}`} className="my-1">
              <Avatar sm username={user.name} reputation={user.reputation}/>
            </Link>
            <div className="SidebarHeader__username">
              @{ `${user.name} ` }
              <a onClick={() => onClickMenu({menu: 'settings'})}>
                <Icon name="settings" xs />
              </a>
            </div>
          </div>
      }
    </div>
  </div>;

export default SidebarHeader;
