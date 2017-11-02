import steem from 'steem';
import { createAction } from 'redux-actions';
import { createAsyncActionType } from '../helpers/stateHelpers';
import { getTransactionHistory, getDynamicGlobalProperties } from '../helpers/apiHelpers';

export const OPEN_TRANSFER = '@wallet/OPEN_TRANSFER';
export const CLOSE_TRANSFER = '@wallet/CLOSE_TRANSFER';
export const GET_GLOBAL_PROPERTIES = createAsyncActionType('@wallet/GET_GLOBAL_PROPERTIES');
export const GET_USER_TRANSACTIONS = createAsyncActionType('@users/GET_USER_TRANSACTIONS');
export const GET_MORE_USER_TRANSACTIONS = createAsyncActionType(
  '@users/GET_MORE_USER_TRANSACTIONS',
);
export const GET_USER_EST_ACCOUNT_VALUE = createAsyncActionType(
  '@users/GET_USER_EST_ACCOUNT_VALUE',
);
export const openTransfer = createAction(OPEN_TRANSFER);
export const closeTransfer = createAction(CLOSE_TRANSFER);

export const getGlobalProperties = () => dispatch =>
  dispatch({
    type: GET_GLOBAL_PROPERTIES.ACTION,
    payload: {
      promise: getDynamicGlobalProperties(),
    },
  });

export const getUserTransactions = username => dispatch =>
  dispatch({
    type: GET_USER_TRANSACTIONS.ACTION,
    payload: {
      promise: getTransactionHistory(username).then(transactions => ({
        username,
        transactions,
      })),
    },
  });

export const getMoreUserTransactions = (username, start) => dispatch =>
  dispatch({
    type: GET_MORE_USER_TRANSACTIONS.ACTION,
    payload: {
      promise: getTransactionHistory(username, start).then(transactions => ({
        username,
        transactions,
        lastActionId: start,
      })).catch((error) => {
        console.log(error);
      }),
    },
  });

export const getUserEstAccountValue = user => dispatch =>
  dispatch({
    type: GET_USER_EST_ACCOUNT_VALUE.ACTION,
    payload: {
      promise: steem.formatter.estimateAccountValue(user).then(value => ({
        username: user.name,
        value,
      })),
    },
  });
