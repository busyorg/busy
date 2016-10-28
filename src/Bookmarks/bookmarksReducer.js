import * as bookmarksActions from './bookmarksActions';

const bookmarks = (state = [], action) => {
  switch (action.type) {
    case bookmarksActions.GET_BOOKMARKS_SUCCESS:
    case bookmarksActions.TOGGLE_BOOKMARK_SUCCESS:
      return action.payload.bookmarks;
    default:
      return state;
  }
};

export default bookmarks;
