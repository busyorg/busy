import { combineReducers } from 'redux';

import { routerReducer } from 'react-router-redux';

import appReducer, * as fromApp from './app/appReducer';
import authReducer, * as fromAuth from './auth/authReducer';
import commentsReducer from './comments/commentsReducer';
import feedReducer from './feed/feedReducer';
import postsReducer, * as fromPosts from './post/postsReducer';
import userReducer from './user/userReducer';
import usersReducer from './user/usersReducer';
import notificationReducer from './app/Notification/notificationReducers';
import bookmarksReducer from './bookmarks/bookmarksReducer';
import favoritesReducer from './favorites/favoritesReducer';
import editorReducer, * as fromEditor from './post/Write/editorReducer';
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

export const getDraftPosts = state => fromEditor.getDraftPosts(state.editor);
export const getIsEditorLoading = state => fromEditor.getIsEditorLoading(state.editor);

export const getLayout = state => fromApp.getLayout(state.editor);
export const getLocale = state => fromApp.getLocale(state.editor);
export const getRate = state => fromApp.getRate(state.editor);
export const getLastPostId = state => fromApp.getLastPostId(state.editor);
