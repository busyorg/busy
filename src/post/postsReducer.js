import * as feedTypes from '../feed/feedActions';
import * as bookmarksActions from '../bookmarks/bookmarksActions';
import * as postsActions from './postActions';
import * as commentsActions from '../comments/commentsActions';
import * as userActions from '../user/userActions';

const postItem = (state = {}, action) => {
  switch (action.type) {
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

const initialState = {
  lastPostId: null,
  postLoading: false,
  pendingLikes: [],
};

const posts = (state = initialState, action) => {
  const postsTemp = {};
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_USER_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_USER_FEED_CONTENT_SUCCESS:
    case bookmarksActions.GET_BOOKMARKS_SUCCESS:
      action.payload.postsData.forEach((post) => { postsTemp[post.id] = post; });
      return {
        ...state,
        ...postsTemp,
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
    case postsActions.GET_CONTENT_START:
      if (action.meta.afterLike) {
        return state;
      }
      return {
        ...state,
        postLoading: true,
      };
    case postsActions.GET_CONTENT_SUCCESS:
      if (action.meta.afterLike) {
        return {
          ...state,
          lastPostId: action.payload.id,
          postLoading: false,
          pendingLikes: state.pendingLikes.filter(post => post !== action.payload.id),
          [action.payload.id]: {
            ...state[action.payload.id],
            ...action.payload,
          },
        };
      }
      return {
        ...state,
        lastPostId: action.payload.id,
        postLoading: false,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload,
        },
      };
    case postsActions.GET_CONTENT_ERROR:
      return {
        ...state,
        postLoading: false,
      };
    case postsActions.LIKE_POST_START:
      return {
        ...state,
        pendingLikes: [
          ...state.pendingLikes,
          action.meta.postId,
        ],
      };
    case postsActions.LIKE_POST_ERROR:
      return {
        ...state,
        pendingLikes: state.pendingLikes.filter(post => post !== action.meta.postId),
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

export const getPosts = state => state;
export const getPostContent = state => state[state.lastPostId];
export const getIsPostLoading = state => state.postLoading;
export const getPendingLikes = state => state.pendingLikes;
