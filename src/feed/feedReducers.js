import * as feedTypes from './feedActionTypes';

const initialState = {
  feed: {},
  hot: {},
  cashout: {},
  created: {},
  active: {},
  trending: {},
};

const feedLoading = (state = false, action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
      return false;
    case feedTypes.GET_FEED_CONTENT:
    case feedTypes.GET_MORE_FEED_CONTENT:
      return true;
    default:
      return state;
  }
};

const feedIdsList = (state = [], action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
      const postsIds = action.payload.postsData.map(post => post.id);
      return [
        ...postsIds,
      ];
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
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

const feedCategoryItem = (state = {}, action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT:
    case feedTypes.GET_MORE_FEED_CONTENT:
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
      return {
        loading: feedLoading(undefined, action),
        list: feedIdsList(state.list, action)
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
      return {
        ...state,
        [action.payload.category]: feedCategoryItem(state[action.payload.category], action)
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
      return {
        ...state,
        [action.payload.sortBy]: feedSortByItem(state[action.payload.sortBy], action)
      };
    default:
      return state;
  }
};

export default feed;
