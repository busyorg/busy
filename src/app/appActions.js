import Promise from 'bluebird';
import fetch from 'isomorphic-fetch';

export const GET_TRENDING_TOPICS = '@app/GET_TRENDING_TOPICS';
export const GET_TRENDING_TOPICS_START = '@app/GET_TRENDING_TOPICS_START';
export const GET_TRENDING_TOPICS_SUCCESS = '@app/GET_TRENDING_TOPICS_SUCCESS';
export const GET_TRENDING_TOPICS_ERROR = '@app/GET_TRENDING_TOPICS_ERROR';

export const RATE_REQUEST = '@app/RATE_REQUEST';
export const RATE_SUCCESS = '@app/RATE_SUCCESS';

export const getRate = () => (dispatch) => {
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

export const getTrendingTopics = () => (dispatch, getState, { steemAPI }) => {
  const getTrendingTagsAsync = Promise.promisify(steemAPI.getTrendingTags, { context: steemAPI });
  dispatch({
    type: GET_TRENDING_TOPICS,
    payload: {
      promise: getTrendingTagsAsync(undefined, 50).then(result =>
        Object.values(result)
          .map(tag => tag.name)
          .filter(tag => tag !== ''),
      ),
    },
  });
};
