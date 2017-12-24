import { createAsyncActionType } from '../helpers/stateHelpers';
import { getAccountWithFollowingCount as getAccountWithFollowingCountAPI } from '../helpers/apiHelpers';

export const GET_ACCOUNT = createAsyncActionType('@users/GET_ACCOUNT');

export const getAccount = ({ name, authUser }) => dispatch =>
  dispatch({
    type: GET_ACCOUNT.ACTION,
    payload: getAccountWithFollowingCountAPI(name, authUser),
    meta: { username: name, authenticedUser: authUser },
  }).catch(() => {});
