import * as bookmarksTypes from './bookmarksActionTypes';

const bookmarks = (state = {}, action) => {
  switch (action.type) {
    case bookmarksTypes.TOGGLE_BOOKMARK:
      return state;
    default:
      return state;
  }
};

export default bookmarks;
