import React from 'react';
import Header from '../app/Header';
import TriggerPost from '../app/Trigger/TriggerPost';
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
        <TriggerPost
          reblog={reblog}
          isReblogged={isReblogged}
          openCommentingDraft={openCommentingDraft}
          likePost={this.props.likePost}
          unlikePost={this.props.unlikePost}
          isPostLiked={this.props.isPostLiked}
        />
        { content.author ?
          <PostSingleContent content={content} /> : <Loading />
        }
        <CommentForm />
      </div>
    );
  }
}
