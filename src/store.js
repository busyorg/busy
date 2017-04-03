/* global window */
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import persistState from 'redux-localstorage';
import thunk from 'redux-thunk';
import { applyMiddleware, createStore, compose } from 'redux';
import api from './steemAPI';

import MessagesWorker from './messages';
import { mountResponsive } from './helpers/responsive';
import errorMiddleware from './errorMiddleware';
import reducers from './reducers';

export const messagesWorker = new MessagesWorker();

if (process.env.NODE_ENV !== 'production') {
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

if (process.env.ENABLE_LOGGER &&
  process.env.IS_BROWSER &&
  process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger({
    collapsed: true,
    duration: true,
  }));
}

const enhancer = compose(
  applyMiddleware(...middleware),
  persistState(['app', 'favorites', 'editor', 'bookmarks'], {
    slicer: () => state => ({
      app: {
        locale: state.app.locale,
        layout: state.app.layout,
      },
      bookmarks: state.bookmarks,
      favorites: state.favorites,
      editor: state.editor,
    }),
  })
);

const store = createStore(
  reducers,
  window.devToolsExtension && window.devToolsExtension(),
  enhancer
);

mountResponsive(store);
messagesWorker.attachToStore(store);
messagesWorker.start();

export default store;
