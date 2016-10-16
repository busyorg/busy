import * as commentsTypes from './commentsActionTypes';
import * as userProfileTypes from './../user/userProfileActionTypes';

const initialState = {
  lists: {},
  comments: {},
  commentingDraft: {},
  isCommenting: false,
  currentDraftId: null,
};

const initialCommentingDraftItem = {
  parentAuthor: null,
  parentPermlink: null,
  category: null,
  body: null,
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

const commentingDraftItem = (state = initialCommentingDraftItem, action) => {
  switch (action.type) {
    case commentsTypes.OPEN_COMMENTING_DRAFT:
      const { parentAuthor, parentPermlink, category } = action.payload;
      return {
        ...state,
        parentAuthor,
        parentPermlink,
        category,
      };
    case commentsTypes.UPDATE_COMMENTING_DRAFT:
      return {
        ...state,
        body: action.payload.body,
      };
    default:
      return state;
  }
};

const commentingDraft = (state = {}, action) => {
  switch (action.type) {
    case commentsTypes.OPEN_COMMENTING_DRAFT:
    case commentsTypes.UPDATE_COMMENTING_DRAFT:
      const { id } = action.payload;
      return {
        ...state,
        [id]: commentingDraftItem(state[id], action),
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
    case commentsTypes.OPEN_COMMENTING_DRAFT:
    case commentsTypes.UPDATE_COMMENTING_DRAFT:
      return {
        ...state,
        commentingDraft: commentingDraft(state.commentingDraft, action),
        isCommenting: true,
        currentDraftId: action.payload.id,
      };
    case commentsTypes.CLOSE_COMMENTING_DRAFT:
      return {
        ...state,
        commentingDraft: commentingDraft(state.commentingDraft, action),
        isCommenting: false,
        currentDraftId: null,
      };
    default:
      return state;
  }
};

export default comments;
