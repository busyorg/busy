import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import { Menu, Popover, Input } from 'antd';
import Avatar from '../Avatar';
import Notifications from './Notifications';
import './Topnav.less';

const SubMenu = Menu.SubMenu;

const Topnav = ({ username, onNotificationClick }) => {
  let content;

  if (username) {
    content = (
      <div className="Topnav__menu-container">
        <Menu
          className="Topnav__menu-container__menu"
          mode="horizontal"
        >
          <Menu.Item key="user" className="Topnav__item-user">
            <Link className="Topnav__user" to={`/@${username}`}>
              <Avatar username={username} size={36} />
              <span className="Topnav__user__username">{username}</span>
            </Link>
          </Menu.Item>
          <SubMenu
            key="notifications"
            className="Topnav__item--dropdown"
            title={
              <Popover placement="bottomRight" trigger="click" content={<Notifications onClick={onNotificationClick} />} title="Notifications">
                <i className="iconfont icon-remind" />
              </Popover>
            }
          />
          <SubMenu key="more" className="Topnav__item--dropdown" title={<i className="iconfont icon-switch" />}>
            <Menu.Item key="more:1">Option 1</Menu.Item>
            <Menu.Item key="more:2">Option 2</Menu.Item>
          </SubMenu>
        </Menu>
      </div>);
  } else {
    content = (
      <div className="Topnav__menu-container">
        <Menu className="Topnav__menu-container__menu" mode="horizontal" >
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
      </div>);
  }

  return (
    <div className="Topnav">
      <div className="Topnav__container">
        <span className="Topnav__brand">busy</span>
        <div
          className={
            classNames('Topnav__input-container', {
              'Topnav__input-container--logged-in': username,
            })
          }
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
};

Topnav.defaultProps = {
  onNotificationClick: () => {},
};

export default Topnav;
