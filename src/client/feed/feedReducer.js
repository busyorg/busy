import * as feedTypes from './feedActions';
import { TOGGLE_BOOKMARK } from '../bookmarks/bookmarksActions';

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
    case feedTypes.GET_FEED_CONTENT.START:
    case feedTypes.GET_MORE_FEED_CONTENT.START:
    case feedTypes.GET_USER_COMMENTS.START:
    case feedTypes.GET_MORE_USER_COMMENTS.START:
    case feedTypes.GET_REPLIES.START:
    case feedTypes.GET_MORE_REPLIES.START:
    case feedTypes.GET_BOOKMARKS.START:
      return true;
    case feedTypes.GET_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_MORE_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_REPLIES.SUCCESS:
    case feedTypes.GET_MORE_REPLIES.SUCCESS:
    case feedTypes.GET_BOOKMARKS.SUCCESS:
      return false;
    default:
      return state;
  }
};

const feedIdsList = (state = [], action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_MORE_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_REPLIES.SUCCESS:
    case feedTypes.GET_MORE_REPLIES.SUCCESS:
    case feedTypes.GET_BOOKMARKS.SUCCESS:
      return [...state, ...action.payload.map(post => post.id)];
    default:
      return state;
  }
};

const feedCategory = (state = {}, action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT.START:
    case feedTypes.GET_MORE_FEED_CONTENT.START:
    case feedTypes.GET_USER_COMMENTS.START:
    case feedTypes.GET_MORE_USER_COMMENTS.START:
    case feedTypes.GET_REPLIES.START:
    case feedTypes.GET_MORE_REPLIES.START:
    case feedTypes.GET_BOOKMARKS.START:
      return {
        ...state,
        isFetching: feedFetching(undefined, action),
        list: feedIdsList(state.list, action),
      };
    case feedTypes.GET_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_MORE_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_REPLIES.SUCCESS:
    case feedTypes.GET_MORE_REPLIES.SUCCESS:
    case feedTypes.GET_BOOKMARKS.SUCCESS:
      return {
        ...state,
        hasMore: action.payload.length === action.meta.limit || action.meta.once,
        isLoaded: true,
        isFetching: feedFetching(undefined, action),
        list: feedIdsList(state.list, action),
      };
    default:
      return state;
  }
};

const feedSortBy = (state = {}, action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT.START:
    case feedTypes.GET_MORE_FEED_CONTENT.START:
    case feedTypes.GET_USER_COMMENTS.START:
    case feedTypes.GET_MORE_USER_COMMENTS.START:
    case feedTypes.GET_REPLIES.START:
    case feedTypes.GET_MORE_REPLIES.START:
    case feedTypes.GET_BOOKMARKS.START:
      return {
        ...state,
        fetched: false,
        [action.meta.category]: feedCategory(state[action.meta.category], action),
      };
    case feedTypes.GET_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_MORE_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_REPLIES.SUCCESS:
    case feedTypes.GET_MORE_REPLIES.SUCCESS:
    case feedTypes.GET_BOOKMARKS.SUCCESS:
      return {
        ...state,
        fetched: true,
        [action.meta.category]: feedCategory(state[action.meta.category], action),
      };
    default:
      return state;
  }
};

const feed = (state = initialState, action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT.START:
    case feedTypes.GET_MORE_FEED_CONTENT.START:
    case feedTypes.GET_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_USER_COMMENTS.START:
    case feedTypes.GET_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_MORE_USER_COMMENTS.START:
    case feedTypes.GET_MORE_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_REPLIES.START:
    case feedTypes.GET_REPLIES.SUCCESS:
    case feedTypes.GET_MORE_REPLIES.START:
    case feedTypes.GET_MORE_REPLIES.SUCCESS:
    case feedTypes.GET_BOOKMARKS.START:
    case feedTypes.GET_BOOKMARKS.SUCCESS:
      return {
        ...state,
        [action.meta.sortBy]: feedSortBy(state[action.meta.sortBy], action),
      };
    case TOGGLE_BOOKMARK:
      return {
        ...state,
        bookmarks: {
          ...state.bookmarks,
          all: {
            ...state.bookmarks.all,
            list: state.bookmarks.all.list.filter(item => item !== action.payload),
          },
        },
      };
    default:
      return state;
  }
};

export default feed;

export const getFeed = state => state;
