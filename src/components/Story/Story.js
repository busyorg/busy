import React, { PropTypes } from 'react';
import { FormattedRelative } from 'react-intl';
import { Popover } from 'antd';
import { Link } from 'react-router';
import StoryPreview from './StoryPreview';
import StoryFooter from './StoryFooter';
import Avatar from '../Avatar';
import Topic from '../Button/Topic';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import './Story.less';

class Story extends React.Component {
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

  handleClick = (key) => {
    switch (key) {
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
      <div className="Story">
        <Popover
          trigger="click"
          content={
            <PopoverMenu onSelect={this.handleClick}>
              <PopoverMenuItem key="follow">
                <i className="iconfont icon-people" /> {(!userFollowed) ? 'Follow' : 'Unfollow'} {post.author}
              </PopoverMenuItem>
              <PopoverMenuItem key="save">
                <i className="iconfont icon-collection" /> Save post
              </PopoverMenuItem>
              <PopoverMenuItem key="report">
                <i className="iconfont icon-flag" /> Report post
              </PopoverMenuItem>
            </PopoverMenu>
          }
        >
          <i className="iconfont icon-unfold Story__more" />
        </Popover>
        <div className="Story__header">
          <Link to={`/@${post.author}`}>
            <Avatar username={post.author} size={40} />
          </Link>
          <div className="Story__header__text">
            <Link to={`/@${post.author}`}>
              <h4>{post.author}</h4>
            </Link>
            <span className="Story__date">
              <FormattedRelative value={`${post.created}Z`} />
            </span>
          </div>
          <div className="Story__topics">
            <Topic name={post.category} />
          </div>
        </div>
        <div className="Story__content" ref={(div) => { this.contentDiv = div; }} onClick={this.onContentClick}>
          <Link to={post.url}>
            <h2 className="Story__content__title">{post.title}</h2>
          </Link>
          <StoryPreview post={post} />
        </div>
        <div className="Story__footer">
          <StoryFooter
            post={post}
            onLikeClick={onLikeClick}
            onDislikeClick={onDislikeClick}
            onCommentClick={onCommentClick}
            onShareClick={onShareClick}
          />
        </div>
      </div>);
  }
}

export default Story;
