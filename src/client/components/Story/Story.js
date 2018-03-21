import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  FormattedMessage,
  FormattedRelative,
  FormattedDate,
  FormattedTime,
} from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import { Tag, Tooltip } from 'antd';
import formatter from '../../helpers/steemitFormatter';
import { getHasDefaultSlider } from '../../helpers/user';
import {
  isPostDeleted,
  isPostTaggedNSFW,
  dropCategory,
  isBannedPost,
} from '../../helpers/postHelpers';
import withAuthActions from '../../auth/withAuthActions';
import StoryPreview from './StoryPreview';
import StoryFooter from '../StoryFooter/StoryFooter';
import Avatar from '../Avatar';
import Topic from '../Button/Topic';
import NSFWStoryPreviewMessage from './NSFWStoryPreviewMessage';
import HiddenStoryPreviewMessage from './HiddenStoryPreviewMessage';
import DMCARemovedMessage from './DMCARemovedMessage';
import PostedFrom from './PostedFrom';
import './Story.less';

@withRouter
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
    pendingFlag: PropTypes.bool,
    pendingFollow: PropTypes.bool,
    pendingBookmark: PropTypes.bool,
    saving: PropTypes.bool,
    ownPost: PropTypes.bool,
    sliderMode: PropTypes.oneOf(['on', 'off', 'auto']),
    history: PropTypes.shape(),
    showPostModal: PropTypes.func,
    votePost: PropTypes.func,
    toggleBookmark: PropTypes.func,
    reblog: PropTypes.func,
    editPost: PropTypes.func,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
    push: PropTypes.func,
  };

  static defaultProps = {
    pendingLike: false,
    pendingFlag: false,
    pendingFollow: false,
    pendingBookmark: false,
    saving: false,
    ownPost: false,
    sliderMode: 'auto',
    history: {},
    showPostModal: () => {},
    votePost: () => {},
    toggleBookmark: () => {},
    reblog: () => {},
    editPost: () => {},
    followUser: () => {},
    unfollowUser: () => {},
    push: () => {},
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
    this.handlePostModalDisplay = this.handlePostModalDisplay.bind(this);
    this.handlePreviewClickPostModalDisplay = this.handlePreviewClickPostModalDisplay.bind(this);
    this.handleLikeClick = this.handleLikeClick.bind(this);
    this.handleReportClick = this.handleReportClick.bind(this);
    this.handleShareClick = this.handleShareClick.bind(this);
    this.handleFollowClick = this.handleFollowClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state);
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

  handleLikeClick(post, postState, weight = 10000) {
    const { sliderMode, user, defaultVotePercent } = this.props;
    if (sliderMode === 'on' || (sliderMode === 'auto' && getHasDefaultSlider(user))) {
      this.props.votePost(post.id, post.author, post.permlink, weight);
    } else if (postState.isLiked) {
      this.props.votePost(post.id, post.author, post.permlink, 0);
    } else {
      this.props.votePost(post.id, post.author, post.permlink, defaultVotePercent);
    }
  }

  handleReportClick(post, postState) {
    const weight = postState.isReported ? 0 : -10000;
    this.props.votePost(post.id, post.author, post.permlink, weight);
  }

  handleShareClick(post) {
    this.props.reblog(post.id);
  }

  handleFollowClick(post) {
    const { userFollowed } = this.props.postState;
    if (userFollowed) {
      this.props.unfollowUser(post.author);
    } else {
      this.props.followUser(post.author);
    }
  }

  handleEditClick(post) {
    if (post.depth === 0) return this.props.editPost(post);
    return this.props.push(`${post.url}-edit`);
  }

  clickMenuItem(key) {
    const { post, postState } = this.props;
    switch (key) {
      case 'follow':
        this.handleFollowClick(post);
        break;
      case 'save':
        this.props.toggleBookmark(post.id, post.author, post.permlink);
        break;
      case 'report':
        this.handleReportClick(post, postState);
        break;
      case 'edit':
        this.handleEditClick(post);
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

  handlePostModalDisplay(e) {
    e.preventDefault();
    const { post } = this.props;
    const isReplyPreview = _.isEmpty(post.title) || post.title !== post.root_title;
    const openInNewTab = _.get(e, 'metaKey', false) || _.get(e, 'ctrlKey', false);
    const postURL = dropCategory(post.url);

    if (isReplyPreview) {
      this.props.history.push(postURL);
    } else if (openInNewTab) {
      if (window) {
        const url = `${window.location.origin}${postURL}`;
        window.open(url);
      }
    } else {
      this.props.showPostModal(post);
    }
  }

  handlePreviewClickPostModalDisplay(e) {
    e.preventDefault();

    const { post } = this.props;
    const isReplyPreview = _.isEmpty(post.title) || post.title !== post.root_title;
    const elementNodeName = _.toLower(_.get(e, 'target.nodeName', ''));
    const elementClassName = _.get(e, 'target.className', '');
    const showPostModal =
      elementNodeName !== 'i' && elementClassName !== 'PostFeedEmbed__playButton';
    const openInNewTab = _.get(e, 'metaKey', false) || _.get(e, 'ctrlKey', false);
    const postURL = dropCategory(post.url);

    if (isReplyPreview) {
      this.props.history.push(postURL);
    } else if (openInNewTab && showPostModal) {
      if (window) {
        const url = `${window.location.origin}${postURL}`;
        window.open(url);
      }
    } else if (showPostModal) {
      this.props.showPostModal(post);
    }
  }

  renderStoryPreview() {
    const { post } = this.props;
    const showStoryPreview = this.getDisplayStoryPreview();
    const hiddenStoryPreviewMessage = isPostTaggedNSFW(post) ? (
      <NSFWStoryPreviewMessage onClick={this.handleShowStoryPreview} />
    ) : (
      <HiddenStoryPreviewMessage onClick={this.handleShowStoryPreview} />
    );

    if (isBannedPost(post)) {
      return <DMCARemovedMessage />;
    }

    return showStoryPreview ? (
      <a
        href={dropCategory(post.url)}
        target="_blank"
        onClick={this.handlePreviewClickPostModalDisplay}
        className="Story__content__preview"
      >
        <StoryPreview post={post} />
      </a>
    ) : (
      hiddenStoryPreviewMessage
    );
  }

  render() {
    const {
      intl,
      user,
      post,
      postState,
      pendingLike,
      pendingFlag,
      pendingFollow,
      pendingBookmark,
      saving,
      rewardFund,
      ownPost,
      sliderMode,
      defaultVotePercent,
    } = this.props;

    if (isPostDeleted(post)) return <div />;

    const postAuthorReputation = formatter.reputation(post.author_reputation);

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
              href={dropCategory(post.url)}
              target="_blank"
              onClick={this.handlePostModalDisplay}
              className="Story__content__title"
            >
              <h2>
                {post.depth !== 0 && <Tag color="#4f545c">RE</Tag>}
                {post.title || post.root_title}
              </h2>
            </a>
            {this.renderStoryPreview()}
          </div>
          <div className="Story__footer">
            <StoryFooter
              user={user}
              post={post}
              postState={postState}
              pendingLike={pendingLike}
              pendingFlag={pendingFlag}
              rewardFund={rewardFund}
              ownPost={ownPost}
              sliderMode={sliderMode}
              defaultVotePercent={defaultVotePercent}
              onLikeClick={this.handleLikeClick}
              onShareClick={this.handleShareClick}
              onEditClick={this.handleEditClick}
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
