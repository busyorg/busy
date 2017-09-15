import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage, FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import { Link } from 'react-router-dom';
import { Tag, Icon, Popover, Tooltip } from 'antd';
import { formatter } from 'steem';
import { jsonParse } from '../../helpers/formatter';
import StoryPreview from './StoryPreview';
import StoryFooter from './StoryFooter';
import Avatar from '../Avatar';
import Topic from '../Button/Topic';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import './Story.less';

@injectIntl
class Story extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    post: PropTypes.shape().isRequired,
    postState: PropTypes.shape().isRequired,
    pendingLike: PropTypes.bool,
    pendingFollow: PropTypes.bool,
    pendingBookmark: PropTypes.bool,
    saving: PropTypes.bool,
    ownPost: PropTypes.bool,
    onFollowClick: PropTypes.func,
    onSaveClick: PropTypes.func,
    onReportClick: PropTypes.func,
    onLikeClick: PropTypes.func,
    onShareClick: PropTypes.func,
    onEditClick: PropTypes.func,
  };

  static defaultProps = {
    pendingLike: false,
    pendingFollow: false,
    pendingBookmark: false,
    saving: false,
    ownPost: false,
    onFollowClick: () => {},
    onSaveClick: () => {},
    onReportClick: () => {},
    onLikeClick: () => {},
    onShareClick: () => {},
    onEditClick: () => {},
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
      case 'edit':
        this.props.onEditClick(this.props.post);
        break;
      default:
    }
  };

  render() {
    const {
      intl,
      post,
      postState,
      pendingLike,
      pendingFollow,
      pendingBookmark,
      saving,
      ownPost,
      onLikeClick,
      onShareClick,
    } = this.props;

    let followText = '';

    if (postState.userFollowed && !pendingFollow) {
      followText = intl.formatMessage({ id: 'unfollow_username', defaultMessage: 'Unfollow {username}' }, { username: post.author });
    } else if (postState.userFollowed && pendingFollow) {
      followText = intl.formatMessage({ id: 'unfollow_username', defaultMessage: 'Unfollow {username}' }, { username: post.author });
    } else if (!postState.userFollowed && !pendingFollow) {
      followText = intl.formatMessage({ id: 'follow_username', defaultMessage: 'Follow {username}' }, { username: post.author });
    } else if (!postState.userFollowed && pendingFollow) {
      followText = intl.formatMessage({ id: 'follow_username', defaultMessage: 'Follow {username}' }, { username: post.author });
    }

    let popoverMenu = [];

    if (ownPost) {
      const postMetaData = jsonParse(post.json_metadata);
      let item = null;

      if (postMetaData.format !== 'markdown') {
        item = (<PopoverMenuItem key="edit" disabled>
          <i className="iconfont icon-write" />
          <FormattedMessage id="edit_post_error_format" defaultMessage="Can't edit non-Markdown posts" />
        </PopoverMenuItem>);
      } else if (post.cashout_time === '1969-12-31T23:59:59') {
        item = (<PopoverMenuItem key="edit" disabled>
          <i className="iconfont icon-write" />
          <FormattedMessage id="edit_post_error_time" defaultMessage="Can't edit posts older than a week" />
        </PopoverMenuItem>);
      } else {
        item = (<PopoverMenuItem key="edit">
          {saving ? <Icon type="loading" /> : <i className="iconfont icon-write" />}
          <FormattedMessage id="edit_post" defaultMessage="Edit post" />
        </PopoverMenuItem>);
      }

      popoverMenu = [...popoverMenu, item];
    }

    popoverMenu = [
      ...popoverMenu,
      <PopoverMenuItem key="follow" disabled={pendingFollow}>
        {pendingFollow ? <Icon type="loading" /> : <i className="iconfont icon-people" />}
        {followText}
      </PopoverMenuItem>,
      <PopoverMenuItem key="save">
        {pendingBookmark ? <Icon type="loading" /> : <i className="iconfont icon-collection" />}
        <FormattedMessage id={postState.isSaved ? 'unsave_post' : 'save_post'} defaultMessage={postState.isSaved ? 'Unsave post' : 'Save post'} />
      </PopoverMenuItem>,
      <PopoverMenuItem key="report">
        <i className="iconfont icon-flag" />
        <FormattedMessage id="report_post" defaultMessage="Report post" />
      </PopoverMenuItem>,
    ];

    let rebloggedUI = null;

    if (post.first_reblogged_by) {
      rebloggedUI = (<div className="Story__reblog">
        <i className="iconfont icon-share1" />
        <FormattedMessage
          id="reblogged_username"
          defaultMessage="{username} reblogged"
          values={{
            username: <Link to={`/@${post.first_reblogged_by}`}>{post.first_reblogged_by}</Link>,
          }}
        />
      </div>);
    } else if (post.first_reblogged_on) {
      rebloggedUI = (<div className="Story__reblog">
        <i className="iconfont icon-share1" />
        <FormattedMessage id="reblogged" defaultMessage="Reblogged" />
      </div>);
    }

    return (
      <div className="Story">
        {rebloggedUI}
        <div className="Story__content">
          <Popover
            placement="bottomRight"
            trigger="click"
            content={
              <PopoverMenu onSelect={this.handleClick} bold={false}>
                {popoverMenu}
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
                <h4>
                  {post.author}
                  <Tooltip title={intl.formatMessage({ id: 'reputation_score' })}>
                    <Tag>
                      {formatter.reputation(post.author_reputation)}
                    </Tag>
                  </Tooltip>
                </h4>
              </Link>
              <Tooltip
                title={
                  <span>
                    <FormattedDate value={`${post.created}Z`} />{' '}
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
              <h2>
                {post.title ||
                  <span>
                    <Tag color="#4f545c">RE</Tag>
                    {post.root_title}
                  </span>
                }
              </h2>
            </Link>
            <Link to={post.url} className="Story__content__preview">
              <StoryPreview post={post} />
            </Link>
          </div>
          <div className="Story__footer">
            <StoryFooter
              post={post}
              postState={postState}
              pendingLike={pendingLike}
              onLikeClick={onLikeClick}
              onShareClick={onShareClick}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Story;
