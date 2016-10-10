import * as actionTypes from './authActionTypes';

const initialState = {
  isAuthenticated: false,
  user: {},

  following: [],
  followingIsLoading: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: {}
      });
    case actionTypes.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        errorMessage: '',
        user: action.user
      });
    case actionTypes.LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.message
      });
    case actionTypes.LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false
      });

    case actionTypes.GET_FOLLOWING_START:
      if (!state.user || action.meta.follower !== state.user.name) {
        return state;
      }
      return Object.assign({}, state, {
        followingIsLoading: true,
      });

    case actionTypes.GET_FOLLOWING_ERROR:
      return Object.assign({}, state, {
        followingIsLoading: false,
      });

    case actionTypes.GET_FOLLOWING_SUCCESS:
      if (!state.user || action.meta.follower !== state.user.name) {
        return state;
      }

      return Object.assign({}, state, {
        following: action.payload,
        followingIsLoading: false,
      });

    default:
      return state;
  }
};
