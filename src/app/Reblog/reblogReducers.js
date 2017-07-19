import omit from 'lodash/omit';
import * as reblogActions from './reblogActions';

// TODO: This should be refactored to more standard redux reducer

const initialState = {
  rebloggedList: [],
  pendingReblogs: {},
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
        pendingReblogs: {
          ...state.pendingReblogs,
          [action.payload]: true,
        },
      };
    case reblogActions.FINISH_REBLOGGING:
      return {
        ...state,
        pendingReblogs: omit(state.pendingReblogs, action.payload),
      };
    default:
      return state;
  }
};

export default reblogReducer;
