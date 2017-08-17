import * as appTypes from '../actions';
import * as postActions from '../post/postActions';

const initialState = {
  isFetching: false,
  isLoaded: false,
  errorMessage: '',
  layout: 'card',
  locale: 'en',
  rate: 0,
  lastPostId: undefined,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case appTypes.FEED_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false,
      });
    case appTypes.FEED_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isLoaded: true,
      });
    case appTypes.FEED_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isLoaded: true,
      });
    case appTypes.CONTENT_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false,
      });
    case appTypes.CONTENT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isLoaded: true,
      });
    case appTypes.ACCOUNT_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false,
      });
    case appTypes.ACCOUNT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isLoaded: true,
      });
    case appTypes.CONFIG_SUCCESS:
      return Object.assign({}, state, {
        config: action.config,
      });

    case appTypes.GET_LAYOUT:
      return {
        ...state,
        layout: action.payload.layout,
      };

    case appTypes.SET_LAYOUT:
      return {
        ...state,
        layout: action.payload.layout,
      };

    case appTypes.GET_LOCALE:
      return {
        ...state,
        locale: action.payload.locale,
      };

    case appTypes.SET_LOCALE:
      return {
        ...state,
        locale: action.payload.locale,
      };

    case appTypes.RATE_SUCCESS:
      return {
        ...state,
        rate: action.rate,
      };
    case appTypes.OPEN_POST_MODAL:
      return {
        ...state,
        isPostModalOpen: true,
        lastPostId: action.payload,
      };
    case appTypes.CLOSE_POST_MODAL:
      return {
        ...state,
        isPostModalOpen: false,
        lastPostId: null,
      };
    case postActions.GET_CONTENT_START:
      return {
        ...state,
        isFetching: true,
        isLoaded: false,
      };
    case postActions.GET_CONTENT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isLoaded: true,
        lastPostId: action.payload ? action.payload.id : null,
      };
    default:
      return state;
  }
};

export const getLayout = state => state.layout;
export const getLocale = state => state.locale;
export const getRate = state => state.rate;
export const getLastPostId = state => state.lastPostId;
