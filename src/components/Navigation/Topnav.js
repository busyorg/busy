import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Menu, Popover, Tooltip, Input, Badge } from 'antd';
import steemconnect from 'sc2-sdk';
import Avatar from '../Avatar';
import Notifications from './Notifications/Notifications';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import './Topnav.less';

const Topnav = ({
  username,
  onNotificationClick,
  onSeeAllClick,
  onMenuItemClick,
  notifications,
}) => {
  let content;

  const notificationsCount =
    notifications && notifications.filter(notification => !notification.read).length;

  if (username) {
    content = (
      <div className="Topnav__menu-container">
        <Menu selectedKeys={[]} className="Topnav__menu-container__menu" mode="horizontal">
          <Menu.Item key="write">
            <Tooltip placement="bottom" title="Write post">
              <Link to="/write" className="Topnav__link">
                <i className="iconfont icon-daifacaigouxuqiu" />
              </Link>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="user" className="Topnav__item-user">
            <Link className="Topnav__user" to={`/@${username}`}>
              <Avatar username={username} size={36} />
              <span className="Topnav__user__username">
                {username}
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item
            key="notifications"
            className={classNames('Topnav__item--dropdown', {
              'Topnav__item--badge': notifications !== 0,
            })}
          >
            <Popover
              placement="bottomRight"
              trigger="click"
              content={
                <Notifications
                  notifications={notifications}
                  onClick={onNotificationClick}
                  onSeeAllClick={onSeeAllClick}
                />
              }
              title="Notifications"
            >
              <Tooltip className="Notifications__tooltip" placement="bottom" title="Notifications">
                <Badge count={notificationsCount}>
                  <i className="iconfont icon-remind" />
                </Badge>
              </Tooltip>
            </Popover>
          </Menu.Item>
          <Menu.Item key="more" className="Topnav__item--dropdown">
            <Popover
              placement="bottom"
              trigger="click"
              content={
                <PopoverMenu onSelect={onMenuItemClick}>
                  <PopoverMenuItem key="activity">Activity</PopoverMenuItem>
                  <PopoverMenuItem key="settings">Settings</PopoverMenuItem>
                  <PopoverMenuItem key="logout">Logout</PopoverMenuItem>
                </PopoverMenu>
              }
            >
              <i className="iconfont icon-switch" />
            </Popover>
          </Menu.Item>
        </Menu>
      </div>
    );
  } else {
    content = (
      <div className="Topnav__menu-container">
        <Menu className="Topnav__menu-container__menu" mode="horizontal">
          <Menu.Item key="signup">
            <Link to="/signup">Sign up</Link>
          </Menu.Item>
          <Menu.Item key="divider" disabled>
            |
          </Menu.Item>
          <Menu.Item key="login">
            <a href={steemconnect.getLoginURL()}>Log in</a>
          </Menu.Item>
        </Menu>
      </div>
    );
  }

  return (
    <div className="Topnav">
      <div className="topnav-layout container">
        <div className="left">
          <Link className="Topnav__brand" to="/">
            busy
          </Link>
        </div>
        <div className="center">
          <div className="Topnav__input-container">
            <Input placeholder="Search..." />
            <i className="iconfont icon-search" />
          </div>
        </div>
        <div className="right">
          {content}
        </div>
      </div>
    </div>
  );
};

Topnav.propTypes = {
  username: PropTypes.string,
  onNotificationClick: PropTypes.func,
  onSeeAllClick: PropTypes.func,
  onMenuItemClick: PropTypes.func,
  notifications: PropTypes.arrayOf(PropTypes.shape()),
};

Topnav.defaultProps = {
  username: undefined,
  onNotificationClick: () => {},
  onSeeAllClick: () => {},
  onMenuItemClick: () => {},
  notifications: [],
};

export default Topnav;
