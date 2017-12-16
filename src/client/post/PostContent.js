import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import find from 'lodash/find';
import { Helmet } from 'react-helmet';
import sanitize from 'sanitize-html';
import getImage from '../helpers/getImage';
import { getHasDefaultSlider } from '../helpers/user';
import {
  getAuthenticatedUser,
  getBookmarks,
  getPendingBookmarks,
  getPendingLikes,
  getRebloggedList,
  getPendingReblogs,
  getFollowingList,
  getPendingFollows,
  getIsEditorSaving,
  getVotingPower,
  getRewardFund,
  getVotePercent,
  getAppUrl,
} from '../reducers';
import { editPost } from './Write/editorActions';
import { votePost } from './postActions';
import { reblog } from '../app/Reblog/reblogActions';
import { toggleBookmark } from '../bookmarks/bookmarksActions';
import { followUser, unfollowUser } from '../user/userActions';
import { getHtml } from '../components/Story/Body';
import { jsonParse } from '../helpers/formatter';
import StoryFull from '../components/Story/StoryFull';

@connect(
  state => ({
    user: getAuthenticatedUser(state),
    bookmarks: getBookmarks(state),
    pendingBookmarks: getPendingBookmarks(state),
    pendingLikes: getPendingLikes(state),
    reblogList: getRebloggedList(state),
    pendingReblogs: getPendingReblogs(state),
    followingList: getFollowingList(state),
    pendingFollows: getPendingFollows(state),
    saving: getIsEditorSaving(state),
    sliderMode: getVotingPower(state),
    rewardFund: getRewardFund(state),
    defaultVotePercent: getVotePercent(state),
    appUrl: getAppUrl(state),
  }),
  {
    editPost,
    votePost,
    reblog,
    toggleBookmark,
    followUser,
    unfollowUser,
  },
)
class PostContent extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    content: PropTypes.shape().isRequired,
    pendingLikes: PropTypes.arrayOf(PropTypes.number),
    reblogList: PropTypes.arrayOf(PropTypes.number),
    pendingReblogs: PropTypes.arrayOf(PropTypes.number),
    followingList: PropTypes.arrayOf(PropTypes.string),
    pendingFollows: PropTypes.arrayOf(PropTypes.string),
    pendingBookmarks: PropTypes.arrayOf(PropTypes.number).isRequired,
    saving: PropTypes.bool.isRequired,
    rewardFund: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
    appUrl: PropTypes.string.isRequired,
    bookmarks: PropTypes.shape(),
    sliderMode: PropTypes.oneOf(['on', 'off', 'auto']),
    editPost: PropTypes.func,
    toggleBookmark: PropTypes.func,
    votePost: PropTypes.func,
    reblog: PropTypes.func,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
  };

  static defaultProps = {
    pendingLikes: [],
    reblogList: [],
    pendingReblogs: [],
    followingList: [],
    pendingFollows: [],
    bookmarks: {},
    sliderMode: 'auto',
    editPost: () => {},
    toggleBookmark: () => {},
    votePost: () => {},
    reblog: () => {},
    followUser: () => {},
    unfollowUser: () => {},
  };

  componentDidMount() {
    const { hash } = window.location;
    // PostContent renders only when content is loaded so it's good moment to scroll to comments.
    if (hash.indexOf('comments') !== -1 || /#@[a-zA-Z-.]+\/[a-zA-Z-]+/.test(hash)) {
      const el = document.getElementById('comments');
      if (el) el.scrollIntoView({ block: 'start' });
    }
  }

  handleLikeClick = (post, postState, weight = 10000) => {
    const { sliderMode, user, defaultVotePercent } = this.props;
    if (sliderMode === 'on' || (sliderMode === 'auto' && getHasDefaultSlider(user))) {
      this.props.votePost(post.id, post.author, post.permlink, weight);
    } else if (postState.isLiked) {
      this.props.votePost(post.id, post.author, post.permlink, 0);
    } else {
      this.props.votePost(post.id, post.author, post.permlink, defaultVotePercent);
    }
  };

  handleReportClick = post => this.props.votePost(post.id, post.author, post.permlink, -10000);

  handleShareClick = post => this.props.reblog(post.id);

  handleSaveClick = post => this.props.toggleBookmark(post.id, post.author, post.permlink);

  handleFollowClick = (post) => {
    const isFollowed = this.props.followingList.includes(post.author);
    if (isFollowed) {
      this.props.unfollowUser(post.author);
    } else {
      this.props.followUser(post.author);
    }
  };

  handleEditClick = post => this.props.editPost(post);

  render() {
    const {
      user,
      content,
      pendingLikes,
      reblogList,
      pendingReblogs,
      followingList,
      pendingFollows,
      bookmarks,
      pendingBookmarks,
      saving,
      sliderMode,
      rewardFund,
      defaultVotePercent,
      appUrl,
    } = this.props;

    const postMetaData = jsonParse(content.json_metadata);
    const busyHost = global.postOrigin || appUrl || 'https://busy.org';
    let canonicalHost = busyHost;
    if (postMetaData.app && postMetaData.app.indexOf('steemit') === 0) {
      canonicalHost = 'https://steemit.com';
    }

    const userVote = find(content.active_votes, { voter: user.name }) || {};

    const postState = {
      isReblogged: reblogList.includes(content.id),
      isReblogging: pendingReblogs.includes(content.id),
      isSaved: !!bookmarks[content.id],
      isLiked: userVote.percent > 0,
      isReported: userVote.percent < 0,
      userFollowed: followingList.includes(content.author),
    };

    const { title, category, created, author, body } = content;
    const postMetaImage = postMetaData.image && postMetaData.image[0];
    const htmlBody = getHtml(body, {}, 'text');
    const bodyText = sanitize(htmlBody, { allowedTags: [] });
    const desc = `${bodyText.substring(0, 140)} by ${author}`;
    const image = postMetaImage || getImage(`@${author}`) || '/images/logo.png';
    const canonicalUrl = `${canonicalHost}${content.url}`;
    const url = `${busyHost}${content.url}`;
    const ampUrl = `${url}/amp`;
    const metaTitle = `${title} - Busy`;

    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <link rel="canonical" href={canonicalUrl} />
          <link rel="amphtml" href={ampUrl} />
          <meta property="description" content={desc} />
          <meta property="og:title" content={metaTitle} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={image} />
          <meta property="og:description" content={desc} />
          <meta property="og:site_name" content="Busy" />
          <meta property="article:tag" content={category} />
          <meta property="article:published_time" content={created} />
          <meta property="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
          <meta property="twitter:site" content={'@steemit'} />
          <meta property="twitter:title" content={metaTitle} />
          <meta property="twitter:description" content={desc} />
          <meta property="twitter:image" content={image} />
        </Helmet>
        <StoryFull
          user={user}
          post={content}
          postState={postState}
          commentCount={content.children}
          pendingLike={pendingLikes.includes(content.id)}
          pendingFollow={pendingFollows.includes(content.author)}
          pendingBookmark={pendingBookmarks.includes(content.id)}
          saving={saving}
          rewardFund={rewardFund}
          ownPost={author === user.name}
          sliderMode={sliderMode}
          defaultVotePercent={defaultVotePercent}
          onLikeClick={this.handleLikeClick}
          onReportClick={this.handleReportClick}
          onShareClick={this.handleShareClick}
          onSaveClick={this.handleSaveClick}
          onFollowClick={this.handleFollowClick}
          onEditClick={this.handleEditClick}
        />
      </div>
    );
  }
}

export default PostContent;
