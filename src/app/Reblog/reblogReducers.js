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
    case reblogActions.START_REBLOGGING:
      return {
        ...state,
        pendingReblogs: [
          ...state.pendingReblogs,
          action.payload,
        ],
      };
    case reblogActions.FINISH_REBLOGGING:
      return {
        ...state,
        pendingReblogs: state.pendingReblogs.filter(id => id !== action.payload),
      };
    default:
      return state;
  }
};

export default reblogReducer;
