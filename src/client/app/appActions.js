import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import { createAction } from 'redux-actions';
import { createAsyncActionType } from '../helpers/stateHelpers';

export const GET_TRENDING_TOPICS = '@app/GET_TRENDING_TOPICS';
export const GET_TRENDING_TOPICS_START = '@app/GET_TRENDING_TOPICS_START';
export const GET_TRENDING_TOPICS_SUCCESS = '@app/GET_TRENDING_TOPICS_SUCCESS';
export const GET_TRENDING_TOPICS_ERROR = '@app/GET_TRENDING_TOPICS_ERROR';

export const GET_REWARD_FUND = '@app/GET_REWARD_FUND';
export const GET_REWARD_FUND_START = '@app/GET_REWARD_FUND_START';
export const GET_REWARD_FUND_SUCCESS = '@app/GET_REWARD_FUND_SUCCESS';
export const GET_REWARD_FUND_ERROR = '@app/GET_REWARD_FUND_ERROR';

export const RATE_REQUEST = '@app/RATE_REQUEST';
export const RATE_SUCCESS = '@app/RATE_SUCCESS';

export const CLOSE_BANNER = '@app/CLOSE_BANNER';
export const closeBanner = createAction(CLOSE_BANNER);

export const SET_APP_URL = '@app/SET_APP_URL';
export const setAppUrl = createAction(SET_APP_URL);

export const GET_CRYPTO_PRICE_HISTORY = createAsyncActionType('@app/GET_CRYPTOS_PRICE_HISTORY');

export const getRate = () => (dispatch) => {
  dispatch({ type: RATE_REQUEST });
  fetch('https://api.coinmarketcap.com/v1/ticker/steem/').then(res => res.json()).then((json) => {
    const rate = parseFloat(json[0].price_usd);
    dispatch({
      type: RATE_SUCCESS,
      rate,
    });
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
      promise: steemAPI
        .sendAsync('get_trending_tags', [undefined, 50])
        .then(result => Object.values(result).map(tag => tag.name).filter(tag => tag !== '')),
    },
  });
};

export const getCryptoPriceHistory = symbol => (dispatch) => {
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
      ]).then((response) => {
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
