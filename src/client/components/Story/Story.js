import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  FormattedMessage,
  FormattedRelative,
  FormattedDate,
  FormattedTime,
} from 'react-intl';
import { Link } from 'react-router-dom';
import { Tag, Tooltip } from 'antd';
import formatter from '../../helpers/steemitFormatter';
import { isPostTaggedNSFW } from '../../helpers/postHelpers';
import withAuthActions from '../../auth/withAuthActions';
import StoryPreview from './StoryPreview';
import StoryFooter from '../StoryFooter/StoryFooter';
import Avatar from '../Avatar';
import Topic from '../Button/Topic';
import NSFWStoryPreviewMessage from './NSFWStoryPreviewMessage';
import HiddenStoryPreviewMessage from './HiddenStoryPreviewMessage';
import PostedFrom from './PostedFrom';
import './Story.less';

@injectIntl
@withAuthActions
class Story extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    post: PropTypes.shape().isRequired,
    postState: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
    showNSFWPosts: PropTypes.bool.isRequired,
    onActionInitiated: PropTypes.func.isRequired,
    pendingLike: PropTypes.bool,
    pendingFollow: PropTypes.bool,
    pendingBookmark: PropTypes.bool,
    saving: PropTypes.bool,
    ownPost: PropTypes.bool,
    sliderMode: PropTypes.oneOf(['on', 'off', 'auto']),
    onFollowClick: PropTypes.func,
    onSaveClick: PropTypes.func,
    onReportClick: PropTypes.func,
    onLikeClick: PropTypes.func,
    onShareClick: PropTypes.func,
    onEditClick: PropTypes.func,
    showPostModal: PropTypes.func,
  };

  static defaultProps = {
    pendingLike: false,
    pendingFollow: false,
    pendingBookmark: false,
    saving: false,
    ownPost: false,
    sliderMode: 'auto',
    onFollowClick: () => {},
    onSaveClick: () => {},
    onReportClick: () => {},
    onLikeClick: () => {},
    onShareClick: () => {},
    onEditClick: () => {},
    postState: {},
    showPostModal: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      showHiddenStoryPreview: false,
      displayLoginModal: false,
    };

    this.getDisplayStoryPreview = this.getDisplayStoryPreview.bind(this);
    this.handlePostPopoverMenuClick = this.handlePostPopoverMenuClick.bind(this);
    this.handleShowStoryPreview = this.handleShowStoryPreview.bind(this);
  }

  getDisplayStoryPreview() {
    const { post, showNSFWPosts } = this.props;
    const { showHiddenStoryPreview } = this.state;
    const postAuthorReputation = formatter.reputation(post.author_reputation);

    if (showHiddenStoryPreview) return true;

    if (postAuthorReputation >= 0 && isPostTaggedNSFW(post)) {
      return showNSFWPosts;
    } else if (postAuthorReputation < 0) {
      return false;
    }

    return true;
  }

  clickMenuItem(key) {
    const { post } = this.props;
    switch (key) {
      case 'follow':
        this.props.onFollowClick(post);
        break;
      case 'save':
        this.props.onSaveClick(post);
        break;
      case 'report':
        this.props.onReportClick(post);
        break;
      case 'edit':
        this.props.onEditClick(post);
        break;
      default:
    }
  }

  handlePostPopoverMenuClick(key) {
    this.props.onActionInitiated(this.clickMenuItem.bind(this, key));
  }

  handleShowStoryPreview() {
    this.setState({
      showHiddenStoryPreview: true,
    });
  }

  render() {
    const {
      intl,
      user,
      post,
      postState,
      pendingLike,
      pendingFollow,
      pendingBookmark,
      saving,
      rewardFund,
      ownPost,
      sliderMode,
      defaultVotePercent,
      onLikeClick,
      onShareClick,
      onEditClick,
    } = this.props;
    const postAuthorReputation = formatter.reputation(post.author_reputation);
    const showStoryPreview = this.getDisplayStoryPreview();
    const hiddenStoryPreviewMessage = isPostTaggedNSFW(post) ? (
      <NSFWStoryPreviewMessage onClick={this.handleShowStoryPreview} />
    ) : (
      <HiddenStoryPreviewMessage onClick={this.handleShowStoryPreview} />
    );

    let rebloggedUI = null;

    if (post.first_reblogged_by) {
      rebloggedUI = (
        <div className="Story__reblog">
          <i className="iconfont icon-share1" />
          <FormattedMessage
            id="reblogged_username"
            defaultMessage="{username} reblogged"
            values={{
              username: (
                <Link to={`/@${post.first_reblogged_by}`}>
                  <span className="username">{post.first_reblogged_by}</span>
                </Link>
              ),
            }}
          />
        </div>
      );
    } else if (post.first_reblogged_on) {
      rebloggedUI = (
        <div className="Story__reblog">
          <i className="iconfont icon-share1" />
          <FormattedMessage id="reblogged" defaultMessage="Reblogged" />
        </div>
      );
    }

    return (
      <div className="Story" id={`${post.author}-${post.permlink}`}>
        {rebloggedUI}
        <div className="Story__content">
          <div className="Story__header">
            <Link to={`/@${post.author}`}>
              <Avatar username={post.author} size={40} />
            </Link>
            <div className="Story__header__text">
              <span className="Story__header__flex">
                <Link to={`/@${post.author}`}>
                  <h4>
                    <span className="username">{post.author}</span>
                    <Tooltip title={intl.formatMessage({ id: 'reputation_score' })}>
                      <Tag>{postAuthorReputation}</Tag>
                    </Tooltip>
                  </h4>
                </Link>
                <span className="Story__topics">
                  <Topic name={post.category} />
                </span>
              </span>
              <span>
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
                <PostedFrom post={post} />
              </span>
            </div>
          </div>
          <div className="Story__content">
            <a
              role="presentation"
              onClick={() => this.props.showPostModal(post.id)}
              className="Story__content__title"
            >
              <h2>
                {post.title || (
                  <span>
                    <Tag color="#4f545c">RE</Tag>
                    {post.root_title}
                  </span>
                )}
              </h2>
            </a>
            {showStoryPreview ? (
              <a
                role="presentation"
                onClick={() => this.props.showPostModal(post.id)}
                className="Story__content__preview"
              >
                <StoryPreview post={post} />
              </a>
            ) : (
              hiddenStoryPreviewMessage
            )}
          </div>
          <div className="Story__footer">
            <StoryFooter
              user={user}
              post={post}
              postState={postState}
              pendingLike={pendingLike}
              rewardFund={rewardFund}
              ownPost={ownPost}
              sliderMode={sliderMode}
              defaultVotePercent={defaultVotePercent}
              onLikeClick={onLikeClick}
              onShareClick={onShareClick}
              onEditClick={onEditClick}
              pendingFollow={pendingFollow}
              pendingBookmark={pendingBookmark}
              saving={saving}
              handlePostPopoverMenuClick={this.handlePostPopoverMenuClick}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Story;
