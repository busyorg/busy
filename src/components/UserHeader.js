import React, { PropTypes } from 'react';
import { Menu } from 'antd';
import Avatar from './Avatar';
import Follow from './Button/Follow';
import './UserHeader.less';

const SubMenu = Menu.SubMenu;

const UserHeader = ({ username }) =>
  <div className="UserHeader">
    <div className="UserHeader__container">
      <Avatar username={username} size={100} />
      <div className="UserHeader__user">
        <div className="UserHeader__row">
          <h2 className="UserHeader__user__username">{username}</h2>
          <div className="UserHeader__user__button">
            <Follow />
          </div>
          <Menu
            className="UserHeader__menu"
            mode="horizontal"
          >
            <SubMenu className="UserHeader__menu__item" title={<i className="iconfont icon-more UserHeader__more" />}>
              <Menu.Item key="setting:1">Option 1</Menu.Item>
              <Menu.Item key="setting:2">Option 2</Menu.Item>
            </SubMenu>
          </Menu>
        </div>
        <div className="UserHeader__row UserHeader__handle">
          @{username}
        </div>
      </div>
    </div>
  </div>;

UserHeader.propTypes = {
  username: PropTypes.string,
};

export default UserHeader;
