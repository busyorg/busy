import * as commentsTypes from './commentsActionTypes';

const comments = (state = {}, action) => {
  switch(action.type) {
    case commentsTypes.GET_COMMENTS_SUCCESS:
      return {
        ...state,
        [action.payload.postId]: action.payload.commentsData
      };
    default:
      return state;
  }
};

export default comments;
