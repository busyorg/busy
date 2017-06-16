import React from 'react';
import { connect } from 'react-redux';
import ReduxInfiniteScroll from 'redux-infinite-scroll';
import _ from 'lodash';
// import Modal from '../widgets/modal/Modal';
// import Loading from '../widgets/Loading';
// import PostFeed from '../post/PostFeed';
// import CommentForm from '../comments/CommentForm';
// import * as appActions from '../actions';
import * as commentsActions from '../comments/commentsActions';
import * as bookmarkActions from '../bookmarks/bookmarksActions';
import * as reblogActions from '../app/Reblog/reblogActions';
import * as postActions from '../post/postActions';
// import PostSingle from '../post/postSingle/PostSingle';
import Story from '../components/Story/Story';
import StoryLoading from '../components/Story/StoryLoading';
import './Feed.less';

// openPostModal: appActions.openPostModal,
// closePostModal: appActions.closePostModal
@connect(
  state => ({
    auth: state.auth,
    app: state.app,
    bookmarks: state.bookmarks,
    reblogList: state.reblog
  }),
  {
    openCommentingDraft: commentsActions.openCommentingDraft,
    closeCommentingDraft: commentsActions.closeCommentingDraft,
    toggleBookmark: bookmarkActions.toggleBookmark,
    votePost: postActions.votePost,
    reblog: reblogActions.reblog
  }
)
export default class Feed extends React.Component {
  componentWillMount() {
    if (!this.props.content.length) {
      this.props.loadContent();
    }
  }

  componentDidUpdate() {
    if (!this.props.content.length && !this.props.isFetching) {
      this.props.loadContent();
    }
  }

  // handleCommentRequest(draftProps) {
  //   this.props.openCommentingDraft(draftProps);
  // }

  // handleFeedClick() {
  //   this.props.closeCommentingDraft();
  // }

  // handlePostModalClose = () => {
  //   this.props.closePostModal();
  //   /* eslint-disable */
  //   if (window && window.history) {
  //     window.history.back();
  //   }
  //   /* eslint-enable */
  // };

  render() {
    const {
      auth,
      content,
      isFetching,
      hasMore,
      replies,
      toggleBookmark,
      app,
      bookmarks,
      notify,
      reblog,
      votePost,
      reblogList
    } = this.props;

    return (
      <div className="Feed">
        <div className="Feed__content">
          <ReduxInfiniteScroll
            loadMore={this.props.loadMoreContent}
            loader={<StoryLoading />}
            loadingMore={isFetching}
            hasMore={hasMore}
            elementIsScrollable={false}
            threshold={200}
          >
            {content.map((post) => {
              if (this.props.username) {
                if (this.props.onlyReblogs && post.author === this.props.username) {
                  return false;
                }
                if (this.props.hideReblogs && post.author !== this.props.username) {
                  return false;
                }
              }

              const loggedInUser = auth.user;
              const userVote = _.find(post.active_votes, { voter: loggedInUser.name }) || {};

              const postState = {
                isReblogged: reblogList.includes(post.id),
                isSaved: bookmarks[post.id] !== undefined,
                isLiked: userVote.percent > 0,
                isReported: userVote.percent < 0,
                userFollowed: false // Get Follower list for loggedIn User after login
              };

              const likePost = userVote.percent > 0
                ? () => votePost(post.id, 0)
                : () => votePost(post.id);
              const reportPost = () => votePost(post.id, -1000);

              return (
                <Story
                  key={post.id}
                  post={post}
                  postState={postState}
                  onFollowClick={() => console.log('Follow click')}
                  onSaveClick={() => toggleBookmark(post.id)}
                  onReportClick={reportPost}
                  onLikeClick={likePost}
                  onCommentClick={() => console.log('Comment click')}
                  onShareClick={() => reblog(post.id)}
                />
              );
            })}
          </ReduxInfiniteScroll>
        </div>

        {/* <CommentForm />
        {app.isPostModalOpen &&
          <Modal onClose={this.handlePostModalClose}>
            <PostSingle modal contentList={content} />
          </Modal>}*/}
      </div>
    );
  }
}
