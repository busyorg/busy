import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { bindActionCreators } from 'redux';
import sanitize from 'sanitize-html';

import { getHtml } from '../Body';
import * as postActions from './../postActions';
import PostSinglePage from './PostSinglePage';
import Comments from '../../comments/Comments';
import PostSingleModal from './PostSingleModal';
import * as reblogActions from '../../app/Reblog/reblogActions';
import * as bookmarkActions from '../../bookmarks/bookmarksActions';
import * as appActions from '../../actions';
import Loading from '../../components/Icon/Loading';
import { jsonParse } from '../../helpers/formatter';
import StoryFull from '../../components/Story/StoryFull';
import { RightSidebar } from '../../app/Sidebar/index';
import Affix from '../../components/Utils/Affix';
import ScrollToTop from '../../components/Utils/ScrollToTop';

// reblogList: reblog,
// bookmarks,
// reblog: reblogActions.reblog,
// editPost,
// openCommentingDraft: commentsActions.openCommentingDraft,
// closeCommentingDraft: commentsActions.closeCommentingDraft,
// toggleBookmark: bookmarkActions.toggleBookmark,
// closePostModal: appActions.closePostModal,
// openPostModal: appActions.openPostModal
@withRouter
@connect(
  ({ posts, app, reblog, auth, bookmarks }) => ({
    content: posts[app.lastPostId] || null,
    loading: posts.postLoading,
    lastPostId: app.lastPostId,
    reblogList: reblog,
    bookmarks,
    auth,
  }),
  (dispatch, ownProps) =>
    bindActionCreators(
      {
        getContent: () =>
          postActions.getContent({
            author: _.get(ownProps.match, 'params.author'),
            permlink: _.get(ownProps.match, 'params.permlink'),
          }),
        removeCurrentContent: appActions.removeCurrentContent,
        toggleBookmark: bookmarkActions.toggleBookmark,
        votePost: postActions.votePost,
        reblog: reblogActions.reblog,
      },
      dispatch
    )
)
export default class PostSingle extends Component {
  // static propTypes = {
  //   modal: PropTypes.bool,
  //   contentList: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       // eslint-disable-next-line
  //       author: PropTypes.string
  //     })
  //   )
  // };

  static needs = [postActions.getContent];

  // static defaultProps = {
  //   modal: false,
  //   contentList: [],
  //   modalResetScroll: () => null
  // };
  state = {
    content: null,
  }

  componentWillMount() {
    this.props.getContent();
  }
  // componentDidMount() {
  //   const { modal } = this.props;
  //   if (modal) {
  //     this.unlisten = this.props.history.listen(() => {
  //       this.props.closePostModal();
  //     });
  //   }
  // }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentPost &&
      this.props.currentPost.id !== nextProps.currentPost.id
    ) {
      this.props.getContent();
    }
  }

  componentWillUnmount() {
    // this.props.closePostModal();
    // if (this.unlisten) { this.unlisten(); }
    if (process.env.IS_BROWSER) {
      global.document.title = 'Busy';
    }
    this.props.removeCurrentContent();
  }

  render() {
    // let onEdit;
    const { content, loading, auth, reblogList, bookmarks, votePost, reblog, toggleBookmark } = this.props;

    if (this.props.isLoading || !content) {
      return <div className="main-panel"><Loading /></div>;
    }

    // if (content.author === auth.user.name) {
    //   let jsonMetadata = {};
    //   try { jsonMetadata = JSON.parse(content.json_metadata); } catch (e) { }
    //   // Support Only markdown edits
    //   if (jsonMetadata.format === 'markdown') { onEdit = () => { this.props.editPost(content); }; }
    // }

    // const currentStoryIndex = contentList.indexOf(content);
    // const nextStory = currentStoryIndex > -1 ? contentList[currentStoryIndex + 1] : undefined;
    // const prevStory = currentStoryIndex > -1 ? contentList[currentStoryIndex - 1] : undefined;

    // const isPostLiked =
    //   auth.isAuthenticated &&
    //   content.active_votes &&
    //   content.active_votes.some(vote => vote.voter === auth.user.name && vote.percent > 0);

    // const isPostDisliked =
    //   auth.isAuthenticated &&
    //   content.active_votes &&
    //   content.active_votes.some(vote => vote.voter === auth.user.name && vote.percent < 0);

    // const canReblog = auth.isAuthenticated && auth.user.name !== content.author;

    // const theProps = {
    //   content,
    //   reblog: () => reblog(content.id),
    //   isReblogged: reblogList.includes(content.id),
    //   canReblog,
    //   likePost: () => this.props.likePost(content.id),
    //   unlikePost: () => this.props.unlikePost(content.id),
    //   dislikePost: () => this.props.dislikePost(content.id),
    //   isPostLiked,
    //   isPostDisliked,
    //   contentList,
    //   bookmarks: this.props.bookmarks,
    //   toggleBookmark: this.props.toggleBookmark,
    //   onEdit,
    //   nextStory,
    //   prevStory,
    //   openPostModal: this.props.openPostModal,
    //   modalResetScroll: this.props.modalResetScroll,
    // };

    const postMetaData = jsonParse(content.json_metadata);
    const busyHost = global.postOrigin || 'https://busy.org';
    let canonicalHost = busyHost;
    if (postMetaData.app && postMetaData.app.indexOf('steemit') === 0) {
      canonicalHost = 'https://steemit.com';
    }

    const loggedInUser = auth.user;
    const userVote = _.find(content.active_votes, { voter: loggedInUser.name }) || {};

    const postState = {
      isReblogged: reblogList.includes(content.id),
      isSaved: bookmarks[content.id] !== undefined,
      isLiked: userVote.percent > 0,
      isReported: userVote.percent < 0,
      userFollowed: false // Get Follower list for loggedIn User after login
    };

    const likePost = userVote.percent > 0
      ? () => votePost(content.id, 0)
      : () => votePost(content.id);
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
          <title>{title}</title>
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
        <ScrollToTop />
        <div className="shifted">
          <div className="post-layout container">
            <Affix className="rightContainer" stickPosition={77}>
              <div className="right">
                <RightSidebar auth={auth} />
              </div>
            </Affix>
            <div className="center">
              {
                (loading) ? <Loading /> :
                <StoryFull
                  post={content}
                  postState={postState}
                  onFollowClick={() => console.log('Follow click')}
                  onSaveClick={() => toggleBookmark(content.id)}
                  onReportClick={reportPost}
                  onLikeClick={likePost}
                  onCommentClick={() => console.log('Comment click')}
                  onShareClick={() => reblog(content.id)}
                />
              }
            </div>
          </div>
          {/* {content.author && !modal &&
            <PostSinglePage {...theProps} />
          }

          {modal &&
            <PostSingleModal {...theProps} />
          }*/}
        </div>
      </div>
    );
  }
}
