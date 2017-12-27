import * as commentsTypes from './commentsActions';

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

const mapCommentsBasedOnId = (data, action) => {
  const commentsList = {};
  Object.keys(data).forEach(key => {
    const comment = data[key];
    if (
      action.meta.reload &&
      comment.author === action.meta.focusedComment.author &&
      comment.permlink === action.meta.focusedComment.permlink
    ) {
      comment.focus = true;
    }
    commentsList[data[key].id] = comment;
  });
  return commentsList;
};

const commentsData = (state = {}, action) => {
  switch (action.type) {
    case commentsTypes.GET_COMMENTS_SUCCESS:
      return {
        ...state,
        ...mapCommentsBasedOnId(action.payload.content, action),
      };
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
      return !action.meta.reload && true;
    case commentsTypes.GET_COMMENTS_SUCCESS:
    case commentsTypes.GET_COMMENTS_ERROR:
      return false;
    default:
      return state;
  }
};

const comments = (state = initialState, action) => {
  switch (action.type) {
    case commentsTypes.GET_COMMENTS_START:
    case commentsTypes.GET_COMMENTS_SUCCESS:
    case commentsTypes.GET_COMMENTS_ERROR:
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
