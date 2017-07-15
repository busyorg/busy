/* global window */
import promiseMiddleware from 'redux-promise-middleware';
import persistState from 'redux-localstorage';
import thunk from 'redux-thunk';
import { pick } from 'lodash/object';
import { applyMiddleware, createStore, compose } from 'redux';
import api from './steemAPI';

import { mountResponsive } from './helpers/responsive';
import errorMiddleware from './errorMiddleware';
import reducers from './reducers';

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
    steemAPI: api,
  })
];

let enhancer;
if (process.env.IS_BROWSER) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(
    applyMiddleware(...middleware),
    persistState(['app', 'favorites', 'editor', 'bookmarks'], {
      slicer: () => state => ({
        app: pick(state.app, ['locale', 'sidebarIsVisible', 'layout']),
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
  return store;
};

export default getStore;
