import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as postActions from './../postActions';
import PostSinglePage from './PostSinglePage';
import PostSingleModal from './PostSingleModal';
import * as reblogActions from '../../app/Reblog/reblogActions';
import * as commentsActions from '../../comments/commentsActions';
import * as bookmarkActions from '../../bookmarks/bookmarksActions';
import * as appActions from '../../actions';
import { editPost } from '../Write/EditorActions';
import Loading from '../../widgets/Loading';

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
    getContent: () => postActions.getContent(
      ownProps.params.author,
      ownProps.params.permlink
    ),
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

  componentWillUnmount() {
    this.props.closePostModal();
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

    return (
      <div>
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
