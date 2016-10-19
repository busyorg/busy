import object from 'lodash/object';
import * as bookmarksActions from './bookmarksActions';

const bookmarks = (state = {}, action) => {
  switch (action.type) {
    case bookmarksActions.TOGGLE_BOOKMARK_SUCCESS:
      if (object.has(state, action.payload.postId)) {
        return object.omit(state, action.payload.postId);
      } else {
        return {
          ...state,
          [action.payload.postId]: {},
        };
      }
    case bookmarksActions.GET_BOOKMARKS_SUCCESS:
      return action.payload.bookmarks;
    default:
      return state;
  }
};

export default bookmarks;
