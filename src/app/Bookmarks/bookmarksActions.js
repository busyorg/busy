import { createAction } from 'redux-actions';
import {
  getBookmarks as getBookmarksHelper,
  toggleBookmark as toggleBookmarkHelper,
} from '../../helpers/localStorageHelpers';

export const GET_BOOKMARKS = '@Bookmarks/GET_BOOKMARKS';
export const GET_BOOKMARKS_SUCCESS = '@Bookmarks/GET_BOOKMARKS_SUCCESS';
export const GET_BOOKMARKS_FAIL = '@Bookmarks/GET_BOOKMARKS_FAIL';

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

export const TOGGLE_BOOKMARK = '@Bookmarks/TOGGLE_BOOKMARK';
export const TOGGLE_BOOKMARK_SUCCESS = '@Bookmarks/TOGGLE_BOOKMARK_SUCCESS';
export const TOGGLE_BOOKMARK_FAIL = '@Bookmarks/TOGGLE_BOOKMARK_FAIL';

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
