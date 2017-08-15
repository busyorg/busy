import { combineReducers } from 'redux';

import { routerReducer } from 'react-router-redux';

import appReducer from './app/appReducer';
import authReducer, * as fromAuth from './auth/authReducer';
import commentsReducer from './comments/commentsReducer';
import feedReducer from './feed/feedReducer';
import postsReducer, * as fromPosts from './post/postsReducer';
import userReducer from './user/userReducer';
import usersReducer from './user/usersReducer';
import notificationReducer from './app/Notification/notificationReducers';
import bookmarksReducer from './bookmarks/bookmarksReducer';
import favoritesReducer from './favorites/favoritesReducer';
import editorReducer from './post/Write/editorReducer';
import { responsiveReducer } from './vendor/responsive';
import reblogReducers from './app/Reblog/reblogReducers';
import walletReducer from './wallet/walletReducer';

const reducers = combineReducers({
  app: appReducer,
  auth: authReducer,
  comments: commentsReducer,
  editor: editorReducer,
  posts: postsReducer,
  feed: feedReducer,
  user: userReducer,
  users: usersReducer,
  responsive: responsiveReducer,
  notifications: notificationReducer,
  bookmarks: bookmarksReducer,
  favorites: favoritesReducer,
  reblog: reblogReducers,
  wallet: walletReducer,
  router: routerReducer,
});

export default reducers;

export const getIsAuthenticated = state => fromAuth.getIsAuthenticated(state.auth);
export const getIsAuthFetching = state => fromAuth.getIsAuthFetching(state.auth);
export const getIsLoaded = state => fromAuth.getIsLoaded(state.auth);
export const getAuthenticatedUser = state => fromAuth.getAuthenticatedUser(state.auth);

export const getPostContent = state => fromPosts.getPostContent(state.posts);
export const getIsPostLoading = state => fromPosts.getIsPostLoading(state.posts);
