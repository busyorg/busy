import Promise from 'bluebird';
import assert from 'assert';
import each from 'lodash/each';
import io from 'socket.io-client';

export const CONNECTED = '@messages/CONNECTED';
export const DISCONNECTED = '@messages/DISCONNECTED';
export const INIT = '@messages/INIT';

export const USER_JOIN = '@messages/USER_JOIN';
export const USER_MESSAGE = '@messages/USER_MESSAGE';
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
  constructor(store) {
    this.socket = io.connect(process.env.BUSYWS_HOST);
    if (store) this.attachToStore(store);
  }

  attachToStore(store) {
    assert(store, 'Provide the `MessagesWorker` a redux store');
    this.store = store;
    this.store.dispatch({
      type: INIT,
    });
  }

  start() {
    this.socket.on('connect', () => {
      this.store.dispatch({
        type: CONNECTED,
      });
    });

    this.socket.on('disconnect', () => {
      this.store.dispatch({
        type: DISCONNECTED,
      });
    });

    each(socketEventsToActions, (actionType, socketEvent) => {
      this.socket.on(socketEvent, (payload) => {
        this.onSocketEvent(actionType, payload);
      });
    });

    this.store.subscribe(() => {
      const state = this.store.getState();
      if (state.auth.isAuthenticated) {
        this.onAuthenticated(state.auth);
      }
    });
  }

  onAuthenticated({ user }) {
    const username = user.name;
    const payload = { senderUsername: username };
    this.socket.emit('USER_JOIN', payload);
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
          const err = new Error(res.error);
          err.res = res;
          reject(err);
        }
      });
    });
  }

  sendMessage(message) {
    return this.emitAsync('USER_MESSAGE', message);
  }

  joinChannel(channelName) {
    return this.emitAsync('USER_JOIN', {
      channelName
    });
  }
}
