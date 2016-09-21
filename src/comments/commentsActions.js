import { creatAction } from 'redux-actions';
import * as actionTypes from './commentsActionTypes';

export const getCommentsWithoutAPICall = createAction(actionTypes.GET_COMMENTS);
export const getCommentsSuccess = createAction(actionTypes.GET_COMMENTS_SUCCESS);
export const getCommentsFail = createAction(actionTypes.GET_COMMENTS_FAIL);

export const getComments = (postId) => {
  return (dispatch, getState) => {
    dispatch(getCommentsWithoutAPICall({ postId }));
    // TODO(p0o): get author and permLink from state
    // TODO(p0o): call the api to get the commentsData
    const commentsData = [];

    dispatch(
      getCommentsSuccess({
        postId,
        commentsData
      })
    );
  };
};
