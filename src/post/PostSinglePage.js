import React from 'react';
import PostSingleContent from './PostSingleContent';
import Loading from '../widgets/Loading';
import CommentForm from '../comments/CommentForm';

export default class PostSinglePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { content, reblog, isReblogged, openCommentingDraft } = this.props;
    return (
      <div className="main-panel">
        { content.author ?
          <PostSingleContent
            content={content}
            bookmarks={this.props.bookmarks}
            toggleBookmark={this.props.toggleBookmark}
            reblog={reblog}
            isReblogged={isReblogged}
            canReblog={this.props.canReblog}
            openCommentingDraft={openCommentingDraft}
            likePost={this.props.likePost}
            unlikePost={this.props.unlikePost}
            dislikePost={this.props.dislikePost}
            isPostLiked={this.props.isPostLiked}
            isPostDisliked={this.props.isPostDisliked}
            onEdit={this.props.onEdit}
          />
          :
          <Loading />
        }
        <CommentForm />
      </div>
    );
  }
}
