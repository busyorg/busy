import { createAction } from 'redux-actions';
import {
  getBookmarks as getBookmarksHelper,
  toggleBookmark as toggleBookmarkHelper,
} from '../helpers/localStorageHelpers';

export const GET_BOOKMARKS = 'GET_BOOKMARKS';
export const GET_BOOKMARKS_SUCCESS = 'GET_BOOKMARKS_SUCCESS';
export const GET_BOOKMARKS_FAIL = 'GET_BOOKMARKS_FAIL';

export const TOGGLE_BOOKMARK = 'TOGGLE_BOOKMARK';
export const TOGGLE_BOOKMARK_SUCCESS = 'TOGGLE_BOOKMARK_SUCCESS';
export const TOGGLE_BOOKMARK_FAIL = 'TOGGLE_BOOKMARK_FAIL';

export const getBookmarksRequest = createAction(GET_BOOKMARKS);
export const getBookmarksSuccess = createAction(GET_BOOKMARKS_SUCCESS);

export const toggleBookmarkRequest = createAction(TOGGLE_BOOKMARK);
export const toggleBookmarkSuccess = createAction(TOGGLE_BOOKMARK_SUCCESS);

export const getBookmarks = () => {
  return (dispatch) => {
    dispatch(getBookmarksRequest());
    const bookmarks = getBookmarksHelper();
    dispatch(
      getBookmarksSuccess({ bookmarks })
    );
  };
};

export const toggleBookmark = ({ postId }) => {
  return (dispatch) => {
    dispatch(toggleBookmarkRequest({ postId }));
    toggleBookmarkHelper(postId);
    dispatch(
      toggleBookmarkSuccess({ postId })
    );
  };
};
