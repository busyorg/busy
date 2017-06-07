import React, { PropTypes } from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router';
import { Menu } from 'antd';
import Body from '../../post/Body';
import StoryFooter from './StoryFooter';
import Avatar from '../Avatar';
import './StoryFull.less';

const SubMenu = Menu.SubMenu;

const StoryFull = ({
    post,
    userFollowed,
    onLikeClick,
    onDislikeClick,
    onCommentClick,
    onShareClick
  }) =>
    <div className="StoryFull">
      <h1 className="StoryFull__title">
        {post.title}
      </h1>
      <div className="StoryFull__header">
        <Avatar username={post.author} size={60} />
        <div className="StoryFull__header__text">
          <Link to={`/${post.author}`}>
            {post.author}
          </Link>
          <span className="StoryFull__header__text__date">
            <FormattedRelative value={`${post.created}Z`} />
          </span>
        </div>
        <Menu
          selectedKeys={[]}
          className="StoryFull__header__more"
          mode="horizontal"
        >
          <SubMenu className="StoryFull__header__more__item" title={<i className="iconfont icon-more StoryFull__header__more__icon" />}>
            <Menu.Item key="follow"><i className="iconfont icon-people StoryFull__submenu__icon" /> {(!userFollowed) ? 'Follow' : 'Unfollow'} {post.author}</Menu.Item>
            <Menu.Item key="save"><i className="iconfont icon-collection StoryFull__submenu__icon" /> Save post</Menu.Item>
            <Menu.Item key="report"><i className="iconfont icon-flag StoryFull__submenu__icon" /> Report post</Menu.Item>
          </SubMenu>
        </Menu>
      </div>
      <div className="StoryFull__content">
        <Body body={post.body} json_metadata={post.json_metadata} />
      </div>
      <StoryFooter
        post={post}
        onLikeClick={onLikeClick}
        onDislikeClick={onDislikeClick}
        onCommentClick={onCommentClick}
        onShareClick={onShareClick}
      />
    </div>;

StoryFull.propTypes = {
  post: PropTypes.shape(),
  onLikeClick: PropTypes.func,
  onDislikeClick: PropTypes.func,
  onCommentClick: PropTypes.func,
  onShareClick: PropTypes.func,
  userFollowed: PropTypes.bool,
};

StoryFull.defaultProps = {
  onLikeClick: () => {},
  onDislikeClick: () => {},
  onCommentClick: () => {},
  onShareClick: () => {},
  userFollowed: false,
};

export default StoryFull;
