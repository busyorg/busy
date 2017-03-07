import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as postActions from './../postActions';
import PostSinglePage from './PostSinglePage';
import * as reblogActions from '../../app/Reblog/reblogActions';
import * as commentsActions from '../../comments/commentsActions';
import * as bookmarkActions from '../../bookmarks/bookmarksActions';
import { editPost } from '../Write/EditorActions';

@connect(
  ({ posts, app, reblog, auth, bookmarks }) => ({
    posts,
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
    const { posts, contentList = [], reblog, reblogList, auth } = this.props;

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

    return (
      <div>
        {content.author &&
          <PostSinglePage
            content={content}
            reblog={() => reblog(content.id)}
            isReblogged={reblogList.includes(content.id)}
            canReblog={canReblog}
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
