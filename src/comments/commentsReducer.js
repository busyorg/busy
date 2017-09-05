import * as commentsTypes from './commentsActions';
import * as userTypes from '../user/userActions';

const initialState = {
  childrenById: {},
  comments: {},
  pendingVotes: [],
  isFetching: false,
};

const childrenById = (state = {}, action) => {
  switch (action.type) {
    case commentsTypes.GET_COMMENTS_SUCCESS:
      return {
        ...state,
        ...action.payload.commentsChildrenList,
      };
    default:
      return state;
  }
};

const mapCommentsBasedOnId = (data) => {
  const commentsList = {};
  Object.keys(data).forEach((key) => {
    commentsList[data[key].id] = data[key];
  });
  return commentsList;
};

const commentsData = (state = {}, action) => {
  switch (action.type) {
    case commentsTypes.GET_COMMENTS_SUCCESS:
      return {
        ...state,
        ...mapCommentsBasedOnId(action.payload.content),
      };
    case userTypes.GET_USER_COMMENTS_SUCCESS:
    case userTypes.GET_MORE_USER_COMMENTS_SUCCESS: {
      const commentsMoreList = {};
      action.payload.forEach((comment) => {
        commentsMoreList[comment.id] = comment;
      });
      return {
        ...state,
        ...commentsMoreList,
      };
    }
    case commentsTypes.RELOAD_EXISTING_COMMENT:
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    default:
      return state;
  }
};

const isFetching = (state = initialState.isFetching, action) => {
  switch (action.type) {
    case commentsTypes.GET_COMMENTS_START:
    case commentsTypes.SEND_COMMENT_START:
      return false;
    case commentsTypes.GET_COMMENTS_SUCCESS:
    case commentsTypes.GET_COMMENTS_ERROR:
    case commentsTypes.SEND_COMMENT_SUCCESS:
    case commentsTypes.SEND_COMMENT_ERROR:
      return false;
    default:
      return state;
  }
};

const comments = (state = initialState, action) => {
  switch (action.type) {
    case commentsTypes.GET_COMMENTS_START:
    case commentsTypes.GET_COMMENTS_SUCCESS:
    case userTypes.GET_USER_COMMENTS_SUCCESS:
    case userTypes.GET_MORE_USER_COMMENTS_SUCCESS:
    case commentsTypes.SHOW_MORE_COMMENTS:
    case commentsTypes.SEND_COMMENT_START:
    case commentsTypes.SEND_COMMENT_SUCCESS:
    case commentsTypes.SEND_COMMENT_ERROR:
      return {
        ...state,
        comments: commentsData(state.comments, action),
        childrenById: childrenById(state.childrenById, action),
        isFetching: isFetching(state.isFetching, action),
      };
    case commentsTypes.LIKE_COMMENT_START:
      return {
        ...state,
        pendingVotes: [
          ...state.pendingVotes,
          {
            id: action.meta.commentId,
            percent: action.meta.weight,
            vote: action.meta.vote,
          },
        ],
      };
    case commentsTypes.LIKE_COMMENT_ERROR:
      return {
        ...state,
        pendingVotes: state.pendingVotes.filter(like => like.id !== action.meta.commentId),
      };
    case commentsTypes.RELOAD_EXISTING_COMMENT:
      return {
        ...state,
        comments: commentsData(state.comments, action),
        pendingVotes: state.pendingVotes.filter(like => like.id !== action.meta.commentId),
      };
    default:
      return state;
  }
};

export default comments;

export const getComments = state => state;
export const getCommentsList = state => state.comments;
export const getCommentsPendingVotes = state => state.pendingVotes;
