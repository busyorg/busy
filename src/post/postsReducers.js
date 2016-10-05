import * as feedTypes from './../feed/feedActionTypes';

const posts = (state = {}, action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_USER_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_USER_FEED_CONTENT_SUCCESS:
      const posts = {};
      action.payload.postsData.forEach(post => posts[post.id] = post);
      return {
        ...state,
        ...posts,
      };
    default:
      return state;
  }
};


export default posts;
