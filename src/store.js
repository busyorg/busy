import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import authReducers from './auth/authReducers';
import appReducers, { headerReducer } from './app/appReducers';

const reducers = combineReducers({
  app: appReducers,
  auth: authReducers,
  header: headerReducer
});

export default createStore(
  reducers,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(thunk)
);
