import React, { PropTypes } from 'react';
import { FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import { Link } from 'react-router-dom';
import { Icon, Popover, Tooltip } from 'antd';
import StoryPreview from './StoryPreview';
import StoryFooter from './StoryFooter';
import Avatar from '../Avatar';
import Topic from '../Button/Topic';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import './Story.less';

class Story extends React.Component {
  static propTypes = {
    post: PropTypes.shape().isRequired,
    pendingFollow: PropTypes.bool,
    onFollowClick: PropTypes.func,
    onSaveClick: PropTypes.func,
    onReportClick: PropTypes.func,
    onLikeClick: PropTypes.func,
    onCommentClick: PropTypes.func,
    onShareClick: PropTypes.func,
  };

  static defaultProps = {
    pendingFollow: false,
    onFollowClick: () => {},
    onSaveClick: () => {},
    onReportClick: () => {},
    onLikeClick: () => {},
    onCommentClick: () => {},
    onShareClick: () => {},
    postState: {},
  };

  handleClick = (key) => {
    switch (key) {
      case 'follow':
        this.props.onFollowClick(this.props.post);
        return;
      case 'save':
        this.props.onSaveClick();
        return;
      case 'report':
        this.props.onReportClick();
        break;
      default:
    }
  };

  render() {
    const {
      post,
      postState,
      pendingFollow,
      onLikeClick,
      onCommentClick,
      onShareClick,
    } = this.props;

    let followText = '';

    if (postState.userFollowed && !pendingFollow) {
      followText = 'Unfollow';
    } else if (postState.userFollowed && pendingFollow) {
      followText = 'Unfollowing';
    } else if (!postState.userFollowed && !pendingFollow) {
      followText = 'Follow';
    } else if (!postState.userFollowed && pendingFollow) {
      followText = 'Following';
    }


    return (
      <div className="Story">
        <Popover
          placement="bottomRight"
          trigger="click"
          content={
            <PopoverMenu onSelect={this.handleClick} bold={false}>
              <PopoverMenuItem key="follow" disabled={pendingFollow}>
                {(pendingFollow) ? <Icon type="loading" /> : <i className="iconfont icon-people" />}
                {`${followText} ${post.author}`}
              </PopoverMenuItem>
              <PopoverMenuItem key="save">
                <i className="iconfont icon-collection" /> {(postState.isSaved) ? 'Remove from bookmarks' : 'Save post'}
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
            <Tooltip
              placement="bottom"
              title={
                <span>
                  <FormattedDate value={`${post.created}Z`} />
                  {' '}
                  <FormattedTime value={`${post.created}Z`} />
                </span>
              }
            >
              <span className="Story__date">
                <FormattedRelative value={`${post.created}Z`} />
              </span>
            </Tooltip>
          </div>
          <div className="Story__topics">
            <Topic name={post.category} />
          </div>
        </div>
        <div className="Story__content">
          <Link to={post.url} className="Story__content__title">
            <h2>{post.title}</h2>
          </Link>
          <Link to={post.url} className="Story__content__preview">
            <StoryPreview post={post} />
          </Link>
        </div>
        <div className="Story__footer">
          <StoryFooter
            post={post}
            postState={postState}
            onLikeClick={onLikeClick}
            onCommentClick={onCommentClick}
            onShareClick={onShareClick}
          />
        </div>
      </div>
    );
  }
}

export default Story;
