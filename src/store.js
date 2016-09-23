import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import authReducers from './auth/authReducers';
import appReducers, { headerReducer } from './app/appReducers';
import commentsReducer from './comments/commentsReducer.js';
import feedReducers from './feed/feedReducers';
import postsReducers from './post/postsReducers';

const reducers = combineReducers({
  app: appReducers,
  auth: authReducers,
  header: headerReducer,
  comments: commentsReducer,
  posts: postsReducers,
  feed: feedReducers,
});

export default createStore(
  reducers,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(thunk)
);
