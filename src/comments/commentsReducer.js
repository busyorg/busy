import * as commentsTypes from './commentsActionTypes';
import * as userProfileTypes from './../user/userProfileActionTypes';

const initialState = {
  lists: [],
  comments: {},
  drafts: {},
};

const commentsData = (state = {}, action) => {
  switch (action.type) {
    case commentsTypes.GET_COMMENTS_SUCCESS:
      return {
        ...state,
        [action.payload.postId]: action.payload.commentsData
      };
    case userProfileTypes.GET_USER_COMMENTS_SUCCESS:
      const commentsList = {};
      // map data based on id
      Object.keys(action.payload.content).forEach((key) => {
        const { id } = action.payload.content[key];
        commentsList[id] = action.payload.content[key];
      });
      return {
        ...state,
        ...commentsList,
      };
    case userProfileTypes.GET_MORE_USER_COMMENTS_SUCCESS:
      const commentsMoreList = {};
      action.payload.result.forEach(comment => {
        commentsMoreList[comment.id] = comment;
      });
      return {
        ...state,
        ...commentsMoreList,
      };
    default:
      return state;
  }
};

const comments = (state = initialState, action) => {
  switch (action.type) {
    case commentsTypes.GET_COMMENTS_SUCCESS:
    case userProfileTypes.GET_USER_COMMENTS_SUCCESS:
    case userProfileTypes.GET_MORE_USER_COMMENTS_SUCCESS:
      return {
        ...state,
        comments: commentsData(state.comments, action)
      };
    default:
      return state;
  }
};

export default comments;
