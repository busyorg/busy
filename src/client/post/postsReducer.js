import _ from 'lodash';
import * as feedTypes from '../feed/feedActions';
import * as postsActions from './postActions';
import * as commentsActions from '../comments/commentsActions';

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
  pendingLikes: {},
  list: {},
  postsStates: {},
};

const posts = (state = initialState, action) => {
  switch (action.type) {
    case feedTypes.GET_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_MORE_USER_COMMENTS.SUCCESS: {
      const commentsMoreList = {};
      action.payload.forEach(comment => {
        commentsMoreList[comment.id] = comment;
      });
      return {
        ...state,
        list: {
          ...state.list,
          ...commentsMoreList,
        },
      };
    }
    case feedTypes.GET_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_REPLIES.SUCCESS:
    case feedTypes.GET_MORE_REPLIES.SUCCESS:
    case feedTypes.GET_BOOKMARKS.SUCCESS: {
      const list = {
        ...state.list,
      };
      const postsStates = {
        ...state.postsStates,
      };

      _.each(action.payload, post => {
        list[post.id] = post;
        postsStates[`${post.author}/${post.permlink}}`] = {
          fetching: false,
          loaded: true,
          failed: false,
        };
      });

      return {
        ...state,
        list,
        postsStates,
      };
    }
    case postsActions.GET_CONTENT.START:
      if (action.meta.afterLike) return state;
      return {
        ...state,
        postsStates: {
          ...state.postsStates,
          [`${action.meta.author}/${action.meta.permlink}}`]: {
            fetching: true,
            loaded: false,
            failed: false,
          },
        },
      };
    case postsActions.GET_CONTENT.SUCCESS: {
      const baseState = {
        ...state,
        list: {
          ...state.list,
          [action.payload.id]: {
            ...state[action.payload.id],
            ...action.payload,
          },
        },
        postsStates: {
          ...state.postsStates,
          [`${action.meta.author}/${action.meta.permlink}}`]: {
            fetching: false,
            loaded: true,
            failed: false,
          },
        },
      };
      if (action.meta.afterLike) {
        return {
          ...baseState,
          pendingLikes: _.omit(state.pendingLikes, action.payload.id),
        };
      }
      return baseState;
    }
    case postsActions.GET_CONTENT.ERROR:
      return {
        ...state,
        postsStates: {
          ...state.postsStates,
          [`${action.meta.author}/${action.meta.permlink}}`]: {
            fetching: false,
            loaded: false,
            failed: true,
          },
        },
      };
    case postsActions.LIKE_POST_START:
      return {
        ...state,
        pendingLikes: { ...state.pendingLikes, [action.meta.postId]: action.meta },
      };
    case postsActions.LIKE_POST_ERROR:
      return {
        ...state,
        pendingLikes: _.omit(state.pendingLikes, action.meta.postId),
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

export const getPosts = state => state.list;
export const getPostContent = (state, author, permlink) =>
  Object.values(state.list).find(post => post.author === author && post.permlink === permlink);
export const getPendingLikes = state => state.pendingLikes;
export const getIsPostFetching = (state, author, permlink) =>
  state.postsStates[`${author}/${permlink}}`] &&
  state.postsStates[`${author}/${permlink}}`].fetching;
export const getIsPostLoaded = (state, author, permlink) =>
  state.postsStates[`${author}/${permlink}}`] && state.postsStates[`${author}/${permlink}}`].loaded;
export const getIsPostFailed = (state, author, permlink) =>
  state.postsStates[`${author}/${permlink}}`] && state.postsStates[`${author}/${permlink}}`].failed;
