import Promise from 'bluebird';
import findLast from 'lodash/findLast';
import last from 'lodash/last';
import map from 'lodash/map';
import request from 'superagent';
import querystring from 'querystring';
import uuid from 'uuid';
import extend from 'lodash/extend';

Promise.promisifyAll(request.Request.prototype);

const HOST = process.env.BUSYWS_HOST;

export const FETCH_CHANNEL_PRESENCE = '@messages/FETCH_CHANNEL_PRESENCE';
export const FETCH_CHANNEL_PRESENCE_START = '@messages/FETCH_CHANNEL_PRESENCE_START';
export const FETCH_CHANNEL_PRESENCE_SUCCESS = '@messages/FETCH_CHANNEL_PRESENCE_SUCCESS';
export const FETCH_CHANNEL_PRESENCE_ERROR = '@messages/FETCH_CHANNEL_PRESENCE_ERROR';

export const fetchChannelPresence = (channelName = 'general') =>
  (dispatch, getState) => {
    const { auth } = getState();

    if (!auth.isAuthenticated) {
      return;
    }

    const channelURI = `?${querystring.stringify({ channelName })}`;

    const url = `${HOST}/api/v1/channels/${channelURI}`;

    dispatch({
      type: FETCH_CHANNEL_PRESENCE,
      payload: {
        promise: request
          .get(url)
          .endAsync()
          .then(res => res.body),
      },
    });
  };

export const SEND_MESSAGE_REQUEST = '@messages/SEND_MESSAGE_REQUEST';
export const SEND_MESSAGE_REQUEST_SUCCESS = '@messages/SEND_MESSAGE_REQUEST_SUCCESS';

export function sendMessage(message) {
  const msg = extend(message, {
    uuid: message.uuid || uuid(),
  });
  return (dispatch, getState, { messagesWorker }) => {
    const { auth } = getState();

    if (!auth.isAuthenticated) {
      return;
    }

    dispatch({
      type: SEND_MESSAGE_REQUEST,
      meta: {
        message: msg,
      },
      payload: {
        promise: messagesWorker.sendMessage(msg),
      },
    });
  }
}

export const JOIN_CHANNEL = '@messages/JOIN_CHANNEL';

export function joinChannel(channelName = 'general') {
  return (dispatch, getState, { messagesWorker }) => {
    dispatch({
      type: JOIN_CHANNEL,
      payload: {
        promise: messagesWorker.joinChannel(channelName),
      },
    });
  };
}

export const USER_MESSAGE_RECEIVED = '@messages/USER_MESSAGE_RECEIVED';
export const USER_MESSAGE_RECEIVED_START = '@messages/USER_MESSAGE_RECEIVED_START';
export const USER_MESSAGE_RECEIVED_SUCCESS = '@messages/USER_MESSAGE_RECEIVED_SUCCESS';
export const USER_MESSAGE_RECEIVED_ERROR = '@messages/USER_MESSAGE_RECEIVED_ERROR';

export function sendReceivedAcknoledgement(message) {
  return (dispatch, getState, { messagesWorker }) => dispatch({
    type: USER_MESSAGE_RECEIVED,
    payload: {
      promise: messagesWorker.emitAsync('USER_MESSAGE_RECEIVED', {
        uuid: message.uuid,
      }),
    },
  });
}

export const USER_MESSAGE_READ = '@messages/USER_MESSAGE_READ';
export const USER_MESSAGE_READ_START = '@messages/USER_MESSAGE_READ_START';
export const USER_MESSAGE_READ_SUCCESS = '@messages/USER_MESSAGE_READ_SUCCESS';
export const USER_MESSAGE_READ_ERROR = '@messages/USER_MESSAGE_READ_ERROR';

export function sendReadAcknoledgement(messages) {
  if (!messages || !messages.length) {
    return {
      type: 'USER_MESSAGE_READ_SKIP',
    };
  }

  return (dispatch, getState, { messagesWorker }) => {
    const state = getState();
    const username = state.auth.user && state.auth.user.name;
    const uuid = last(messages).uuid;
    return dispatch({
      type: USER_MESSAGE_READ,
      meta: {
        uuids: map(messages, 'uuid'),
      },
      payload: {
        promise: messagesWorker.emitAsync('USER_MESSAGE_READ', {
          uuid,
          readBy: username,
        }),
      },
    });
  };
}

export const FETCH_MESSAGES = '@messages/FETCH_MESSAGES';
export const FETCH_MESSAGES_START = '@messages/FETCH_MESSAGES_START';
export const FETCH_MESSAGES_SUCCESS = '@messages/FETCH_MESSAGES_SUCCESS';
export const FETCH_MESSAGES_ERROR = '@messages/FETCH_MESSAGES_ERROR';

export function fetchMessages(username) {
  const url = `${HOST}/api/v1/messages`;
  return (dispatch) => dispatch({
    type: FETCH_MESSAGES,
    payload: {
      promise: request
        .get(url)
        .query({
          username
        })
        .endAsync()
        .then((res) => res.body)
        .then((messages) => {
          process.nextTick(() => {
            messages.unreadMessages.forEach((message) => {
              dispatch(sendReceivedAcknoledgement(message));
            });
          });
          return messages;
        }),
    },
  });
}
