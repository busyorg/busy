import { createAction } from 'redux-actions';
import { toggleBookmark as toggleBookmarkHelper } from '../helpers/localStorageHelpers';
import * as actionTypes from './bookmarksActionTypes';

export const toggleBookmarkRequest = createAction(actionTypes.TOGGLE_BOOKMARK);
export const toggleBookmarkSuccess = createAction(actionTypes.TOGGLE_BOOKMARK_SUCCESS);

export const toggleBookmark = ({ postId }) => {
  return (dispatch) => {
    dispatch(toggleBookmarkRequest({ postId }));
    toggleBookmarkHelper(postId);
    dispatch(
      toggleBookmarkSuccess({ postId })
    );
  };
};
