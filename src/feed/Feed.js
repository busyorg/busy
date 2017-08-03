import React from 'react';
import { connect } from 'react-redux';
import ReduxInfiniteScroll from 'redux-infinite-scroll';
import _ from 'lodash';
// import Modal from '../widgets/modal/Modal';
// import PostFeed from '../post/PostFeed';
// import CommentForm from '../comments/CommentForm';
// import * as appActions from '../actions';
import * as commentsActions from '../comments/commentsActions';
import * as bookmarkActions from '../bookmarks/bookmarksActions';
import * as reblogActions from '../app/Reblog/reblogActions';
import * as postActions from '../post/postActions';
import { followUser, unfollowUser } from '../user/userActions';
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
    pendingLikes: state.posts.pendingLikes,
    bookmarks: state.bookmarks,
    reblogList: state.reblog.rebloggedList,
    pendingReblogs: state.reblog.pendingReblogs,
    followingList: state.user.following.list,
    pendingFollows: state.user.following.pendingFollows,
  }),
  {
    openCommentingDraft: commentsActions.openCommentingDraft,
    closeCommentingDraft: commentsActions.closeCommentingDraft,
    toggleBookmark: bookmarkActions.toggleBookmark,
    votePost: postActions.votePost,
    reblog: reblogActions.reblog,
    followUser,
    unfollowUser,
  },
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

  handleFollowClick = (post) => {
    const isFollowed = this.props.followingList.includes(post.author);
    if (isFollowed) {
      this.props.unfollowUser(post.author);
    } else {
      this.props.followUser(post.author);
    }
  }

  render() {
    const {
      auth,
      content,
      isFetching,
      hasMore,
      toggleBookmark,
      pendingLikes,
      bookmarks,
      pendingReblogs,
      reblog,
      votePost,
      reblogList,
      followingList,
      pendingFollows,
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
                isReblogging: pendingReblogs.includes(post.id),
                isSaved: bookmarks[loggedInUser.name]
                  && bookmarks[loggedInUser.name]
                    .filter(bookmark => bookmark.id === post.id).length > 0,
                isLiked: userVote.percent > 0,
                isReported: userVote.percent < 0,
                userFollowed: followingList.includes(post.author),
              };


              const likePost = userVote.percent > 0
                ? () => votePost(post.id, post.author, post.permlink, 0)
                : () => votePost(post.id, post.author, post.permlink);
              const reportPost = () => votePost(post.id, -1000);

              return (
                <Story
                  key={post.id}
                  post={post}
                  postState={postState}
                  pendingLike={pendingLikes.includes(post.id)}
                  pendingFollow={pendingFollows.includes(post.author)}
                  onFollowClick={this.handleFollowClick}
                  onSaveClick={() => toggleBookmark(post.id, post.author, post.permlink)}
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
          </Modal>} */}
      </div>
    );
  }
}
