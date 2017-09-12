import Promise from 'bluebird';
import SteemConnect from 'sc2-sdk';
import fetch from 'isomorphic-fetch';

export const CONFIG_REQUEST = '@app/CONFIG_REQUEST';
export const CONFIG_SUCCESS = '@app/CONFIG_SUCCESS';
export const CONFIG_FAILURE = '@app/CONFIG_FAILURE';

export const FEED_REQUEST = '@app/FEED_REQUEST';
export const FEED_SUCCESS = '@app/FEED_SUCCESS';
export const FEED_FAILURE = '@app/FEED_FAILURE';
export const CONTENT_REQUEST = '@app/CONTENT_REQUEST';
export const CONTENT_SUCCESS = '@app/CONTENT_SUCCESS';
export const ACCOUNT_REQUEST = '@app/ACCOUNT_REQUEST';
export const ACCOUNT_SUCCESS = '@app/ACCOUNT_SUCCESS';

export const GET_LOCALE = '@app/GET_LOCALE';

export const SET_LOCALE = '@app/SET_LOCALE';
export const SET_LOCALE_START = '@app/SET_LOCALE_START';
export const SET_LOCALE_SUCCESS = '@app/SET_LOCALE_SUCCESS';
export const SET_LOCALE_ERROR = '@app/SET_LOCALE_ERROR';

const updateUserMetadata = Promise.promisify(SteemConnect.updateUserMetadata);

export const getConfig = () =>
  (dispatch, getState, { steemAPI }) => {
    dispatch({ type: CONFIG_REQUEST });
    steemAPI.getConfig((err, config) => {
      dispatch({
        type: CONFIG_SUCCESS,
        config,
      });
    });
  };

export const setLocale = locale =>
  (dispatch) => {
    dispatch({
      type: SET_LOCALE,
      payload: {
        promise: updateUserMetadata({ locale })
          .then(resp => resp.user_metadata.locale),
      },
    });
  };

export const RATE_REQUEST = '@app/RATE_REQUEST';
export const RATE_SUCCESS = '@app/RATE_SUCCESS';

export const getRate = () =>
  (dispatch) => {
    dispatch({ type: RATE_REQUEST });
    fetch('https://api.cryptonator.com/api/ticker/steem-usd')
      .then(res => res.json())
      .then((json) => {
        const rate = json.ticker.price;
        dispatch({
          type: RATE_SUCCESS,
          rate,
        });
      });
  };

export const GET_TRENDING_TOPICS = '@app/GET_TRENDING_TOPICS';
export const GET_TRENDING_TOPICS_START = '@app/GET_TRENDING_TOPICS_START';
export const GET_TRENDING_TOPICS_SUCCESS = '@app/GET_TRENDING_TOPICS_SUCCESS';
export const GET_TRENDING_TOPICS_ERROR = '@app/GET_TRENDING_TOPICS_ERROR';

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
