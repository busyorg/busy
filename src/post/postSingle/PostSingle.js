import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as postActions from './../postActions';
import { closePostModal } from '../../actions';
import PostSingleModal from './PostSingleModal';
import PostSinglePage from './PostSinglePage';
import * as reblogActions from '../../app/Reblog/reblogActions';
import * as commentsActions from '../../comments/commentsActions';
import * as bookmarkActions from '../../bookmarks/bookmarksActions';
import { editPost } from '../Write/EditorActions';

@connect(
  ({ posts, app, reblog, auth, bookmarks }) => ({
    posts,
    isPostModalOpen: app.isPostModalOpen,
    lastPostId: app.lastPostId,
    sidebarIsVisible: app.sidebarIsVisible,
    reblogList: reblog,
    bookmarks,
    auth,
  }),
  (dispatch, ownProps) => bindActionCreators({
    reblog: reblogActions.reblog,
    closePostModal,
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
  }, dispatch)
)
export default class PostSingle extends React.Component {

  componentWillMount() {
    const { location, posts } = this.props;
    const postId = location.state;

    if (!postId || !posts[postId]) {
      this.props.getContent();
    }
  }

  render() {
    let onEdit;
    const { modal, posts, isPostModalOpen, sidebarIsVisible, contentList = [], reblog, reblogList, auth } = this.props;

    const postId = this.props.location.state;
    const content = postId && posts[postId];
    if (!content) {
      return null;
    }

    if (content.author === auth.user.name) {
      let jsonMetadata = {};
      try { jsonMetadata = JSON.parse(content.json_metadata); } catch (e) { }
      // Support Only markdown edits
      if (jsonMetadata.format === 'markdown') { onEdit = () => { this.props.editPost(content); }; }
    }

    const currentStoryIndex = contentList.indexOf(content);
    const nextStory = currentStoryIndex > -1 ? contentList[currentStoryIndex + 1] : undefined;

    const isPostLiked =
      auth.isAuthenticated &&
      content.active_votes &&
      content.active_votes.some(vote => vote.voter === auth.user.name && vote.percent > 0);

    const isPostDisliked =
      auth.isAuthenticated &&
      content.active_votes &&
      content.active_votes.some(vote => vote.voter === auth.user.name && vote.percent < 0);

    const canReblog = auth.isAuthenticated && auth.user.name !== content.author;

    const openCommentingDraft = () => this.props.openCommentingDraft({
      parentAuthor: content.author,
      parentPermlink: content.permlink,
      category: content.category,
      id: content.id,
    });

    return (
      <div>
        {(modal && isPostModalOpen) &&
          <PostSingleModal
            content={content}
            sidebarIsVisible={sidebarIsVisible}
            closePostModal={this.props.closePostModal}
            route={this.props.route}
            reblog={() => reblog(content.id)}
            isReblogged={reblogList.includes(content.id)}
            canReblog={canReblog}
            openCommentingDraft={openCommentingDraft}
            likePost={() => this.props.likePost(content.id)}
            unlikePost={() => this.props.unlikePost(content.id)}
            dislikePost={() => this.props.dislikePost(content.id)}
            isPostLiked={isPostLiked}
            isPostDisliked={isPostDisliked}
            bookmarks={this.props.bookmarks}
            nextStory={nextStory}
            openPostModal={this.props.openPostModal}
            toggleBookmark={this.props.toggleBookmark}
            onEdit={onEdit}
          />
        }

        {(!modal && content.author) &&
          <PostSinglePage
            content={content}
            reblog={() => reblog(content.id)}
            isReblogged={reblogList.includes(content.id)}
            canReblog={canReblog}
            openCommentingDraft={openCommentingDraft}
            likePost={() => this.props.likePost(content.id)}
            unlikePost={() => this.props.unlikePost(content.id)}
            dislikePost={() => this.props.dislikePost(content.id)}
            isPostLiked={isPostLiked}
            isPostDisliked={isPostDisliked}
            bookmarks={this.props.bookmarks}
            toggleBookmark={this.props.toggleBookmark}
            onEdit={onEdit}
          />
        }
      </div>
    );
  }
}
