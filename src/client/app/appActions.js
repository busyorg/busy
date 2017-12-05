import Promise from 'bluebird';
import fetch from 'isomorphic-fetch';
import { createAction } from 'redux-actions';

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

export const getRate = () => (dispatch) => {
  dispatch({ type: RATE_REQUEST });
  fetch('https://api.coinmarketcap.com/v1/ticker/steem/')
    .then(res => res.json())
    .then((json) => {
      const rate = parseFloat(json[0].price_usd);
      dispatch({
        type: RATE_SUCCESS,
        rate,
      });
    });
};

export const getRewardFund = () => (dispatch, getSelection, { steemAPI }) => {
  const getRewardFundAsync = Promise.promisify(steemAPI.getRewardFund, { context: steemAPI });
  return dispatch({
    type: GET_REWARD_FUND,
    payload: { promise: getRewardFundAsync('post') },
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
