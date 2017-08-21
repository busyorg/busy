import { combineReducers } from 'redux';

import { routerReducer } from 'react-router-redux';

import appReducer, * as fromApp from './app/appReducer';
import authReducer, * as fromAuth from './auth/authReducer';
import commentsReducer, * as fromComments from './comments/commentsReducer';
import feedReducer, * as fromFeed from './feed/feedReducer';
import postsReducer, * as fromPosts from './post/postsReducer';
import userReducer, * as fromUser from './user/userReducer';
import usersReducer, * as fromUsers from './user/usersReducer';
import notificationReducer from './app/Notification/notificationReducers';
import bookmarksReducer, * as fromBookmarks from './bookmarks/bookmarksReducer';
import favoritesReducer, * as fromFavorites from './favorites/favoritesReducer';
import editorReducer, * as fromEditor from './post/Write/editorReducer';
import { responsiveReducer } from './vendor/responsive';
import reblogReducers, * as fromReblog from './app/Reblog/reblogReducers';
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
export const getAuthenticatedUserName = state => fromAuth.getAuthenticatedUserName(state.auth);

export const getPosts = state => fromPosts.getPosts(state.posts);
export const getPostContent = state => fromPosts.getPostContent(state.posts);
export const getIsPostLoading = state => fromPosts.getIsPostLoading(state.posts);
export const getPendingLikes = state => fromPosts.getPendingLikes(state.posts);

export const getDraftPosts = state => fromEditor.getDraftPosts(state.editor);
export const getIsEditorLoading = state => fromEditor.getIsEditorLoading(state.editor);

export const getLocale = state => fromApp.getLocale(state.app);
export const getRate = state => fromApp.getRate(state.app);
export const getLastPostId = state => fromApp.getLastPostId(state.app);

export const getFeed = state => fromFeed.getFeed(state.feed);

export const getComments = state => fromComments.getComments(state.comments);

export const getBookmarks = state => fromBookmarks.getBookmarks(state.bookmarks);

export const getRebloggedList = state => fromReblog.getRebloggedList(state.reblog);
export const getPendingReblogs = state => fromReblog.getPendingReblogs(state.reblog);

export const getFollowingList = state => fromUser.getFollowingList(state.user);
export const getPendingFollows = state => fromUser.getPendingFollows(state.user);

export const getUser = (state, username) => fromUsers.getUser(state.users, username);

export const getFavoriteCategories = state => fromFavorites.getFavoriteCategories(state.favorites);
