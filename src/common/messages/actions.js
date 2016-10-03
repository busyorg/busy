import Promise from 'bluebird';
import findLast from 'lodash/findLast';
import last from 'lodash/last';
import map from 'lodash/map';
import request from 'superagent';

Promise.promisifyAll(request.Request.prototype);

const HOST = process.env.BUSYWS_HOST;

export const FETCH_CHANNEL_PRESENCE = '@messages/FETCH_CHANNEL_PRESENCE';
export const FETCH_CHANNEL_PRESENCE_START = '@messages/FETCH_CHANNEL_PRESENCE_START';
export const FETCH_CHANNEL_PRESENCE_SUCCESS = '@messages/FETCH_CHANNEL_PRESENCE_SUCCESS';
export const FETCH_CHANNEL_PRESENCE_ERROR = '@messages/FETCH_CHANNEL_PRESENCE_ERROR';

export function fetchChannelPresence({ params }) {
  const channelName = params.category ||
    (params.username ? `@${params.username}` : null) ||
    'general';
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
  const channelName = params.category || 'general';
  return (dispatch, getState, { messagesWorker }) => dispatch({
    type: JOIN_CHANNEL,
    payload: {
      promise: messagesWorker.joinChannel(channelName),
    },
  });
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
  console.log(messages);
  if (!messages || !messages.length) {
    return {
      type: 'USER_MESSAGE_READ_SKIP',
    };
  }

  return (dispatch, getState, { messagesWorker }) => {
    const state = getState();

    const uuid = last(messages).uuid;
    return dispatch({
      type: USER_MESSAGE_READ,
      meta: {
        uuids: map(messages, 'uuid'),
      },
      payload: {
        promise: messagesWorker.emitAsync('USER_MESSAGE_READ', {
          uuid,
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
