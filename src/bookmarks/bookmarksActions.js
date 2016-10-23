import { createAction } from 'redux-actions';
import {
  getBookmarks as getBookmarksHelper,
  toggleBookmark as toggleBookmarkHelper,
} from '../helpers/localStorageHelpers';

export const GET_BOOKMARKS = '@bookmarks/GET_BOOKMARKS';
export const GET_BOOKMARKS_SUCCESS = '@bookmarks/GET_BOOKMARKS_SUCCESS';
export const GET_BOOKMARKS_FAIL = '@bookmarks/GET_BOOKMARKS_FAIL';

export const getBookmarksRequest = createAction(GET_BOOKMARKS);
export const getBookmarksSuccess = createAction(GET_BOOKMARKS_SUCCESS);

export const getBookmarks = () => {
  return (dispatch) => {
    dispatch(getBookmarksRequest());
    const bookmarks = getBookmarksHelper();
    dispatch(
      getBookmarksSuccess({ bookmarks })
    );
  };
};

export const TOGGLE_BOOKMARK = '@bookmarks/TOGGLE_BOOKMARK';
export const TOGGLE_BOOKMARK_SUCCESS = '@bookmarks/TOGGLE_BOOKMARK_SUCCESS';
export const TOGGLE_BOOKMARK_FAIL = '@bookmarks/TOGGLE_BOOKMARK_FAIL';

export const toggleBookmarkRequest = createAction(TOGGLE_BOOKMARK);
export const toggleBookmarkSuccess = createAction(TOGGLE_BOOKMARK_SUCCESS);

export const toggleBookmark = ({ postId }) => {
  return (dispatch) => {
    dispatch(toggleBookmarkRequest({ postId }));
    toggleBookmarkHelper(postId);
    dispatch(
      toggleBookmarkSuccess({ postId })
    );
  };
};
