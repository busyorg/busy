import * as favoriteActions from './favoritesActions';

const initialState = {
  categories: [],
  users: [],
};

const favoriteItem = (state = [], action) => {
  switch (action.type) {
    case favoriteActions.ADD_CATEGORY_FAVORITE:
    case favoriteActions.ADD_USER_FAVORITE:
      return [...state, action.payload];
    case favoriteActions.REMOVE_CATEGORY_FAVORITE:
    case favoriteActions.REMOVE_USER_FAVORITE:
      return state.filter(item => item !== action.payload);
    default:
      return state;
  }
};

const favorites = (state = initialState, action) => {
  switch (action.type) {
    case favoriteActions.ADD_CATEGORY_FAVORITE:
    case favoriteActions.REMOVE_CATEGORY_FAVORITE:
      return {
        ...state,
        categories: favoriteItem(state.categories, action),
      };
    case favoriteActions.ADD_USER_FAVORITE:
    case favoriteActions.REMOVE_USER_FAVORITE:
      return {
        ...state,
        users: favoriteItem(state.users, action),
      };
    default:
      return state;
  }
};

export default favorites;

export const getFavoriteCategories = state => state.categories;
