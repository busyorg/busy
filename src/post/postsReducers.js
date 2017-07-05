import * as feedTypes from '../feed/feedActions';
import * as bookmarksActions from '../bookmarks/bookmarksActions';
import * as postsActions from './postActions';
import * as commentsActions from '../comments/commentsActions';
import * as userActions from '../user/userActions';

const postItem = (state = {}, action) => {
  switch (action.type) {
    case postsActions.LIKE_POST_START: {
      let optimisticActiveVotes;

      if (action.meta.weight !== 0) {
        optimisticActiveVotes = [
          ...state.active_votes.filter(vote => vote.voter !== action.meta.voter),
          {
            voter: action.meta.voter,
            percent: action.meta.weight,
          }
        ];
      } else {
        optimisticActiveVotes = state.active_votes.filter(
          vote => vote.voter !== action.meta.voter
        );
      }

      const optimisticNetVotes = action.meta.weight > 0
        ? parseInt(state.net_votes, 10) + 1
        : parseInt(state.net_votes, 10) - 1;

      return {
        ...state,
        active_votes: optimisticActiveVotes,
        net_votes: optimisticNetVotes,
      };
    }
    case commentsActions.SEND_COMMENT_START:
      if (action.meta.isReplyToComment) {
        return state;
      }

      return {
        ...state,
        children: parseInt(state.children, 10) + 1,
      };
    default:
      return state;
  }
};

const posts = (state = {}, action) => {
  let posts = {};
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_USER_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_USER_FEED_CONTENT_SUCCESS:
    case bookmarksActions.GET_BOOKMARKS_SUCCESS:
      action.payload.postsData.forEach(post => posts[post.id] = post);
      return {
        ...state,
        ...posts,
      };
    case userActions.GET_USER_REPLIES_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case userActions.GET_MORE_USER_REPLIES_SUCCESS:
      action.payload.forEach((post) => { posts[post.id] = post; });
      return {
        ...state,
        ...posts,
      };
    case postsActions.GET_CONTENT_SUCCESS:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload,
        },
      };
    case postsActions.LIKE_POST_START:
      return {
        ...state,
        [action.meta.postId]: postItem(state[action.meta.postId], action),
      };
    case commentsActions.SEND_COMMENT_START:
      return {
        ...state,
        [action.meta.parentId]: postItem(state[action.meta.parentId], action),
      };
    default:
      return state;
  }
};


export default posts;
