import Promise from 'bluebird';
import fetch from 'isomorphic-fetch';
import { setLocaleMetadata } from '../helpers/metadata';

export const GET_LOCALE = '@app/GET_LOCALE';

export const SET_LOCALE = '@app/SET_LOCALE';
export const SET_LOCALE_START = '@app/SET_LOCALE_START';
export const SET_LOCALE_SUCCESS = '@app/SET_LOCALE_SUCCESS';
export const SET_LOCALE_ERROR = '@app/SET_LOCALE_ERROR';

export const GET_TRENDING_TOPICS = '@app/GET_TRENDING_TOPICS';
export const GET_TRENDING_TOPICS_START = '@app/GET_TRENDING_TOPICS_START';
export const GET_TRENDING_TOPICS_SUCCESS = '@app/GET_TRENDING_TOPICS_SUCCESS';
export const GET_TRENDING_TOPICS_ERROR = '@app/GET_TRENDING_TOPICS_ERROR';

export const RATE_REQUEST = '@app/RATE_REQUEST';
export const RATE_SUCCESS = '@app/RATE_SUCCESS';

export const setLocale = locale =>
  (dispatch) => {
    dispatch({
      type: SET_LOCALE,
      payload: {
        promise: setLocaleMetadata(locale),
      },
    });
  };

export const getRate = () =>
  (dispatch) => {
    dispatch({ type: RATE_REQUEST });
    fetch('https://api.coinmarketcap.com/v1/ticker/steem/')
      .then(res => res.json())
      .then((json) => {
        const rate = json[0].price_usd;
        dispatch({
          type: RATE_SUCCESS,
          rate,
        });
      });
  };

export const getTrendingTopics = () => (dispatch, getState, { steemAPI }) => {
  const getTrendingTagsAsync = Promise.promisify(steemAPI.getTrendingTags, { context: steemAPI });
  dispatch({
    type: GET_TRENDING_TOPICS,
    payload: {
      promise: getTrendingTagsAsync(undefined, 50)
        .then(result => Object.values(result).map(tag => tag.name).filter(tag => tag !== '')),
    },
  });
};
