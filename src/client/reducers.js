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
import walletReducer, * as fromWallet from './wallet/walletReducer';
import reblogReducers, * as fromReblog from './app/Reblog/reblogReducers';
import settingsReducer, * as fromSettings from './settings/settingsReducer';
import { responsiveReducer } from './vendor/responsive';

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
  router: routerReducer,
  wallet: walletReducer,
  settings: settingsReducer,
});

export default reducers;

export const getIsAuthenticated = state => fromAuth.getIsAuthenticated(state.auth);
export const getIsAuthFetching = state => fromAuth.getIsAuthFetching(state.auth);
export const getIsLoaded = state => fromAuth.getIsLoaded(state.auth);
export const getIsReloading = state => fromAuth.getIsReloading(state.auth);
export const getAuthenticatedUser = state => fromAuth.getAuthenticatedUser(state.auth);
export const getAuthenticatedUserName = state => fromAuth.getAuthenticatedUserName(state.auth);

export const getPosts = state => fromPosts.getPosts(state.posts);
export const getPostContent = (state, author, permlink) =>
  fromPosts.getPostContent(state.posts, author, permlink);
export const getPendingLikes = state => fromPosts.getPendingLikes(state.posts);

export const getDraftPosts = state => fromEditor.getDraftPosts(state.editor);
export const getIsEditorLoading = state => fromEditor.getIsEditorLoading(state.editor);
export const getIsEditorSaving = state => fromEditor.getIsEditorSaving(state.editor);
export const getPendingDrafts = state => fromEditor.getPendingDrafts(state.editor);
export const getIsPostEdited = (state, permlink) =>
  fromEditor.getIsPostEdited(state.editor, permlink);

export const getRate = state => fromApp.getRate(state.app);
export const getIsTrendingTopicsLoading = state => fromApp.getIsTrendingTopicsLoading(state.app);
export const getRewardFund = state => fromApp.getRewardFund(state.app);
export const getTrendingTopics = state => fromApp.getTrendingTopics(state.app);
export const getIsFetching = state => fromApp.getIsFetching(state.app);

export const getFeed = state => fromFeed.getFeed(state.feed);

export const getComments = state => fromComments.getComments(state.comments);
export const getCommentsList = state => fromComments.getCommentsList(state.comments);
export const getCommentsPendingVotes = state =>
  fromComments.getCommentsPendingVotes(state.comments);

export const getBookmarks = state => fromBookmarks.getBookmarks(state.bookmarks);
export const getPendingBookmarks = state => fromBookmarks.getPendingBookmarks(state.bookmarks);

export const getRebloggedList = state => fromReblog.getRebloggedList(state.reblog);
export const getPendingReblogs = state => fromReblog.getPendingReblogs(state.reblog);

export const getFollowingList = state => fromUser.getFollowingList(state.user);
export const getPendingFollows = state => fromUser.getPendingFollows(state.user);
export const getIsFetchingFollowingList = state => fromUser.getIsFetchingFollowingList(state.user);
export const getRecommendations = state => fromUser.getRecommendations(state.user);

export const getUser = (state, username) => fromUsers.getUser(state.users, username);

export const getFavoriteCategories = state => fromFavorites.getFavoriteCategories(state.favorites);

export const getIsTransferVisible = state => fromWallet.getIsTransferVisible(state.wallet);
export const getTransferTo = state => fromWallet.getTransferTo(state.wallet);

export const getIsSettingsLoading = state => fromSettings.getIsLoading(state.settings);
export const getLocale = state => fromSettings.getLocale(state.settings);
export const getVotingPower = state => fromSettings.getVotingPower(state.settings);
export const getVotePercent = state => fromSettings.getVotePercent(state.settings);
export const getShowNSFWPosts = state => fromSettings.getShowNSFWPosts(state.settings);

export const getTotalVestingShares = state => fromWallet.getTotalVestingShares(state.wallet);
export const getTotalVestingFundSteem = state => fromWallet.getTotalVestingFundSteem(state.wallet);
export const getUsersTransactions = state => fromWallet.getUsersTransactions(state.wallet);
export const getUsersAccountHistory = state => fromWallet.getUsersAccountHistory(state.wallet);
export const getUsersAccountHistoryLoading = state =>
  fromWallet.getUsersAccountHistoryLoading(state.wallet);
export const getUsersEstAccountsValues = state =>
  fromWallet.getUsersEstAccountsValues(state.wallet);
export const getLoadingEstAccountValue = state =>
  fromWallet.getLoadingEstAccountValue(state.wallet);
export const getLoadingGlobalProperties = state =>
  fromWallet.getLoadingGlobalProperties(state.wallet);
export const getLoadingMoreUsersAccountHistory = state =>
  fromWallet.getLoadingMoreUsersAccountHistory(state.wallet);
export const getUserHasMoreAccountHistory = (state, username) =>
  fromWallet.getUserHasMoreAccountHistory(state.wallet, username);
export const getAccountHistoryFilter = state => fromWallet.getAccountHistoryFilter(state.wallet);
