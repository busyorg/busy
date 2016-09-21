import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { combineReducers, applyMiddleware, createStore } from 'redux';

import authReducers from './auth/authReducers';
import appReducers, { headerReducer } from './app/appReducers';
import commentsReducer from './comments/commentsReducer.js';

const reducers = combineReducers({
  app: appReducers,
  auth: authReducers,
  header: headerReducer,
  comments: commentsReducer
});

const middleware = [
  thunk,
  promiseMiddleware()
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

export default createStore(
  reducers,
  typeof window !== 'undefined' && window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(...middleware)
);
