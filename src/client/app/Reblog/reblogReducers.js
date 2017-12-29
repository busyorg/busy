import * as reblogActions from './reblogActions';

const initialState = {
  rebloggedList: [],
  pendingReblogs: [],
};

const reblogReducer = (state = initialState, action) => {
  switch (action.type) {
    case reblogActions.GET_REBLOGGED_LIST:
      return {
        ...state,
        rebloggedList: action.payload,
      };
    case reblogActions.REBLOG_POST_START:
      return {
        ...state,
        pendingReblogs: [...state.pendingReblogs, action.meta.postId],
      };
    case reblogActions.REBLOG_POST_SUCCESS:
    case reblogActions.REBLOG_POST_ERROR:
      return {
        ...state,
        pendingReblogs: state.pendingReblogs.filter(id => id !== action.meta.postId),
      };
    default:
      return state;
  }
};

export default reblogReducer;

export const getRebloggedList = state => state.rebloggedList;
export const getPendingReblogs = state => state.pendingReblogs;
