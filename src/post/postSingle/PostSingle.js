import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { bindActionCreators } from 'redux';
import sanitize from 'sanitize-html';

import { getHtml } from '../Body';
import * as postActions from './../postActions';
import PostSinglePage from './PostSinglePage';
import PostSingleModal from './PostSingleModal';
import * as reblogActions from '../../app/Reblog/reblogActions';
import * as commentsActions from '../../comments/commentsActions';
import * as bookmarkActions from '../../bookmarks/bookmarksActions';
import * as appActions from '../../actions';
import { editPost } from '../Write/EditorActions';
import Loading from '../../widgets/Loading';
import { jsonParse } from '../../helpers/formatter';

@connect(
  ({ posts, app, reblog, auth, bookmarks }) => ({
    content: posts[app.lastPostId] || null,
    lastPostId: app.lastPostId,
    sidebarIsVisible: app.sidebarIsVisible,
    reblogList: reblog,
    bookmarks,
    auth,
  }),
  (dispatch, ownProps) => bindActionCreators({
    reblog: reblogActions.reblog,
    editPost,
    getContent: () => postActions.getContent({
      author: ownProps.params ? ownProps.params.author : undefined,
      permlink: ownProps.params ? ownProps.params.permlink : undefined,
    }),
    openCommentingDraft: commentsActions.openCommentingDraft,
    closeCommentingDraft: commentsActions.closeCommentingDraft,
    likePost: id => postActions.votePost(id),
    unlikePost: id => postActions.votePost(id, 0),
    dislikePost: id => postActions.votePost(id, -1000),
    toggleBookmark: bookmarkActions.toggleBookmark,
    closePostModal: appActions.closePostModal,
    openPostModal: appActions.openPostModal,
  }, dispatch)
)
export default class PostSingle extends Component {
  static propTypes = {
    modal: PropTypes.bool,
    contentList: PropTypes.arrayOf(PropTypes.shape({
      // eslint-disable-next-line
      author: PropTypes.string,
    })),
  };

  static needs = [
    postActions.getContent
  ]

  static defaultProps = {
    modal: false,
    contentList: [],
    modalResetScroll: () => null,
  };

  componentWillMount() {
    const { content } = this.props;
    if (!content) {
      this.props.getContent();
    }
  }
  componentDidMount() {
    const { modal } = this.props;
    if (modal) {
      this.unlisten = browserHistory.listen(() => {
        this.props.closePostModal();
      });
    }
  }

  componentWillUnmount() {
    this.props.closePostModal();
    if (this.unlisten) { this.unlisten(); }
    if (process.env.IS_BROWSER) {
      global.document.title = 'Busy';
    }
  }

  render() {
    let onEdit;
    const { contentList, reblog, reblogList, auth, content, modal } = this.props;

    if (!content || !content.author) {
      return <div className="main-panel"><Loading /></div>;
    }

    if (content.author === auth.user.name) {
      let jsonMetadata = {};
      try { jsonMetadata = JSON.parse(content.json_metadata); } catch (e) { }
      // Support Only markdown edits
      if (jsonMetadata.format === 'markdown') { onEdit = () => { this.props.editPost(content); }; }
    }

    const currentStoryIndex = contentList.indexOf(content);
    const nextStory = currentStoryIndex > -1 ? contentList[currentStoryIndex + 1] : undefined;
    const prevStory = currentStoryIndex > -1 ? contentList[currentStoryIndex - 1] : undefined;

    const isPostLiked =
      auth.isAuthenticated &&
      content.active_votes &&
      content.active_votes.some(vote => vote.voter === auth.user.name && vote.percent > 0);

    const isPostDisliked =
      auth.isAuthenticated &&
      content.active_votes &&
      content.active_votes.some(vote => vote.voter === auth.user.name && vote.percent < 0);

    const canReblog = auth.isAuthenticated && auth.user.name !== content.author;

    const theProps = {
      content,
      reblog: () => reblog(content.id),
      isReblogged: reblogList.includes(content.id),
      canReblog,
      likePost: () => this.props.likePost(content.id),
      unlikePost: () => this.props.unlikePost(content.id),
      dislikePost: () => this.props.dislikePost(content.id),
      isPostLiked,
      isPostDisliked,
      contentList,
      bookmarks: this.props.bookmarks,
      toggleBookmark: this.props.toggleBookmark,
      onEdit,
      nextStory,
      prevStory,
      openPostModal: this.props.openPostModal,
      modalResetScroll: this.props.modalResetScroll,
    };

    const postMetaData = jsonParse(content.json_metadata);
    let canonicalHost = 'https://busy.org';
    if (postMetaData.app.indexOf('steemit') === 0) {
      canonicalHost = 'https://steemit.com';
    }

    const { title, category, created, author, body } = content;
    const postMetaImage = postMetaData.image && postMetaData.image[0];
    const htmlBody = getHtml(body, {}, 'text');
    const bodyText = sanitize(htmlBody, { allowedTags: [] });
    const desc = `${bodyText.substring(0, 140)} by ${author}`;
    const image = postMetaImage || `${process.env.STEEMCONNECT_IMG_HOST}/@${author}`;
    const url = `${canonicalHost}${content.url}`;

    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <link rel="canonical" href={url} />
          <meta property="description" content={desc} />

          <meta property="og:title" content={title} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={image} />
          <meta property="og:description" content={desc} />
          <meta property="og:site_name" content="Busy" />
          <meta property="article:tag" content={category} />
          <meta property="article:published_time" content={created} />

          <meta property="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
          <meta property="twitter:site" content={'@steemit'} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={desc} />
          <meta property="twitter:image" content={image || 'https://steemit.com/images/steemit-twshare.png'} />
        </Helmet>
        {content.author && !modal &&
          <PostSinglePage {...theProps} />
        }

        {modal &&
          <PostSingleModal {...theProps} />
        }
      </div>
    );
  }
}
