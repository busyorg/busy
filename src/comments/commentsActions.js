import { creatAction } from 'redux-actions';
import * as actionTypes from './commentsActionTypes';

export const getCommentsWithoutAPICall = createAction(actionTypes.GET_COMMENTS);
export const getCommentsSuccess = createAction(actionTypes.GET_COMMENTS_SUCCESS);
export const getCommentsFail = createAction(actionTypes.GET_COMMENTS_FAIL);

