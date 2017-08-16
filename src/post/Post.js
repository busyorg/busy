import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { bindActionCreators } from 'redux';
import sanitize from 'sanitize-html';
import VisibilitySensor from 'react-visibility-sensor';

import {
  getAuthenticatedUser,
  getPostContent,
  getIsPostLoading,
  getBookmarks,
  getPendingLikes,
  getRebloggedList,
  getPendingReblogs,
  getFollowingList,
  getPendingFollows,
} from '../reducers';

import { getHtml } from '../components/Story/Body';
import Comments from '../comments/Comments';
import * as postActions from './postActions';
import * as reblogActions from '../app/Reblog/reblogActions';
import * as bookmarkActions from '../bookmarks/bookmarksActions';
import { followUser, unfollowUser } from '../user/userActions';
import Loading from '../components/Icon/Loading';
import { jsonParse } from '../helpers/formatter';
import StoryFull from '../components/Story/StoryFull';
import RightSidebar from '../app/Sidebar/RightSidebar';
import Affix from '../components/Utils/Affix';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';

@withRouter
@connect(
  state => ({
    user: getAuthenticatedUser(state),
    content: getPostContent(state),
    loading: getIsPostLoading(state),
    bookmarks: getBookmarks(state),
    pendingLikes: getPendingLikes(state),
    reblogList: getRebloggedList(state),
    pendingReblogs: getPendingReblogs(state),
    followingList: getFollowingList(state),
    pendingFollows: getPendingFollows(state),
  }),
  (dispatch, ownProps) =>
    bindActionCreators(
      {
        getContent: () =>
          postActions.getContent({
            author: _.get(ownProps.match, 'params.author'),
            permlink: _.get(ownProps.match, 'params.permlink'),
          }),
        toggleBookmark: bookmarkActions.toggleBookmark,
        votePost: postActions.votePost,
        reblog: reblogActions.reblog,
        followUser,
        unfollowUser,
      },
      dispatch,
    ),
)
export default class Post extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    content: PropTypes.shape(),
    loading: PropTypes.bool.isRequired,
    pendingLikes: PropTypes.arrayOf(PropTypes.number),
    reblogList: PropTypes.arrayOf(PropTypes.number),
    pendingReblogs: PropTypes.arrayOf(PropTypes.number),
    followList: PropTypes.arrayOf(PropTypes.string),
    pendingFollows: PropTypes.arrayOf(PropTypes.string),
    bookmarks: PropTypes.shape(),
    getContent: PropTypes.func,
    toggleBookmark: PropTypes.func,
    votePost: PropTypes.func,
    reblog: PropTypes.func,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
  };

  static defaultProps = {
    content: undefined,
    pendingLikes: [],
    reblogList: [],
    pendingReblogs: [],
    followList: [],
    pendingFollows: [],
    bookmarks: {},
    getContent: () => {},
    toggleBookmark: () => {},
    votePost: () => {},
    reblog: () => {},
    followUser: () => {},
    unfollowUser: () => {},
  };

  static needs = [postActions.getContent];

  state = {
    commentsVisible: false,
  };

  componentWillMount() {
    this.props.getContent();
  }

  componentDidUpdate() {
    const { hash } = window.location;
    if (hash !== '') {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) element.scrollIntoView();
      }, 0);
    }
  }

  componentWillUnmount() {
    if (process.env.IS_BROWSER) {
      global.document.title = 'Busy';
    }
  }

  handleFollowClick = (post) => {
    const isFollowed = this.props.followList.includes(post.author);
    if (isFollowed) {
      this.props.unfollowUser(post.author);
    } else {
      this.props.followUser(post.author);
    }
  };

  handleCommentsVisibility = (visible) => {
    if (visible) {
      this.setState({
        commentsVisible: true,
      });
    }
  };

  render() {
    const {
      user,
      content,
      loading,
      pendingLikes,
      reblogList,
      pendingReblogs,
      followList,
      pendingFollows,
      bookmarks,
      votePost,
      reblog,
      toggleBookmark,
    } = this.props;

    if (this.props.loading || !content) {
      return (
        <div className="main-panel">
          <Loading />
        </div>
      );
    }

    const postMetaData = jsonParse(content.json_metadata);
    const busyHost = global.postOrigin || 'https://busy.org';
    let canonicalHost = busyHost;
    if (postMetaData.app && postMetaData.app.indexOf('steemit') === 0) {
      canonicalHost = 'https://steemit.com';
    }

    const userVote = _.find(content.active_votes, { voter: user.name }) || {};

    const postState = {
      isReblogged: reblogList.includes(content.id),
      isReblogging: pendingReblogs.includes(content.id),
      isSaved:
        bookmarks[user.name] &&
        bookmarks[user.name].filter(bookmark => bookmark.id === content.id).length > 0,
      isLiked: userVote.percent > 0,
      isReported: userVote.percent < 0,
      userFollowed: followList.includes(content.author),
    };

    const likePost =
      userVote.percent > 0 ? () => votePost(content.id, 0) : () => votePost(content.id);
    const reportPost = () => votePost(content.id, -1000);

    const { title, category, created, author, body } = content;
    const postMetaImage = postMetaData.image && postMetaData.image[0];
    const htmlBody = getHtml(body, {}, 'text');
    const bodyText = sanitize(htmlBody, { allowedTags: [] });
    const desc = `${bodyText.substring(0, 140)} by ${author}`;
    const image = postMetaImage || `${process.env.STEEMCONNECT_IMG_HOST}/@${author}`;
    const canonicalUrl = `${canonicalHost}${content.url}`;
    const url = `${busyHost}${content.url}`;
    const metaTitle = `${title} - Busy`;

    return (
      <div className="main-panel">
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
        <ScrollToTopOnMount />
        <div className="shifted">
          <div className="post-layout container">
            <Affix className="rightContainer" stickPosition={77}>
              <div className="right">
                <RightSidebar />
              </div>
            </Affix>
            <div className="center" style={{ paddingBottom: '24px' }}>
              {loading && !pendingLikes.filter(post => post === content.id) > 0
                ? <Loading />
                : <StoryFull
                  post={content}
                  postState={postState}
                  commentCount={content.children}
                  pendingLike={pendingLikes.includes(content.id)}
                  pendingFollow={pendingFollows.includes(content.author)}
                  onFollowClick={this.handleFollowClick}
                  onSaveClick={() => toggleBookmark(content.id, content.author, content.permlink)}
                  onReportClick={reportPost}
                  onLikeClick={likePost}
                  onShareClick={() => reblog(content.id)}
                />}
              <VisibilitySensor onChange={this.handleCommentsVisibility} />
              <div id="comments" />
              <Comments show={this.state.commentsVisible} post={content} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
