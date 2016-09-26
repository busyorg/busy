import Promise from 'bluebird';
import request from 'superagent';

Promise.promisifyAll(request.Request.prototype);

const HOST = process.env.BUSYWS_HOST;

export const FETCH_CHANNEL_PRESENCE = '@messages/FETCH_CHANNEL_PRESENCE';
export const FETCH_CHANNEL_PRESENCE_START = '@messages/FETCH_CHANNEL_PRESENCE_START';
export const FETCH_CHANNEL_PRESENCE_SUCCESS = '@messages/FETCH_CHANNEL_PRESENCE_SUCCESS';
export const FETCH_CHANNEL_PRESENCE_ERROR = '@messages/FETCH_CHANNEL_PRESENCE_ERROR';

export function fetchChannelPresence({ params }) {
  const channelName = params.channelName || 'general';
  const url = `${HOST}/api/v1/channels/${channelName}`;
  return {
    type: FETCH_CHANNEL_PRESENCE,
    payload: {
      promise: request
        .get(url)
        .endAsync()
        .then((res) => res.body),
    },
  };
}

export const SEND_MESSAGE_REQUEST = '@messages/SEND_MESSAGE_REQUEST';

export function sendMessage(message) {
  return (dispatch, getState, { messagesWorker }) => dispatch({
    type: SEND_MESSAGE_REQUEST,
    payload: {
      promise: messagesWorker.sendMessage(message),
    },
  });
}

export const JOIN_CHANNEL = '@messages/JOIN_CHANNEL';

export function joinChannel({ params }) {
  const channelName = params.channelName || 'general';
  return (dispatch, getState, { messagesWorker }) => dispatch({
    type: JOIN_CHANNEL,
    payload: {
      promise: messagesWorker.joinChannel(channelName),
    },
  });
}

