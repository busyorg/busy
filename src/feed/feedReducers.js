import * as feedTypes from './feedActionTypes';

const initialState = {
  feed: {},
  hot: {},
  cashout: {},
  created: {},
  active: {},
  trending: {},
};

const feedTagItem = (state = [], action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
      const postsIds = action.payload.postsData.map(post => post.id);
      return [
        ...postsIds,
      ];
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
      const morePostsIds = action.payload.postsData.map(post => post.id);
      // add data only if it doesn't exist
      if (state[state.length - 1].id !== morePostsIds[morePostsIds.length - 1].id) {
        return [
          ...state,
          ...morePostsIds,
        ];
      }
    default:
      return state;
  }
};

const feedPathItem = (state = {}, action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
      return {
        ...state,
        [action.payload.category]: feedTagItem(state[action.payload.category], action)
      };
    default:
      return state;
  }
};

const feed = (state = initialState, action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
      return {
        ...state,
        [action.payload.sortBy]: feedPathItem(state[action.payload.sortBy], action)
      };
    default:
      return state;
  }
};


export default feed;
