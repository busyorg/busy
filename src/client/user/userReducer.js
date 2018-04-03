import * as actions from './userActions';
import * as appTypes from '../app/appActions';
import people from '../helpers/people';

const initialState = {
  recommendations: [],
  following: {
    list: [],
    pendingFollows: [],
    isFetching: false,
    fetched: false,
  },
  notifications: [],
  latestNotification: {},
  loadingNotifications: false,
  fetchFollowListError: false,
};

// filterRecommendations generates a random list of `count` recommendations
// include users followed by the current user.
const filterRecommendations = (following, count = 5) => {
  const usernames = Object.values(following);
  return people
    .filter(p => !usernames.includes(p))
    .sort(() => 0.5 - Math.random())
    .slice(0, count)
    .map(name => ({ name }));
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.GET_FOLLOWING_START:
      return {
        ...state,
        following: {
          ...state.following,
          list: [],
          isFetching: true,
          fetched: false,
        },
        fetchFollowListError: false,
      };
    case actions.GET_FOLLOWING_ERROR:
      return {
        ...state,
        following: {
          ...state.following,
          list: [],
          isFetching: false,
          fetched: true,
        },
        fetchFollowListError: true,
      };
    case actions.GET_FOLLOWING_SUCCESS:
      return {
        ...state,
        recommendations: filterRecommendations(action.payload),
        following: {
          ...state.following,
          list: action.payload,
          isFetching: false,
          fetched: true,
        },
        fetchFollowListError: false,
      };
    case actions.FOLLOW_USER_START:
    case actions.UNFOLLOW_USER_START:
      return {
        ...state,
        following: {
          ...state.following,
          pendingFollows: [...state.following.pendingFollows, action.meta.username],
        },
      };
    case actions.FOLLOW_USER_SUCCESS:
      return {
        ...state,
        following: {
          ...state.following,
          list: [...state.following.list, action.meta.username],
          pendingFollows: state.following.pendingFollows.filter(
            user => user !== action.meta.username,
          ),
        },
      };
    case actions.UNFOLLOW_USER_SUCCESS:
      return {
        ...state,
        following: {
          ...state.following,
          list: state.following.list.filter(user => user !== action.meta.username),
          pendingFollows: state.following.pendingFollows.filter(
            user => user !== action.meta.username,
          ),
        },
      };

    case actions.FOLLOW_USER_ERROR:
    case actions.UNFOLLOW_USER_ERROR:
      return {
        ...state,
        following: {
          ...state.following,
          pendingFollows: state.following.pendingFollows.filter(
            user => user !== action.meta.username,
          ),
        },
      };

    case actions.UPDATE_RECOMMENDATIONS:
      return {
        ...state,
        recommendations: filterRecommendations(state.following.list),
      };

    case actions.GET_NOTIFICATIONS.START:
      return {
        ...state,
        loadingNotifications: true,
      };

    case actions.GET_NOTIFICATIONS.SUCCESS:
      return {
        ...state,
        notifications: action.payload,
        loadingNotifications: false,
      };

    case actions.GET_NOTIFICATIONS.ERROR:
      return {
        ...state,
        loadingNotifications: false,
      };

    case appTypes.ADD_NEW_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        latestNotification: action.payload,
      };
    default: {
      return state;
    }
  }
}

export const getFollowingList = state => state.following.list;
export const getPendingFollows = state => state.following.pendingFollows;
export const getIsFetchingFollowingList = state => state.following.isFetching;
export const getRecommendations = state => state.recommendations;
export const getFollowingFetched = state => state.following.fetched;
export const getNotifications = state => state.notifications;
export const getIsLoadingNotifications = state => state.loadingNotifications;
export const getFetchFollowListError = state => state.fetchFollowListError;
export const getLatestNotification = state => state.latestNotification;
