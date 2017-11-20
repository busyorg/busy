import steem from 'steem';
import _ from 'lodash';
import { createAction } from 'redux-actions';
import { createAsyncActionType } from '../helpers/stateHelpers';
import {
  getAccountHistory,
  getDynamicGlobalProperties,
  isWalletTransaction,
} from '../helpers/apiHelpers';

export const OPEN_TRANSFER = '@wallet/OPEN_TRANSFER';
export const CLOSE_TRANSFER = '@wallet/CLOSE_TRANSFER';
export const GET_GLOBAL_PROPERTIES = createAsyncActionType('@wallet/GET_GLOBAL_PROPERTIES');
export const GET_USER_ACCOUNT_HISTORY = createAsyncActionType('@users/GET_USER_ACCOUNT_HISTORY');
export const GET_MORE_USER_ACCOUNT_HISTORY = createAsyncActionType(
  '@users/GET_MORE_USER_ACCOUNT_HISTORY',
);
export const GET_USER_EST_ACCOUNT_VALUE = createAsyncActionType(
  '@users/GET_USER_EST_ACCOUNT_VALUE',
);
export const UPDATE_ACCOUNT_HISTORY_FILTER = '@users/UPDATE_ACCOUNT_HISTORY_FILTER';

export const openTransfer = createAction(OPEN_TRANSFER);
export const closeTransfer = createAction(CLOSE_TRANSFER);

const getParsedUserActions = (userActions) => {
  const userWalletTransactions = [];
  const userAccountHistory = [];

  _.each(userActions.reverse(), (action) => {
    const actionCount = action[0];
    const actionDetails = {
      ...action[1],
      actionCount,
    };
    const actionType = actionDetails.op[0];

    if (isWalletTransaction(actionType)) {
      userWalletTransactions.push(actionDetails);
    }

    userAccountHistory.push(actionDetails);
  });

  return {
    userWalletTransactions,
    userAccountHistory,
  };
};

export const getGlobalProperties = () => dispatch =>
  dispatch({
    type: GET_GLOBAL_PROPERTIES.ACTION,
    payload: {
      promise: getDynamicGlobalProperties(),
    },
  });

export const getUserAccountHistory = username => dispatch =>
  dispatch({
    type: GET_USER_ACCOUNT_HISTORY.ACTION,
    payload: {
      promise: getAccountHistory(username).then((userActions) => {
        const parsedUserActions = getParsedUserActions(userActions);

        return {
          username,
          userWalletTransactions: parsedUserActions.userWalletTransactions,
          userAccountHistory: parsedUserActions.userAccountHistory,
        };
      }),
    },
  });

export const getMoreUserAccountHistory = (username, start, limit) => dispatch =>
  dispatch({
    type: GET_MORE_USER_ACCOUNT_HISTORY.ACTION,
    payload: {
      promise: getAccountHistory(username, start, limit).then((userActions) => {
        const parsedUserActions = getParsedUserActions(userActions);
        return {
          username,
          userWalletTransactions: parsedUserActions.userWalletTransactions,
          userAccountHistory: parsedUserActions.userAccountHistory,
        };
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

export const updateAccountHistoryFilter = createAction(UPDATE_ACCOUNT_HISTORY_FILTER);
