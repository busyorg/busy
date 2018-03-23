import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import find from 'lodash/find';
import { Helmet } from 'react-helmet';
import sanitize from 'sanitize-html';
import { getHasDefaultSlider } from '../helpers/user';
import { dropCategory, isBannedPost } from '../helpers/postHelpers';
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
  getRewriteLinks,
  getAppUrl,
} from '../reducers';
import { editPost } from './Write/editorActions';
import { votePost } from './postActions';
import { reblog } from '../app/Reblog/reblogActions';
import { toggleBookmark } from '../bookmarks/bookmarksActions';
import { followUser, unfollowUser } from '../user/userActions';
import { getAvatarURL } from '../components/Avatar';
import { getHtml } from '../components/Story/Body';
import { jsonParse } from '../helpers/formatter';
import StoryFull from '../components/Story/StoryFull';
import DMCARemovedMessage from '../components/Story/DMCARemovedMessage';

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
    rewriteLinks: getRewriteLinks(state),
  }),
  {
    editPost,
    votePost,
    reblog,
    toggleBookmark,
    followUser,
    unfollowUser,
    push,
  },
)
class PostContent extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    content: PropTypes.shape().isRequired,
    signature: PropTypes.string,
    pendingLikes: PropTypes.shape(),
    reblogList: PropTypes.arrayOf(PropTypes.number),
    pendingReblogs: PropTypes.arrayOf(PropTypes.number),
    followingList: PropTypes.arrayOf(PropTypes.string),
    pendingFollows: PropTypes.arrayOf(PropTypes.string),
    pendingBookmarks: PropTypes.arrayOf(PropTypes.number).isRequired,
    saving: PropTypes.bool.isRequired,
    rewardFund: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
    rewriteLinks: PropTypes.bool.isRequired,
    appUrl: PropTypes.string.isRequired,
    bookmarks: PropTypes.shape(),
    sliderMode: PropTypes.oneOf(['on', 'off', 'auto']),
    editPost: PropTypes.func,
    toggleBookmark: PropTypes.func,
    votePost: PropTypes.func,
    reblog: PropTypes.func,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
    push: PropTypes.func,
  };

  static defaultProps = {
    signature: null,
    pendingLikes: {},
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
    push: () => {},
  };

  constructor(props) {
    super(props);

    this.handleReportClick = this.handleReportClick.bind(this);
  }

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

  handleReportClick(post, postState) {
    const weight = postState.isReported ? 0 : -10000;
    this.props.votePost(post.id, post.author, post.permlink, weight);
  }

  handleShareClick = post => this.props.reblog(post.id);

  handleSaveClick = post => this.props.toggleBookmark(post.id, post.author, post.permlink);

  handleFollowClick = post => {
    const isFollowed = this.props.followingList.includes(post.author);
    if (isFollowed) {
      this.props.unfollowUser(post.author);
    } else {
      this.props.followUser(post.author);
    }
  };

  handleEditClick = post => {
    if (post.depth === 0) return this.props.editPost(post);
    this.props.push(`${post.url}-edit`);
    return Promise.resolve(null);
  };

  render() {
    const {
      user,
      content,
      signature,
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
      rewriteLinks,
      appUrl,
    } = this.props;

    if (isBannedPost(content)) return <DMCARemovedMessage className="center" />;

    const postMetaData = jsonParse(content.json_metadata);
    const busyHost = appUrl || 'https://busy.org';
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

    const pendingLike =
      pendingLikes[content.id] &&
      (pendingLikes[content.id].weight > 0 ||
        (pendingLikes[content.id].weight === 0 && postState.isLiked));

    const pendingFlag =
      pendingLikes[content.id] &&
      (pendingLikes[content.id].weight < 0 ||
        (pendingLikes[content.id].weight === 0 && postState.isReported));

    const { title, category, created, author, body } = content;
    const postMetaImage = postMetaData.image && postMetaData.image[0];
    const htmlBody = getHtml(body, {}, 'text');
    const bodyText = sanitize(htmlBody, { allowedTags: [] });
    const desc = `${bodyText.substring(0, 140)} by ${author}`;
    const image = postMetaImage || getAvatarURL(author) || '/images/logo.png';
    const canonicalUrl = `${canonicalHost}${dropCategory(content.url)}`;
    const url = `${busyHost}${dropCategory(content.url)}`;
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
          signature={signature}
          commentCount={content.children}
          pendingLike={pendingLike}
          pendingFlag={pendingFlag}
          pendingFollow={pendingFollows.includes(content.author)}
          pendingBookmark={pendingBookmarks.includes(content.id)}
          saving={saving}
          rewardFund={rewardFund}
          ownPost={author === user.name}
          sliderMode={sliderMode}
          defaultVotePercent={defaultVotePercent}
          rewriteLinks={rewriteLinks}
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
