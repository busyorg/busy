import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReduxInfiniteScroll from 'redux-infinite-scroll';
import _ from 'lodash';
import * as bookmarkActions from '../bookmarks/bookmarksActions';
import * as reblogActions from '../app/Reblog/reblogActions';
import * as postActions from '../post/postActions';
import { followUser, unfollowUser } from '../user/userActions';
import { editPost } from '../post/Write/editorActions';

import {
  getAuthenticatedUser,
  getBookmarks,
  getPendingBookmarks,
  getPendingLikes,
  getRebloggedList,
  getPendingReblogs,
  getFollowingList,
  getPendingFollows,
  getIsEditorSaving,
  getVotingPower,
} from '../reducers';

import Story from '../components/Story/Story';
import StoryLoading from '../components/Story/StoryLoading';
import './Feed.less';

@connect(
  state => ({
    user: getAuthenticatedUser(state),
    bookmarks: getBookmarks(state),
    pendingBookmarks: getPendingBookmarks(state),
    pendingLikes: getPendingLikes(state),
    reblogList: getRebloggedList(state),
    pendingReblogs: getPendingReblogs(state),
    followingList: getFollowingList(state),
    pendingFollows: getPendingFollows(state),
    saving: getIsEditorSaving(state),
    sliderMode: getVotingPower(state),
  }),
  {
    editPost,
    toggleBookmark: bookmarkActions.toggleBookmark,
    votePost: postActions.votePost,
    reblog: reblogActions.reblog,
    followUser,
    unfollowUser,
  },
)
export default class Feed extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    content: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    pendingLikes: PropTypes.arrayOf(PropTypes.number).isRequired,
    pendingFollows: PropTypes.arrayOf(PropTypes.string).isRequired,
    pendingReblogs: PropTypes.arrayOf(PropTypes.number).isRequired,
    bookmarks: PropTypes.shape().isRequired,
    pendingBookmarks: PropTypes.arrayOf(PropTypes.number).isRequired,
    followingList: PropTypes.arrayOf(PropTypes.string).isRequired,
    reblogList: PropTypes.arrayOf(PropTypes.number).isRequired,
    saving: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool,
    hasMore: PropTypes.bool,
    sliderMode: PropTypes.oneOf(['on', 'off', 'auto']),
    editPost: PropTypes.func,
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
    sliderMode: 'auto',
    editPost: () => {},
    toggleBookmark: () => {},
    votePost: () => {},
    reblog: () => {},
    followUser: () => {},
    unfollowUser: () => {},
    loadMoreContent: () => {},
  };

  handleLikeClick = (post, weight = 10000) => {
    const { sliderMode, user } = this.props;
    if (sliderMode === 'auto' || sliderMode === 'off') {
      console.log('voting on', post.permlink, 'for auto');
      const userVote = find(post.active_votes, { voter: user.name }) || {};
      if (userVote.percent > 0) {
        this.props.votePost(post.id, post.author, post.permlink, 0);
      } else {
        this.props.votePost(post.id, post.author, post.permlink);
      }
    } else {
      this.props.votePost(post.id, post.author, post.permlink, weight);
    }
  };

  handleReportClick = post => this.props.votePost(post.id, post.author, post.permlink, -10000);

  handleShareClick = post => this.props.reblog(post.id);

  handleSaveClick = post => this.props.toggleBookmark(post.id, post.author, post.permlink);

  handleFollowClick = (post) => {
    const isFollowed = this.props.followingList.includes(post.author);
    if (isFollowed) {
      this.props.unfollowUser(post.author);
    } else {
      this.props.followUser(post.author);
    }
  };

  handleEditClick = post => this.props.editPost(post);

  render() {
    const {
      user,
      content,
      isFetching,
      hasMore,
      pendingLikes,
      bookmarks,
      pendingBookmarks,
      reblogList,
      followingList,
      pendingFollows,
      pendingReblogs,
      saving,
      sliderMode,
    } = this.props;

    return (
      <ReduxInfiniteScroll
        className="Feed"
        loadMore={this.props.loadMoreContent}
        loader={<StoryLoading />}
        loadingMore={isFetching}
        hasMore={hasMore}
        elementIsScrollable={false}
        threshold={200}
      >
        {content.map((post) => {
          const userVote = _.find(post.active_votes, { voter: user.name }) || {};

          const postState = {
            isReblogged: reblogList.includes(post.id),
            isReblogging: pendingReblogs.includes(post.id),
            isSaved: !!bookmarks[post.id],
            isLiked: userVote.percent > 0,
            isReported: userVote.percent < 0,
            userFollowed: followingList.includes(post.author),
          };

          return (
            <Story
              key={post.id}
              post={post}
              postState={postState}
              pendingLike={pendingLikes.includes(post.id)}
              pendingFollow={pendingFollows.includes(post.author)}
              pendingBookmark={pendingBookmarks.includes(post.id)}
              saving={saving}
              ownPost={post.author === user.name}
              sliderMode={sliderMode}
              onLikeClick={this.handleLikeClick}
              onReportClick={this.handleReportClick}
              onShareClick={this.handleShareClick}
              onSaveClick={this.handleSaveClick}
              onFollowClick={this.handleFollowClick}
              onEditClick={this.handleEditClick}
            />
          );
        })}
      </ReduxInfiniteScroll>
    );
  }
}
