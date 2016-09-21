import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

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
  thunk
];

if (process.env.NODE_ENV !== 'production') { // TODO - check if browser
  middleware.push(createLogger({
    collapsed: true,
    duration: true,
    stateTransformer: state => JSON.parse(JSON.stringify(state))
  }));
}

export default createStore(
  reducers,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(...middleware)
);
