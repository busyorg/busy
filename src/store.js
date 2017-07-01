/* global window */
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import persistState from 'redux-localstorage';
import thunk from 'redux-thunk';
import { pick } from 'lodash/object';
import { applyMiddleware, createStore, compose } from 'redux';
import api from './steemAPI';

import MessagesWorker from './messages';
import { mountResponsive } from './helpers/responsive';
import errorMiddleware from './errorMiddleware';
import reducers from './reducers';

export const messagesWorker = new MessagesWorker();
let preloadedState;
if (process.env.IS_BROWSER) {
  preloadedState = window.__PRELOADED_STATE__;
  delete window.__PRELOADED_STATE__;
}

if (process.env.IS_BROWSER && process.env.NODE_ENV !== 'production') {
  window.steemAPI = api;
}

const middleware = [
  errorMiddleware,
  promiseMiddleware({
    promiseTypeSuffixes: [
      'START',
      'SUCCESS',
      'ERROR',
    ]
  }),
  thunk.withExtraArgument({
    messagesWorker,
    steemAPI: api,
  })
];

if (process.env.IS_BROWSER &&
  process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger({
    collapsed: true,
    duration: true,
  }));
}

let enhancer;
if (process.env.IS_BROWSER) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(
    applyMiddleware(...middleware),
    persistState(['app', 'favorites', 'editor', 'bookmarks', 'user'], {
      slicer: () => state => ({
        app: pick(state.app, ['locale', 'sidebarIsVisible', 'layout']),
        user: pick(state.user, ['votePower', 'following']),
        bookmarks: state.bookmarks,
        favorites: state.favorites,
        editor: state.editor,
      }),
    })
  );
} else {
  enhancer = compose(applyMiddleware(...middleware));
}

const getStore = () => {
  const store = createStore(
    reducers,
    preloadedState,
    enhancer
  );
  mountResponsive(store);
  messagesWorker.attachToStore(store);
  messagesWorker.start();
  return store;
};

export default getStore;
