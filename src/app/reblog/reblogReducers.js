import * as reblogActions from './reblogActions';

const reblogReducer = (state = [], action) => {
  switch (action.type) {
    case reblogActions.GET_REBLOGGED_LIST:
      return action.payload;
    default:
      return state;
  }
};

export default reblogReducer;
