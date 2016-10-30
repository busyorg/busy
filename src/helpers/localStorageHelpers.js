import store from 'store';
import _ from 'lodash';

export const getBookmarks = () => {
  return store.get('bookmarks') || {};
};

export const addBookmark = ({ postId, author, permlink }) => {
  const bookmarks = store.get('bookmarks') || {};
  bookmarks[postId] = { author, permlink, timestamp: Date.now() };
  store.set('bookmarks', bookmarks);
  return true;
};

export const removeBookmark = (postId) => {
  const bookmarks = store.get('bookmarks') || {};
  delete bookmarks[postId];
  store.set('bookmarks', bookmarks);
  return true;
};

export const toggleBookmark = ({ postId, author, permlink }) => {
  const bookmarks = store.get('bookmarks') || {};
  if (bookmarks[postId]) {
    removeBookmark(postId);
  } else {
    addBookmark({ postId, author, permlink });
  }
  return getBookmarks();
};

export const getFavoriteUsers = () => {
  return store.get('users') || {};
};

export const toggleFavoriteUser = (username) => {
  const users = store.get('users') || {};
  return (_.has(users, username)) ?
    removeFavoriteUser(username) : addFavoriteUser(username);
};

export const addFavoriteUser = (username) => {
  const users = store.get('users') || {};
  users[username] = {};
  store.set('users', users);
  return true;
};

export const removeFavoriteUser = (username) => {
  const users = store.get('users') || {};
  delete users[username];
  store.set('users', users);
  return true;
};

export const getFavoriteCategories = () => {
  return store.get('categories') || {};
};

export const toggleFavoriteCategory = (category) => {
  const categories = store.get('categories') || {};
  return (_.has(categories, category)) ?
    removeFavoriteCategory(category) : addFavoriteCategory(category);
};

export const addFavoriteCategory = (category) => {
  const categories = store.get('categories') || {};
  categories[category] = {};
  store.set('categories', categories);
  return true;
};

export const removeFavoriteCategory = (category) => {
  const categories = store.get('categories') || {};
  delete categories[category];
  store.set('categories', categories);
  return true;
};

export const getDrafts = () => {
  return store.get('drafts') || {};
};

export const createDraft = () => {
  return true;
};

export const deleteDraft = (id) => {
  const drafts = store.get('drafts') || {};
  delete drafts[id];
  store.set('drafts', drafts);
  return true;
};
