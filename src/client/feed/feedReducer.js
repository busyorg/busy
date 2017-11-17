import * as feedTypes from './feedActions';
import * as userTypes from '../user/userActions';
import * as repliesTypes from '../replies/repliesActions';
import * as bookmarksActions from '../bookmarks/bookmarksActions';

const initialState = {
  feed: {},
  hot: {},
  cashout: {},
  created: {},
  active: {},
  trending: {},
  comments: {},
  blog: {},
  bookmarks: {},
  replies: {},
  promoted: {},
};

const feedFetching = (state = false, action) => {
  switch (action.type) {
    case feedTypes.FEED_HAS_NO_MORE:
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_USER_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_USER_FEED_CONTENT_SUCCESS:
    case bookmarksActions.GET_BOOKMARKS_SUCCESS:
    case repliesTypes.GET_REPLIES_SUCCESS:
    case repliesTypes.GET_MORE_REPLIES_SUCCESS:
    case userTypes.GET_USER_COMMENTS_SUCCESS:
    case userTypes.GET_MORE_USER_COMMENTS_SUCCESS:
      return false;
    case feedTypes.GET_FEED_CONTENT:
    case feedTypes.GET_MORE_FEED_CONTENT:
    case feedTypes.GET_USER_FEED_CONTENT:
    case feedTypes.GET_MORE_USER_FEED_CONTENT:
    case bookmarksActions.GET_BOOKMARKS_START:
    case repliesTypes.GET_REPLIES_START:
    case repliesTypes.GET_MORE_REPLIES_START:
    case userTypes.GET_USER_COMMENTS_START:
    case userTypes.GET_MORE_USER_COMMENTS_START:
      return true;
    default:
      return state;
  }
};

const feedIdsList = (state = [], action) => {
  let postsIds;
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_USER_FEED_CONTENT_SUCCESS:
    case bookmarksActions.GET_BOOKMARKS_SUCCESS:
      postsIds = action.payload.postsData.map(post => post.id);
      return [...postsIds];
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_USER_FEED_CONTENT_SUCCESS: {
      // first element of the array is the same element loaded in the previous chunk
      const morePostsIds = action.payload.postsData.map(post => post.id).slice(1);
      // add data only if it doesn't exist
      if (state[state.length - 1] !== morePostsIds[morePostsIds.length - 1]) {
        return [...state, ...morePostsIds];
      }
      return state;
    }
    case userTypes.GET_USER_COMMENTS_SUCCESS:
      return [...state, ...action.payload.map(comment => comment.id)];
    case userTypes.GET_MORE_USER_COMMENTS_SUCCESS:
      // remove last element from current state because we used it as start_permlink
      // for pagination
      return [...state.slice(0, state.length - 1), ...action.payload.map(comment => comment.id)];
    case repliesTypes.GET_REPLIES_SUCCESS:
    case repliesTypes.GET_MORE_REPLIES_SUCCESS: {
      const replies = [...state, ...Object.keys(action.payload).reverse()];
      return [...new Set(replies)];
    }
    default:
      return state;
  }
};

const feedSortBySubItem = (state = {}, action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT:
    case feedTypes.GET_MORE_FEED_CONTENT:
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_USER_FEED_CONTENT:
    case feedTypes.GET_MORE_USER_FEED_CONTENT:
    case feedTypes.GET_MORE_USER_FEED_CONTENT_SUCCESS:
    case userTypes.GET_USER_COMMENTS_START:
    case userTypes.GET_MORE_USER_COMMENTS_START:
    case bookmarksActions.GET_BOOKMARKS_START:
    case bookmarksActions.GET_BOOKMARKS_SUCCESS:
    case repliesTypes.GET_REPLIES_START:
    case repliesTypes.GET_MORE_REPLIES_START:
      return {
        ...state,
        isFetching: feedFetching(undefined, action),
        list: feedIdsList(state.list, action),
      };
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_USER_FEED_CONTENT_SUCCESS:
      return {
        ...state,
        hasMore: action.payload.postsData.length === action.payload.limit,
        isLoaded: true,
        isFetching: feedFetching(undefined, action),
        list: feedIdsList(state.list, action),
      };
    case userTypes.GET_USER_COMMENTS_SUCCESS:
    case userTypes.GET_MORE_USER_COMMENTS_SUCCESS:
      return {
        ...state,
        hasMore: action.payload.length === action.meta.limit,
        isLoaded: true,
        isFetching: feedFetching(undefined, action),
        list: feedIdsList(state.list, action),
      };
    case repliesTypes.GET_REPLIES_SUCCESS:
    case repliesTypes.GET_MORE_REPLIES_SUCCESS:
      return {
        ...state,
        hasMore: action.payload.length === action.meta.limit,
        isLoaded: true,
        isFetching: feedFetching(undefined, action),
        list: feedIdsList(state.list, action),
      };
    case feedTypes.FEED_HAS_NO_MORE:
      return {
        ...state,
        hasMore: false,
        isFetching: feedFetching(undefined, action),
      };
    default:
      return state;
  }
};

