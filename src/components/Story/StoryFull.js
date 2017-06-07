import React, { PropTypes } from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router';
import { Menu } from 'antd';
import Body from '../../post/Body';
import StoryFooter from './StoryFooter';
import Avatar from '../Avatar';
import './StoryFull.less';

const SubMenu = Menu.SubMenu;

class StoryFull extends React.Component {
  static propTypes = {
    post: PropTypes.shape(),
    userFollowed: PropTypes.bool,
    onFollowClick: PropTypes.func,
    onSaveClick: PropTypes.func,
    onReportClick: PropTypes.func,
    onLikeClick: PropTypes.func,
    onDislikeClick: PropTypes.func,
    onCommentClick: PropTypes.func,
    onShareClick: PropTypes.func,
  };

  static defaultProps = {
    onFollowClick: () => {},
    onSaveClick: () => {},
    onReportClick: () => {},
    onLikeClick: () => {},
    onDislikeClick: () => {},
    onCommentClick: () => {},
    onShareClick: () => {},
    userFollowed: false,
  };

  handleClick = (e) => {
    switch (e.key) {
      case 'follow':
        this.props.onFollowClick();
        return;
      case 'save':
        this.props.onSaveClick();
        return;
      case 'report':
        this.props.onReportClick();
        return;
      default:
        return;
    }
  }

  render() {
    const {
      post,
      userFollowed,
      onLikeClick,
      onDislikeClick,
      onCommentClick,
      onShareClick
    } = this.props;

    return (
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
            onClick={this.handleClick}
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
      </div>
    );
  }
}

export default StoryFull;
