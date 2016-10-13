import Promise from 'bluebird';
import { createAction } from 'redux-actions';
import SteemConnect from 'steemconnect';
import * as actionTypes from './commentsActionTypes';

SteemConnect.comment = Promise.promisify(SteemConnect.comment, { context: SteemConnect });

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

export const sendComment = (parentAuthor, parentPermlink, author, permlink, commentBody) => {
  return (dispatch, getState) => {
    const optimisticData = {
      author,
      permlink,
      commentBody
    };

    dispatch({
      type: actionTypes.SEND_COMMENT,
      payload: {
        promise: SteemConnect.comment(
          parentAuthor,
          parentPermlink,
          author,
          permlink,
          '',
          commentBody,
          {}
        ),
        data: optimisticData,
      }
    });
  };
};
