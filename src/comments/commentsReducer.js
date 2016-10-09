import * as commentsTypes from './commentsActionTypes';
import * as userProfileTypes from './../user/userProfileActionTypes';

const comments = (state = {}, action) => {
  switch (action.type) {
    case commentsTypes.GET_COMMENTS_SUCCESS:
      return {
        ...state,
        [action.payload.postId]: action.payload.commentsData
      };
    case userProfileTypes.GET_USER_COMMENTS_SUCCESS:
      return {
        ...state,
        ...action.payload.content,
      };
    case userProfileTypes.GET_MORE_USER_COMMENTS_SUCCESS:
      const commentsList = {};
      action.payload.result.forEach(comment => {
        commentsList[`${comment.author}/${comment.permlink}`] = comment;
      });
      return {
        ...state,
        ...commentsList,
      };
    default:
      return state;
  }
};

export default comments;
