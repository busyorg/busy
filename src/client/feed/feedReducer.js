import _ from 'lodash';
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

const feedIdsList = (state = [], action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT.START:
    case feedTypes.GET_USER_COMMENTS.START:
    case feedTypes.GET_REPLIES.START:
    case feedTypes.GET_BOOKMARKS.START:
      return [];
    case feedTypes.GET_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_REPLIES.SUCCESS:
    case feedTypes.GET_BOOKMARKS.SUCCESS:
      return action.payload.map(post => post.id);
    case feedTypes.GET_MORE_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_MORE_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_MORE_REPLIES.SUCCESS:
      return _.uniq([...state, ...action.payload.map(post => post.id)]);
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
        isFetching: true,
        isLoaded: false,
        failed: false,
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
        isFetching: false,
        isLoaded: true,
        failed: false,
        hasMore: action.payload.length === action.meta.limit || action.meta.once,
        list: feedIdsList(state.list, action),
      };
    case feedTypes.GET_FEED_CONTENT.ERROR:
    case feedTypes.GET_MORE_FEED_CONTENT.ERROR:
    case feedTypes.GET_USER_COMMENTS.ERROR:
    case feedTypes.GET_MORE_USER_COMMENTS.ERROR:
    case feedTypes.GET_REPLIES.ERROR:
    case feedTypes.GET_MORE_REPLIES.ERROR:
    case feedTypes.GET_BOOKMARKS.ERROR:
      return {
        ...state,
        isFetching: false,
        isLoaded: true,
        failed: true,
        hasMore: false,
      };
    default:
      return state;
  }
};

const feedSortBy = (state = {}, action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT.START:
    case feedTypes.GET_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_FEED_CONTENT.ERROR:
    case feedTypes.GET_MORE_FEED_CONTENT.START:
    case feedTypes.GET_MORE_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT.ERROR:
    case feedTypes.GET_USER_COMMENTS.START:
    case feedTypes.GET_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_USER_COMMENTS.ERROR:
    case feedTypes.GET_MORE_USER_COMMENTS.START:
    case feedTypes.GET_MORE_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_MORE_USER_COMMENTS.ERROR:
    case feedTypes.GET_REPLIES.START:
    case feedTypes.GET_REPLIES.SUCCESS:
    case feedTypes.GET_REPLIES.ERROR:
    case feedTypes.GET_MORE_REPLIES.START:
    case feedTypes.GET_MORE_REPLIES.SUCCESS:
    case feedTypes.GET_MORE_REPLIES.ERROR:
    case feedTypes.GET_BOOKMARKS.START:
    case feedTypes.GET_BOOKMARKS.SUCCESS:
    case feedTypes.GET_BOOKMARKS.ERROR:
      return {
        ...state,
        [action.meta.category]: feedCategory(state[action.meta.category], action),
      };
    default:
      return state;
  }
};

const feed = (state = initialState, action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT.START:
    case feedTypes.GET_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_FEED_CONTENT.ERROR:
    case feedTypes.GET_MORE_FEED_CONTENT.START:
    case feedTypes.GET_MORE_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT.ERROR:
    case feedTypes.GET_USER_COMMENTS.START:
    case feedTypes.GET_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_USER_COMMENTS.ERROR:
    case feedTypes.GET_MORE_USER_COMMENTS.START:
    case feedTypes.GET_MORE_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_MORE_USER_COMMENTS.ERROR:
    case feedTypes.GET_REPLIES.START:
    case feedTypes.GET_REPLIES.SUCCESS:
    case feedTypes.GET_REPLIES.ERROR:
    case feedTypes.GET_MORE_REPLIES.START:
    case feedTypes.GET_MORE_REPLIES.SUCCESS:
    case feedTypes.GET_MORE_REPLIES.ERROR:
    case feedTypes.GET_BOOKMARKS.START:
    case feedTypes.GET_BOOKMARKS.SUCCESS:
    case feedTypes.GET_BOOKMARKS.ERROR:
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
            list: state.bookmarks.all.list.filter(item => item !== action.meta.id),
          },
        },
      };
    default:
      return state;
  }
};

export default feed;

export const getFeed = state => state;
