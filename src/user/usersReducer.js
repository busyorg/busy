import * as actions from './usersActions';

const initialState = {};

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case `${actions.GET_FOLLOWING_COUNT}_START`:
      return {
        ...state,
        [action.meta.username]: {
          ...state[action.meta.username],
          isFetching: true,
        }
      };
    case `${actions.GET_FOLLOWING_COUNT}_SUCCESS`: {
      return {
        ...state,
        [action.meta.username]: {
          ...state[action.meta.username],
          isFetching: false,
          ...action.payload
        }
      };
    }
    default: {
      return state;
    }
  }
}
