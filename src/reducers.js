/* global window */
import { combineReducers } from 'redux';

import appReducers from './app/appReducers';
import authReducers from './auth/authReducers';
import { messagesReducer } from './messages';
import commentsReducer from './comments/commentsReducer.js';
import feedReducers from './feed/feedReducers';
import postsReducers from './post/postsReducers';
import userReducer from './user/userReducer';
import usersReducer from './user/usersReducer';
import notificationReducer from './app/Notification/notificationReducers';
import bookmarksReducer from './bookmarks/bookmarksReducer';
import favoritesReducer from './favorites/favoritesReducers';
import editorReducer from './post/Write/EditorReducers';
import { responsiveReducer } from './helpers/responsive';
import reblogReducers from './app/Reblog/reblogReducers';
import walletReducer from './wallet/walletReducer';

const reducers = combineReducers({
  app: appReducers,
  auth: authReducers,
  comments: commentsReducer,
  editor: editorReducer,
  posts: postsReducers,
  feed: feedReducers,
  user: userReducer,
  users: usersReducer,
  responsive: responsiveReducer,
  messages: messagesReducer,
  notifications: notificationReducer,
  bookmarks: bookmarksReducer,
  favorites: favoritesReducer,
  reblog: reblogReducers,
  wallet: walletReducer,
});

export default reducers;
