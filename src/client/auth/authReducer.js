import * as types from './authActions';

const initialState = {
  isAuthenticated: false,
  isFetching: false,
  isReloading: false,
  loaded: false,
  user: {},
  userSCMetaData: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_START:
      if (action.meta && action.meta.refresh) return state;
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        loaded: false,
        user: {},
      };
    case types.LOGIN_SUCCESS:
      if (action.meta && action.meta.refresh) return state;
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        loaded: true,
        user: action.payload.account || state.user,
        userSCMetaData: action.payload.user_metadata,
      };
    case types.LOGIN_ERROR:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        loaded: true,
      };
    case types.RELOAD_START:
      return {
        ...state,
        isReloading: true,
      };
    case types.RELOAD_SUCCESS:
      return {
        ...state,
        isReloading: false,
        user: action.payload.account || state.user,
      };
    case types.RELOAD_ERROR:
      return {
        ...state,
        isReloading: false,
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
      };
    case types.UPDATE_SC2_USER_METADATA.SUCCESS:
      return {
        ...state,
        userSCMetaData: action.payload.user_metadata,
      };
    default:
      return state;
  }
};

export const getIsAuthenticated = state => state.isAuthenticated;
export const getIsAuthFetching = state => state.isFetching;
export const getIsLoaded = state => state.loaded;
export const getIsReloading = state => state.isReloading;
export const getAuthenticatedUser = state => state.user;
export const getAuthenticatedUserName = state => state.user.name;
export const getAuthenticatedUserSCMetaData = state => state.userSCMetaData;
