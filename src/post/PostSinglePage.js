import React from 'react';
import Header from '../app/Header';
import MenuPost from '../app/Menu/MenuPost';
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
        <Header />
        <MenuPost
          reblog={reblog}
          isReblogged={isReblogged}
          openCommentingDraft={openCommentingDraft}
          likePost={this.props.likePost}
          unlikePost={this.props.unlikePost}
          dislikePost={this.props.dislikePost}
          isPostLiked={this.props.isPostLiked}
          isPostDisliked={this.props.isPostDisliked}
          content={content}
        />
        { content.author ?
          <PostSingleContent
            content={content}
            bookmarks={this.props.bookmarks}
            toggleBookmark={this.props.toggleBookmark}
          />
          :
          <Loading />
        }
        <CommentForm />
      </div>
    );
  }
}
