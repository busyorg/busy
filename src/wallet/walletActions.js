import steem from 'steem';
import { createAction } from 'redux-actions';
import { createAsyncActionType } from '../helpers/stateHelpers';
import { getTransactionHistory, getDynamicGlobalProperties } from '../helpers/apiHelpers';

export const OPEN_TRANSFER = '@wallet/OPEN_TRANSFER';
export const CLOSE_TRANSFER = '@wallet/CLOSE_TRANSFER';
export const GET_GLOBAL_PROPERTIES = createAsyncActionType('@wallet/GET_GLOBAL_PROPERTIES');
export const GET_USER_TRANSACTIONS = createAsyncActionType('@users/GET_USER_TRANSACTIONS');
export const GET_USER_EST_ACCOUNT_VALUE = createAsyncActionType(
  '@users/GET_USER_EST_ACCOUNT_VALUE',
);

export const openTransfer = createAction(OPEN_TRANSFER);
export const closeTransfer = createAction(CLOSE_TRANSFER);

export const getGlobalPropertiesSuccess = createAction(GET_GLOBAL_PROPERTIES.SUCCESS);

export const getGlobalProperties = () => dispatch =>
  getDynamicGlobalProperties().then((result) => {
    dispatch(getGlobalPropertiesSuccess(result));
  });

export const getUserTransactionsSuccess = createAction(
  GET_USER_TRANSACTIONS.SUCCESS,
  (username, transactions) => ({
    username,
    transactions,
  }),
);

export const getUserTransactions = username => (dispatch) => {
  dispatch({ type: GET_USER_TRANSACTIONS.START });
  return getTransactionHistory(username).then((transactions) => {
    dispatch(getUserTransactionsSuccess(username, transactions));
  });
};

export const getUserEstAccountValueSuccess = (username, value) => ({
  type: GET_USER_EST_ACCOUNT_VALUE.SUCCESS,
  payload: {
    username,
    value,
  },
});

export const getUserEstAccountValue = user => dispatch =>
  steem.formatter.estimateAccountValue(user).then((value) => {
    dispatch(getUserEstAccountValueSuccess(user.name, value));
  });
