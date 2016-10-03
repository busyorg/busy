import * as feedTypes from './feedActionTypes';

const initialState = {
  feed: {},
  hot: {},
  cashout: {},
  created: {},
  active: {},
  trending: {},
  comments: {},
  blog: {},
};

const feedFetching = (state = false, action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_USER_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_USER_FEED_CONTENT_SUCCESS:
      return false;
    case feedTypes.GET_FEED_CONTENT:
    case feedTypes.GET_MORE_FEED_CONTENT:
    case feedTypes.GET_USER_FEED_CONTENT:
    case feedTypes.GET_MORE_USER_FEED_CONTENT:
      return true;
    default:
      return state;
  }
};

const feedIdsList = (state = [], action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_USER_FEED_CONTENT_SUCCESS:
      const postsIds = action.payload.postsData.map(post => post.id);
      return [
        ...postsIds,
      ];
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_USER_FEED_CONTENT_SUCCESS:
      // first element of the array is the same element loaded in the previous chunk
      const morePostsIds = action.payload.postsData.map(post => post.id).slice(1);
      // add data only if it doesn't exist
      if (state[state.length - 1] !== morePostsIds[morePostsIds.length - 1]) {
        return [
          ...state,
          ...morePostsIds,
        ];
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
      return {
        ...state,
        isFetching: feedFetching(undefined, action),
        list: feedIdsList(state.list, action),
      };
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_USER_FEED_CONTENT_SUCCESS:
      return {
        ...state,
        hasMore: true,
        isLoaded: true,
        isFetching: feedFetching(undefined, action),
        list: feedIdsList(state.list, action),
      };
    case feedTypes.FEED_HAS_NO_MORE:
      return {
        ...state,
        hasMore: false,
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
        [action.payload.category]: feedSortBySubItem(state[action.payload.category], action)
      };
    case feedTypes.GET_USER_FEED_CONTENT:
    case feedTypes.GET_USER_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_USER_FEED_CONTENT:
    case feedTypes.GET_MORE_USER_FEED_CONTENT_SUCCESS:
      return {
        ...state,
        [action.payload.username]: feedSortBySubItem(state[action.payload.username], action)
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
        [action.payload.sortBy]: feedSortByItem(state[action.payload.sortBy], action)
      };
    default:
      return state;
  }
};

export default feed;
