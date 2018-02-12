import _ from 'lodash';
import { LOCATION_CHANGE } from 'react-router-redux/reducer';
import * as appTypes from './appActions';
import * as authActions from '../auth/authActions';
import * as postActions from '../post/postActions';
import { getCryptoPriceIncreaseDetails } from '../helpers/cryptosHelper';

const initialState = {
  isFetching: false,
  isLoaded: false,
  rate: 0,
  trendingTopicsLoading: false,
  trendingTopics: [],
  rewardFund: {},
  bannerClosed: false,
  appUrl: 'https://busy.org',
  usedLocale: 'en',
  cryptosPriceHistory: {},
  showPostModal: false,
  currentShownPost: {},
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
    case appTypes.RATE_REQUEST.SUCCESS:
      return {
        ...state,
        rate: action.payload,
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
    case appTypes.SET_USED_LOCALE:
      return {
        ...state,
        usedLocale: action.payload,
      };
    case appTypes.REFRESH_CRYPTO_PRICE_HISTORY:
      return {
        ...state,
        cryptosPriceHistory: {
          ...state.cryptosPriceHistory,
          [action.payload]: null,
        },
      };
    case appTypes.GET_CRYPTO_PRICE_HISTORY.SUCCESS: {
      const { symbol, usdPriceHistory, btcPriceHistory } = action.payload;
      const usdPriceHistoryByClose = _.map(usdPriceHistory.Data, data => data.close);
      const btcPriceHistoryByClose = _.map(btcPriceHistory.Data, data => data.close);
      const priceDetails = getCryptoPriceIncreaseDetails(
        usdPriceHistoryByClose,
        btcPriceHistoryByClose,
      );
      const btcAPIError = btcPriceHistory.Response === 'Error';
      const usdAPIError = usdPriceHistory.Response === 'Error';

      return {
        ...state,
        cryptosPriceHistory: {
          ...state.cryptosPriceHistory,
          [symbol]: {
            usdPriceHistory: usdPriceHistoryByClose,
            priceDetails,
            btcAPIError,
            usdAPIError,
          },
        },
      };
    }
    case appTypes.SHOW_POST_MODAL:
      return {
        ...state,
        showPostModal: true,
        currentShownPost: action.payload,
      };
    case LOCATION_CHANGE:
    case appTypes.HIDE_POST_MODAL:
      return {
        ...state,
        showPostModal: false,
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
export const getUsedLocale = state => state.usedLocale;
export const getCryptosPriceHistory = state => state.cryptosPriceHistory;
export const getShowPostModal = state => state.showPostModal;
export const getCurrentShownPost = state => state.currentShownPost;
