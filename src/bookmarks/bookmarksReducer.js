import * as bookmarksActions from './bookmarksActions';

const bookmarks = (state = {}, action) => {
  switch (action.type) {
    case bookmarksActions.GET_BOOKMARKS_START:
    case bookmarksActions.GET_STORED_BOOKMARKS:
    case bookmarksActions.TOGGLE_BOOKMARK_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

export default bookmarks;
