import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import find from 'lodash/find';
import { Helmet } from 'react-helmet';
import sanitize from 'sanitize-html';
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
    state,
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
    bookmarks: PropTypes.shape(),
    pendingBookmarks: PropTypes.arrayOf(PropTypes.number).isRequired,
    saving: PropTypes.bool.isRequired,
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

  handleLikeClick = () => {
    const { user, content } = this.props;
    const userVote = find(content.active_votes, { voter: user.name }) || {};
    if (userVote.percent > 0) {
      this.props.votePost(content.id, content.author, content.permlink, 0);
    } else {
      this.props.votePost(content.id, content.author, content.permlink);
    }
  }

  handleReportClick = () => {
    const { content } = this.props;
    this.props.votePost(content.id, content.author, content.permlink, -1000);
  }

  handleShareClick = () => {
    const { content } = this.props;
    this.props.reblog(content.id);
  }

  handleSaveClick = () => {
    const { content } = this.props;
    this.props.toggleBookmark(content.id, content.author, content.permlink);
  }

  handleFollowClick = (post) => {
    const isFollowed = this.props.followingList.includes(post.author);
    if (isFollowed) {
      this.props.unfollowUser(post.author);
    } else {
      this.props.followUser(post.author);
    }
  };

  handleEditClick = () => {
    this.props.editPost(this.props.content);
  }

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
    } = this.props;

    const postMetaData = jsonParse(content.json_metadata);
    const busyHost = global.postOrigin || 'https://busy.org';
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
    const image = postMetaImage || `${process.env.IMG_HOST}/@${author}`;
    const canonicalUrl = `${canonicalHost}${content.url}`;
    const url = `${busyHost}${content.url}`;
    const metaTitle = `${title} - Busy`;

    return (
      <div>
        <Helmet>
          <title>
            {title}
          </title>
          <link rel="canonical" href={canonicalUrl} />
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
          <meta
            property="twitter:image"
            content={image || 'https://steemit.com/images/steemit-twshare.png'}
          />
        </Helmet>
        <StoryFull
          post={content}
          postState={postState}
          commentCount={content.children}
          pendingLike={pendingLikes.includes(content.id)}
          pendingFollow={pendingFollows.includes(content.author)}
          pendingBookmark={pendingBookmarks.includes(content.id)}
          saving={saving}
          ownPost={author === user.name}
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
