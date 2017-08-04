import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ReduxInfiniteScroll from 'redux-infinite-scroll';
import _ from 'lodash';
import * as bookmarkActions from '../bookmarks/bookmarksActions';
import * as reblogActions from '../app/Reblog/reblogActions';
import * as postActions from '../post/postActions';
import { followUser, unfollowUser } from '../user/userActions';
import Story from '../components/Story/Story';
import StoryLoading from '../components/Story/StoryLoading';
import './Feed.less';

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
    toggleBookmark: bookmarkActions.toggleBookmark,
    votePost: postActions.votePost,
    reblog: reblogActions.reblog,
    followUser,
    unfollowUser,
  },
)
export default class Feed extends React.Component {
  static propTypes = {
    auth: PropTypes.shape().isRequired,
    content: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    pendingLikes: PropTypes.arrayOf(PropTypes.number).isRequired,
    pendingFollows: PropTypes.arrayOf(PropTypes.string).isRequired,
    pendingReblogs: PropTypes.arrayOf(PropTypes.number).isRequired,
    bookmarks: PropTypes.shape().isRequired,
    followingList: PropTypes.arrayOf(PropTypes.string).isRequired,
    reblogList: PropTypes.arrayOf(PropTypes.number).isRequired,
    isFetching: PropTypes.bool,
    hasMore: PropTypes.bool,
    toggleBookmark: PropTypes.func,
    votePost: PropTypes.func,
    reblog: PropTypes.func,
    followUser: PropTypes.func,
    unfollowUser: PropTypes.func,
    loadMoreContent: PropTypes.func,
  };

  static defaultProps = {
    isFetching: false,
    hasMore: false,
    toggleBookmark: () => {},
    votePost: () => {},
    reblog: () => {},
    followUser: () => {},
    unfollowUser: () => {},
    loadMoreContent: () => {},
  };

  handleFollowClick = (post) => {
    const isFollowed = this.props.followingList.includes(post.author);
    if (isFollowed) {
      this.props.unfollowUser(post.author);
    } else {
      this.props.followUser(post.author);
    }
  };

  render() {
    const {
      auth,
      content,
      isFetching,
      hasMore,
      pendingLikes,
      bookmarks,
      reblogList,
      followingList,
      pendingFollows,
      pendingReblogs,
      toggleBookmark,
      reblog,
      votePost,
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
              // if (this.props.username) {
              //   if (this.props.onlyReblogs && post.author === this.props.username) {
              //     return false;
              //   }
              //   if (this.props.hideReblogs && post.author !== this.props.username) {
              //     return false;
              //   }
              // }

              const loggedInUser = auth.user;
              const userVote = _.find(post.active_votes, { voter: loggedInUser.name }) || {};

              const postState = {
                isReblogged: reblogList.includes(post.id),
                isReblogging: pendingReblogs.includes(post.id),
                isSaved:
                  bookmarks[loggedInUser.name] &&
                  bookmarks[loggedInUser.name].filter(bookmark => bookmark.id === post.id).length >
                    0,
                isLiked: userVote.percent > 0,
                isReported: userVote.percent < 0,
                userFollowed: followingList.includes(post.author),
              };

              const likePost =
                userVote.percent > 0
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
                  onShareClick={() => reblog(post.id)}
                />
              );
            })}
          </ReduxInfiniteScroll>
        </div>
      </div>
    );
  }
}
