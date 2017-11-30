import { createAsyncActionType } from '../helpers/stateHelpers';
import { getWitnessesList, getAccountWitnessVotes } from '../helpers/apiHelpers';

export const GET_WITNESS_LIST = createAsyncActionType('GET_WITNESS_LIST');
export const GET_ACCOUNT_WITNESS_VOTES = createAsyncActionType('GET_ACCOUNT_WITNESS_VOTES');

export const getWitnessList = () => dispatch =>
  dispatch({
    type: GET_WITNESS_LIST.ACTION,
    payload: {
      promise: getWitnessesList(),
    },
  });

export const getAccountsWitnessVotes = username => dispatch =>
  dispatch({
    type: GET_ACCOUNT_WITNESS_VOTES.ACTION,
    payload: {
      promise: getAccountWitnessVotes(username),
    },
  });
