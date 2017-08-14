import { combineReducers } from 'redux';

import { routerReducer } from 'react-router-redux';

import appReducers from './app/appReducers';
import authReducers, * as fromAuth from './auth/authReducers';
import commentsReducer from './comments/commentsReducer';
import feedReducers from './feed/feedReducers';
import postsReducers, * as fromPosts from './post/postsReducers';
import userReducer from './user/userReducer';
import usersReducer from './user/usersReducer';
import notificationReducer from './app/Notification/notificationReducers';
import bookmarksReducer from './bookmarks/bookmarksReducer';
import favoritesReducer from './favorites/favoritesReducers';
import editorReducer from './post/Write/editorReducers';
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
