import _ from 'lodash';
import * as bookmarksTypes from './bookmarksActionTypes';

const bookmarks = (state = {}, action) => {
  switch (action.type) {
    case bookmarksTypes.TOGGLE_BOOKMARK_SUCCESS:
      if (_.has(state, action.payload.postId)) {
        delete state[action.payload.postId];
      } else {
        state[action.payload.postId] = {};
      }
      return state;
    default:
      return state;
  }
};

export default bookmarks;
