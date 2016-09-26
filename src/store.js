/* global window */
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { combineReducers, applyMiddleware, createStore } from 'redux';

import MessagesWorker, { messagesReducer } from './common/messages';
import appReducers, { headerReducer } from './app/appReducers';
import authReducers from './auth/authReducers';
import commentsReducer from './comments/commentsReducer.js';

export const messagesWorker = new MessagesWorker();

const reducers = combineReducers({
  app: appReducers,
  auth: authReducers,
  comments: commentsReducer,
  header: headerReducer,
  messages: messagesReducer,
});

const middleware = [
  promiseMiddleware({
    promiseTypeSuffixes: [
      'START',
      'SUCCESS',
      'ERROR',
    ]
  }),
  thunk.withExtraArgument({
    messagesWorker,
  }),
];

if (process.env.ENABLE_LOGGER &&
    process.env.IS_BROWSER &&
    process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger({
    collapsed: true,
    duration: true,
    stateTransformer: state => JSON.parse(JSON.stringify(state))
  }));
}

const store = createStore(
  reducers,
  typeof window !== 'undefined' && window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(...middleware)
);

messagesWorker.attachToStore(store);
messagesWorker.start();

export default store;
