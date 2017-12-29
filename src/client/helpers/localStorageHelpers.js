import store from 'store';
import _ from 'lodash';

export const getFavoriteUsers = () => store.get('users') || {};

export const addFavoriteUser = username => {
  const users = store.get('users') || {};
  users[username] = {};
  store.set('users', users);
  return true;
};

export const removeFavoriteUser = username => {
  const users = store.get('users') || {};
  delete users[username];
  store.set('users', users);
  return true;
};

export const toggleFavoriteUser = username => {
  const users = store.get('users') || {};
  return _.has(users, username) ? removeFavoriteUser(username) : addFavoriteUser(username);
};

export const getFavoriteCategories = () => store.get('categories') || {};

export const addFavoriteCategory = category => {
  const categories = store.get('categories') || {};
  categories[category] = {};
  store.set('categories', categories);
  return true;
};

export const removeFavoriteCategory = category => {
  const categories = store.get('categories') || {};
  delete categories[category];
  store.set('categories', categories);
  return true;
};

export const toggleFavoriteCategory = category => {
  const categories = store.get('categories') || {};
  return _.has(categories, category)
    ? removeFavoriteCategory(category)
    : addFavoriteCategory(category);
};

export const getLocale = () => store.get('locale') || 'en';

export const setLocale = locale => {
  store.set('locale', locale);
};
