import { getAccountWithFollowingCount as getAccountWithFollowingCountAPI } from '../helpers/apiHelpers';

export const GET_FOLLOWING_COUNT = '@users/GET_FOLLOWING_COUNT';
export const GET_FOLLOWING_COUNT_START = '@users/GET_FOLLOWING_COUNT_START';
export const GET_FOLLOWING_COUNT_SUCCESS = '@users/GET_FOLLOWING_COUNT_SUCCESS';
export const GET_FOLLOWING_COUNT_ERROR = '@users/GET_FOLLOWING_COUNT_ERROR';

export const getAccountWithFollowingCount = ({ name }) => dispatch =>
  dispatch({
    type: GET_FOLLOWING_COUNT,
    payload: getAccountWithFollowingCountAPI(name),
    meta: { username: name },
  });
