import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Menu, Popover, Tooltip, Input, Badge } from 'antd';
import Avatar from '../Avatar';
import Notifications from './Notifications/Notifications';
import './Topnav.less';

const SubMenu = Menu.SubMenu;

const Topnav = ({
  username,
  onNotificationClick,
  onSeeAllClick,
  notifications
}) => {
  let content;

  const notificationsCount = notifications && notifications
    .filter(notification => !notification.read)
    .length;

  if (username) {
    content = (
      <div className="Topnav__menu-container Topnav__sides">
        <Menu
          selectedKeys={[]}
          className="Topnav__menu-container__menu"
          mode="horizontal"
        >
          <Menu.Item key="user" className="Topnav__item-user">
            <Link className="Topnav__user" to={`/@${username}`}>
              <Avatar username={username} size={36} />
              <span className="Topnav__user__username">{username}</span>
            </Link>
          </Menu.Item>
          <Menu.Item
            key="notifications"
            className={
              classNames('Topnav__item--dropdown', {
                'Topnav__item--badge': notifications !== 0,
              })
            }
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
          <SubMenu
            key="more"
            className="Topnav__item--dropdown"
            title={<i className="iconfont icon-switch" />}
          >
            <Menu.Item className="Topnav__item__subitem" key="activity">
              Activity
            </Menu.Item>
            <Menu.Item className="Topnav__item__subitem" key="settings">
              Settings
            </Menu.Item>
            <Menu.Item className="Topnav__item__subitem" key="logout">
              Logout
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    );
  } else {
    content = (
      <div className="Topnav__menu-container Topnav__sides">
        <Menu className="Topnav__menu-container__menu" mode="horizontal">
          <Menu.Item key="signin">
            <Link to="/signin">
              Sign in
            </Link>
          </Menu.Item>
          <Menu.Item key="divider" disabled>
            |
          </Menu.Item>
          <Menu.Item key="signup">
            <Link to="/signup">
              Sign up
            </Link>
          </Menu.Item>
        </Menu>
      </div>
    );
  }

  return (
    <div className="Topnav">
      <div className="Topnav__container">
        <Link to="/" className="Topnav__sides"><span className="Topnav__brand">busy</span></Link>
        <div
          className={classNames("Topnav__input-container", {
            "Topnav__input-container--logged-in": username
          })}
        >
          {username && <Input placeholder="Search..." />}
          {username && <i className="iconfont icon-search" />}
        </div>
        {content}
      </div>
    </div>
  );
};

Topnav.propTypes = {
  username: PropTypes.string,
  onNotificationClick: PropTypes.func,
  onSeeAllClick: PropTypes.func,
  notifications: PropTypes.arrayOf(PropTypes.shape())
};

Topnav.defaultProps = {
  onNotificationClick: () => {},
  onSeeAllClick: () => {}
};

export default Topnav;
