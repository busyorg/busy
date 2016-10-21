import * as commentsTypes from './commentsActions';
import * as userProfileTypes from './../user/userProfileActions';

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

const commentsList = (state = {}, action) => {
  switch (action.type) {
    case commentsTypes.GET_COMMENTS_START:
      return {
        ...state,
        isFetching: true,
        list: [],
        show: 1,
        hasMore: true,
      };
    case commentsTypes.GET_COMMENTS_SUCCESS:
      return {
        ...state,
        list: action.payload.list,
        isFetching: false,
      };
    case commentsTypes.SHOW_MORE_COMMENTS:
      const newShowValue = state.show === 1 ? 10 : state.show + 10;
      return {
        ...state,
        show: newShowValue,
        hasMore: newShowValue < state.list.length,
      };
    case commentsTypes.SEND_COMMENT_START:
      return {
        ...state,
        show: state.show + 1,
        list: [
          {
            id: action.meta.optimisticId,
            children: {},
          },
          ...state.list,
        ],
      };
    default:
      return state;
  }
};

const commentsLists = (state = {}, action) => {
  switch (action.type) {
    case commentsTypes.GET_COMMENTS_START:
    case commentsTypes.GET_COMMENTS_SUCCESS:
    case commentsTypes.SHOW_MORE_COMMENTS:
      return {
        ...state,
        [action.meta.id]: commentsList(state[action.meta.id], action),
      };
    case commentsTypes.SEND_COMMENT_START:
      return {
        ...state,
        [action.meta.parentId]: commentsList(state[action.meta.parentId], action),
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
    case userProfileTypes.GET_USER_COMMENTS_SUCCESS:
      return {
        ...state,
        ...mapCommentsBasedOnId(action.payload.content),
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
    case commentsTypes.SEND_COMMENT_START:
      return {
        ...state,
        [action.meta.optimisticId]: action.payload,
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
    case commentsTypes.GET_COMMENTS_START:
    case commentsTypes.GET_COMMENTS_SUCCESS:
    case userProfileTypes.GET_USER_COMMENTS_SUCCESS:
    case userProfileTypes.GET_MORE_USER_COMMENTS_SUCCESS:
    case commentsTypes.SHOW_MORE_COMMENTS:
    case commentsTypes.SEND_COMMENT_START:
      return {
        ...state,
        comments: commentsData(state.comments, action),
        lists: commentsLists(state.lists, action),
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
