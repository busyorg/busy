import Promise from 'bluebird';
import assert from 'assert';
import each from 'lodash/each';
import io from 'socket.io-client';
// import uuid from 'uuid';

import { fetchMessages } from './messagesActions';

export const CONNECTED = '@messages/CONNECTED';
export const DISCONNECTED = '@messages/DISCONNECTED';
export const INIT = '@messages/INIT';

export const USER_JOIN = '@messages/USER_JOIN';
export const USER_MESSAGE = '@messages/USER_MESSAGE';
export const USER_UNREAD_MESSAGES = '@messages/USER_UNREAD_MESSAGES';
export const USER_LEAVE = '@messages/USER_LEAVE';
export const ERROR = '@messages/ERROR';

export const actions = {
  CONNECTED,
  DISCONNECTED,
  USER_JOIN,
  USER_MESSAGE,
  USER_LEAVE,
  ERROR,
};

export const socketEventsToActions = {
  USER_JOIN,
  USER_MESSAGE,
  USER_LEAVE,
  ERROR,
};

export default class MessagesWorker {
  constructor() {
    this.socket = io.connect(process.env.BUSYWS_HOST);
  }

  attachToStore(store) {
    assert(store, 'Provide the `MessagesWorker` a redux store');
    this.store = store;
    this.store.dispatch({
      type: INIT,
    });
  }

  start() {
    const state = this.store.getState();

    this.socket.on('connect', () => {
      this.store.dispatch({
        type: CONNECTED,
      });

      if (state.auth.isAuthenticated) {
        this.onAuthenticated(state.auth);
      }

      each(socketEventsToActions, (actionType, socketEvent) => {
        this.socket.on(socketEvent, (payload) => {
          this.onSocketEvent(actionType, payload);
        });
      });
    });

    this.socket.on('disconnect', () => {
      this.joined = false;
      this.store.dispatch({
        type: DISCONNECTED,
      });
    });

    this.store.subscribe(() => {
      const state = this.store.getState();
      if (state.auth.isAuthenticated) {
        this.onAuthenticated(state.auth);
      }
    });
  }

  onAuthenticated({ user, token }) {
    if (this.joined) return;
    this.joined = true;
    const username = user.name;
    const payload = { senderUsername: username, token };
    this.socket.emit('USER_JOIN', payload);
    this.store.dispatch(fetchMessages(username));
  }

  onSocketEvent(actionType, payload) {
    this.store.dispatch({
      type: actionType,
      payload,
    });
  }

  emitAsync(event, payload) {
    return new Promise((resolve, reject) => {
      this.socket.emit(event, payload, (res) => {
        if (res.ok) {
          resolve(res);
        } else {
          const err = new Error(
            res.error ||
            'Failed to emit payload'
          );
          err.res = res;
          reject(err);
        }
      });
    });
  }

  sendMessage(message) {
    return this.emitAsync('USER_MESSAGE', message);
  }

  joinChannel(channelName, token) {
    return this.emitAsync('USER_JOIN', {
      channelName,
      token,
    });
  }
}
