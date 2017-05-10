import {
  getAccountWithFollowingCount as getAccountWithFollowingCountAPI
} from '../helpers/apiHelpers';

export const GET_FOLLOWING_COUNT = '@users/GET_FOLLOWING_COUNT';

export const getAccountWithFollowingCount = ({ name }) =>
  dispatch => dispatch({
    type: GET_FOLLOWING_COUNT,
    payload: getAccountWithFollowingCountAPI(name),
    meta: { username: name }
  });
