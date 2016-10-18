import { createAction } from 'redux-actions';

export const GET_COMMENTS = 'GET_COMMENTS';
export const GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS';
export const GET_COMMENTS_FAIL = 'GET_COMMENTS_FAIL';

export const getCommentsWithoutAPICall = createAction(GET_COMMENTS);
export const getCommentsSuccess = createAction(GET_COMMENTS_SUCCESS);
export const getCommentsFail = createAction(GET_COMMENTS_FAIL);

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
