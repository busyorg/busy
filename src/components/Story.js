import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router';
import Avatar from './Avatar';
import Topic from './Button/Topic';
import './Story.less';

const SubMenu = Menu.SubMenu;

const Story = () =>
  <div className="Story">
    <Menu
      className="Story__more"
      mode="horizontal"
    >
      <SubMenu className="Story__more__item" title={<i className="iconfont icon-unfold Story__more__icon" />}>
        <Menu.Item key="setting:1">Option 1</Menu.Item>
        <Menu.Item key="setting:2">Option 2</Menu.Item>
      </SubMenu>
    </Menu>
    <div className="Story__header">
      <Avatar username="guest123" size={40} />
      <div className="Story__header__text">
        <Link to="/guest123">
          <h4>guest123</h4>
        </Link>
        <span className="Story__date">2 days ago</span>
      </div>
      <div className="Story__topics">
        <Topic name="food" />
        <Topic name="bangkok" />
      </div>
    </div>
    <div className="Story__content">
      <h2 className="Story__content__title">Grilled Frog Cooking Over Clay</h2>
      <p>Put a frog into a vessel fill with water and start heating the water.
As the temperature of the water begins to rise…</p>
      <img className="Story__content__image" src="https://placehold.it/520x400" alt="Bangkok" />
    </div>
    <div className="Story__footer">
      <span className="Story__footer__payout">$55.25</span>
      <i className="iconfont icon-praise_fill" />
      <span className="Story__footer__number">521</span>
      <i className="iconfont icon-praise_fill Story__footer__dislike" />
      <span className="Story__footer__number">521</span>
      <i className="iconfont icon-message_fill" />
      <span className="Story__footer__number">521</span>
      <i className="iconfont icon-share_fill" />
      <span className="Story__footer__number">521</span>
    </div>
  </div>;

export default Story;