const feedSortByItem = (state = {}, action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT:
    case feedTypes.GET_MORE_FEED_CONTENT:
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
    case feedTypes.FEED_HAS_NO_MORE:
      return {
        ...state,
        [action.payload.category]: feedSortBySubItem(state[action.payload.category], action),
      };
    case feedTypes.GET_USER_FEED_CONTENT:
    case feedTypes.GET_USER_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_USER_FEED_CONTENT:
    case feedTypes.GET_MORE_USER_FEED_CONTENT_SUCCESS:
      return {
        ...state,
        [action.payload.username]: feedSortBySubItem(state[action.payload.username], action),
      };
    case userTypes.GET_USER_COMMENTS_START:
    case userTypes.GET_USER_COMMENTS_SUCCESS:
    case userTypes.GET_MORE_USER_COMMENTS_START:
    case userTypes.GET_MORE_USER_COMMENTS_SUCCESS:
    case repliesTypes.GET_REPLIES_START:
    case repliesTypes.GET_REPLIES_SUCCESS:
    case repliesTypes.GET_MORE_REPLIES_START:
    case repliesTypes.GET_MORE_REPLIES_SUCCESS:
      return {
        ...state,
        [action.meta.username]: feedSortBySubItem(state[action.meta.username], action),
      };
    case bookmarksActions.GET_BOOKMARKS_START:
    case bookmarksActions.GET_BOOKMARKS_SUCCESS:
      return {
        ...state,
        all: feedSortBySubItem(state.all, action),
      };
    default:
      return state;
  }
};

const feed = (state = initialState, action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT:
    case feedTypes.GET_MORE_FEED_CONTENT:
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_USER_FEED_CONTENT:
    case feedTypes.GET_USER_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_USER_FEED_CONTENT:
    case feedTypes.GET_MORE_USER_FEED_CONTENT_SUCCESS:
    case feedTypes.FEED_HAS_NO_MORE:
      return {
        ...state,
        [action.payload.sortBy]: feedSortByItem(state[action.payload.sortBy], action),
      };
    case userTypes.GET_USER_COMMENTS_START:
    case userTypes.GET_USER_COMMENTS_SUCCESS:
    case userTypes.GET_MORE_USER_COMMENTS_START:
    case userTypes.GET_MORE_USER_COMMENTS_SUCCESS:
      return {
        ...state,
        comments: feedSortByItem(state.comments, action),
      };
    case bookmarksActions.GET_BOOKMARKS_START:
    case bookmarksActions.GET_BOOKMARKS_SUCCESS:
      return {
        ...state,
        bookmarks: feedSortByItem(state.bookmarks, action),
      };
    case repliesTypes.GET_REPLIES_START:
    case repliesTypes.GET_REPLIES_SUCCESS:
    case repliesTypes.GET_MORE_REPLIES_START:
    case repliesTypes.GET_MORE_REPLIES_SUCCESS:
      return {
        ...state,
        replies: feedSortByItem(state.replies, action),
      };
    case bookmarksActions.TOGGLE_BOOKMARK: {
      const toggledId = action.payload;
      // remove from feed if toggled off
      if (state.bookmarks.all && state.bookmarks.all.list.includes(toggledId)) {
        return {
          ...state,
          bookmarks: {
            ...state.bookmarks,
            all: {
              ...state.bookmarks.all,
              list: state.bookmarks.all.list.filter(item => item !== toggledId),
            },
          },
        };
      }
      return state;
    }
    default:
      return state;
  }
};

export default feed;

export const getFeed = state => state;
