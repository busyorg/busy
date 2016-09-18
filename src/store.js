var Redux = require('redux'),
  thunk = require('redux-thunk').default;

import authReducers from './auth/authReducers';
import appReducers, { headerReducer } from './app/appReducers';

const rootReducer = Redux.combineReducers({
  app: appReducers,
  auth: authReducers,
  header: headerReducer
});

module.exports = Redux.applyMiddleware(thunk)(Redux.createStore)(rootReducer, {}, window.devToolsExtension && window.devToolsExtension());
