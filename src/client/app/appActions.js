import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import { createAction } from 'redux-actions';
import { createAsyncActionType } from '../helpers/stateHelpers';
import { BUSY_API_TYPES } from '../../common/constants/notifications';

export const GET_TRENDING_TOPICS = '@app/GET_TRENDING_TOPICS';
export const GET_TRENDING_TOPICS_START = '@app/GET_TRENDING_TOPICS_START';
export const GET_TRENDING_TOPICS_SUCCESS = '@app/GET_TRENDING_TOPICS_SUCCESS';
export const GET_TRENDING_TOPICS_ERROR = '@app/GET_TRENDING_TOPICS_ERROR';

export const GET_REWARD_FUND = '@app/GET_REWARD_FUND';
export const GET_REWARD_FUND_START = '@app/GET_REWARD_FUND_START';
export const GET_REWARD_FUND_SUCCESS = '@app/GET_REWARD_FUND_SUCCESS';
export const GET_REWARD_FUND_ERROR = '@app/GET_REWARD_FUND_ERROR';

export const RATE_REQUEST = createAsyncActionType('@app/RATE_REQUEST');

export const CLOSE_BANNER = '@app/CLOSE_BANNER';
export const closeBanner = createAction(CLOSE_BANNER);

export const SET_APP_URL = '@app/SET_APP_URL';
export const setAppUrl = createAction(SET_APP_URL);

export const SET_USED_LOCALE = '@app/SET_USED_LOCALE';
export const setUsedLocale = createAction(SET_USED_LOCALE);

export const GET_CRYPTO_PRICE_HISTORY = createAsyncActionType('@app/GET_CRYPTOS_PRICE_HISTORY');
export const REFRESH_CRYPTO_PRICE_HISTORY = '@app/REFRESH_CRYPTO_PRICE_HISTORY';
export const refreshCryptoPriceHistory = createAction(REFRESH_CRYPTO_PRICE_HISTORY);

export const getRate = () => (dispatch, getState, { steemAPI }) => {
  dispatch({
    type: RATE_REQUEST.ACTION,
    payload: {
      promise: steemAPI
        .sendAsync('get_current_median_history_price', [])
        .then(resp => parseFloat(resp.base)),
    },
  });
};

export const getRewardFund = () => (dispatch, getSelection, { steemAPI }) =>
  dispatch({
    type: GET_REWARD_FUND,
    payload: { promise: steemAPI.sendAsync('get_reward_fund', ['post']) },
  });

export const getTrendingTopics = () => (dispatch, getState, { steemAPI }) => {
  dispatch({
    type: GET_TRENDING_TOPICS,
    payload: {
      promise: steemAPI.sendAsync('get_trending_tags', [undefined, 50]).then(result =>
        Object.values(result)
          .map(tag => tag.name)
          .filter(tag => tag !== ''),
      ),
    },
  });
};

export const getCryptoPriceHistory = (symbol, refresh = false) => dispatch => {
  if (refresh) {
    dispatch(refreshCryptoPriceHistory(symbol));
  }
  dispatch({
    type: GET_CRYPTO_PRICE_HISTORY.ACTION,
    payload: {
      promise: Promise.all([
        fetch(
          `https://min-api.cryptocompare.com/data/histoday?fsym=${symbol}&tsym=USD&limit=6`,
        ).then(res => res.json()),
        fetch(
          `https://min-api.cryptocompare.com/data/histoday?fsym=${symbol}&tsym=BTC&limit=6`,
        ).then(res => res.json()),
      ]).then(response => {
        const usdPriceHistory = _.get(response, 0, {});
        const btcPriceHistory = _.get(response, 1, {});
        return {
          usdPriceHistory,
          btcPriceHistory,
          symbol,
        };
      }),
    },
  });
};

export const ADD_NEW_NOTIFICATION = '@user/ADD_NEW_NOTIFICATION';
export const addNewNotification = createAction(ADD_NEW_NOTIFICATION);

export const busyAPIHandler = (response, message) => dispatch => {
  const type = _.get(message, 'type');

  if (_.isEqual(type, BUSY_API_TYPES.notification)) {
    const notification = _.get(message, BUSY_API_TYPES.notification);
    dispatch(addNewNotification(notification));
  }
};

export const SHOW_POST_MODAL = '@app/SHOW_POST_MODAL';
export const HIDE_POST_MODAL = '@app/HIDE_POST_MODAL';

export const showPostModal = createAction(SHOW_POST_MODAL);
export const hidePostModal = createAction(HIDE_POST_MODAL);
