import * as appTypes from './appActions';
import * as authActions from '../auth/authActions';
import * as postActions from '../post/postActions';

const initialState = {
  isFetching: false,
  isLoaded: false,
  rate: 0,
  trendingTopicsLoading: false,
  trendingTopics: [],
  rewardFund: {},
  bannerClosed: false,
  appUrl: 'https://busy.org',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case authActions.LOGIN_SUCCESS:
      if (action.meta && action.meta.refresh) return state;
      return {
        ...state,
        locale:
          (action.payload.user_metadata && action.payload.user_metadata.locale) ||
          initialState.locale,
      };
    case appTypes.RATE_SUCCESS:
      return {
        ...state,
        rate: action.rate,
      };
    case postActions.GET_CONTENT.START:
      return {
        ...state,
        isFetching: true,
        isLoaded: false,
      };
    case postActions.GET_CONTENT.SUCCESS:
    case postActions.GET_CONTENT.ERROR:
      return {
        ...state,
        isFetching: false,
        isLoaded: true,
      };
    case appTypes.GET_REWARD_FUND_SUCCESS:
      return {
        ...state,
        rewardFund: {
          ...state.rewardFund,
          ...action.payload,
        },
      };
    case appTypes.GET_TRENDING_TOPICS_START:
      return {
        ...state,
        trendingTopicsLoading: true,
      };
    case appTypes.GET_TRENDING_TOPICS_SUCCESS:
      return {
        ...state,
        trendingTopicsLoading: false,
        trendingTopics: action.payload,
      };
    case appTypes.GET_TRENDING_TOPICS_ERROR:
      return {
        ...state,
        trendingTopicsLoading: false,
        trendingTopics: [],
      };
    case appTypes.CLOSE_BANNER:
      return {
        ...state,
        bannerClosed: true,
      };
    case appTypes.SET_APP_URL:
      return {
        ...state,
        appUrl: action.payload,
      };
    default:
      return state;
  }
};

export const getRate = state => state.rate;
export const getIsTrendingTopicsLoading = state => state.trendingTopicsLoading;
export const getRewardFund = state => state.rewardFund;
export const getTrendingTopics = state => state.trendingTopics;
export const getIsFetching = state => state.isFetching;
export const getIsBannerClosed = state => state.bannerClosed;
export const getAppUrl = state => state.appUrl;
