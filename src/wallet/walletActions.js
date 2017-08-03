import Promise from 'bluebird';

export const GET_WALLET = '@wallet/GET_WALLET';
export const GET_WALLET_START = '@wallet/GET_WALLET_START';
export const GET_WALLET_SUCCESS = '@wallet/GET_WALLET_SUCCESS';
export const GET_WALLET_ERROR = '@wallet/GET_WALLET_ERROR';

export const getWallet = username => (dispatch, getState, { steemAPI }) => {
  dispatch({
    type: GET_WALLET,
    payload: {
      promise: steemAPI.getStateAsync(`@${username}/transfers`).then(res => Promise.resolve({
        history: res.accounts[username] ? res.accounts[username].transfer_history : [],
      })),
    },
    meta: { username },
  });
};
