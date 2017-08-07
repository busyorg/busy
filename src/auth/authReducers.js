import * as types from './authActions';

const initialState = {
  isAuthenticated: false,
  isFetching: false,
  loaded: false,
  user: {},
  token: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        loaded: false,
        user: {},
      };
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        loaded: true,
        errorMessage: '',
        user: action.user,
        token: action.token,
      };
    case types.LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        loaded: true,
        errorMessage: action.message,
      };
    case types.LOGOUT_START:
      return {
        ...state,
        isFetching: true,
        loaded: false,
      };
    case types.LOGOUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        isFetching: false,
        loaded: true,
        user: {},
        token: '',
      };
    default:
      return state;
  }
};
