import * as appTypes from '../actions';
import * as responsive from '../helpers/responsive';
import * as postActions from '../post/postActions';
import * as commentTypes from '../comments/commentsActions';

const initialState = {
  isFetching: false,
  isLoaded: false,
  errorMessage: '',
  sidebarIsVisible: true,
  locale: 'en',
  isPostModalOpen: false,
  lastPostId: null,
};

// TODO(p0o): some actionsTypes in this reducer are not defined anywhere, need to figure it out later

export default (state = initialState, action) => {
  switch (action.type) {
    case appTypes.FEED_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false
      });
    case appTypes.FEED_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isLoaded: true
      });
    case appTypes.FEED_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isLoaded: true
      });
    case appTypes.CONTENT_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false
      });
    case appTypes.CONTENT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isLoaded: true
      });
    case appTypes.ACCOUNT_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false
      });
    case appTypes.ACCOUNT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isLoaded: true
      });
    case appTypes.CONFIG_SUCCESS:
      return Object.assign({}, state, {
        config: action.config
      });

    case responsive.MEDIA_CHANGED: {
      if (action.payload.isSmall == null) return state;
      return Object.assign({}, state, {
        sidebarIsVisible: !action.payload.isSmall,
      });
    }

    case appTypes.SHOW_SIDEBAR:
      return Object.assign({}, state, {
        sidebarIsVisible: true
      });

    case appTypes.HIDE_SIDEBAR:
    case commentTypes.OPEN_COMMENTING_DRAFT:
      return {
        ...state,
        sidebarIsVisible: false,
      };

    case appTypes.SET_LOCALE:
      return {
        ...state,
        locale: action.payload.locale,
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
    case postActions.GET_CONTENT_SUCCESS:
      return {
        ...state,
        lastPostId: action.payload ? action.payload.id : null,
      };
    default:
      return state;
  }
};
