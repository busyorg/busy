import object from 'lodash/object';
import * as favoritesActions from './favoritesActions';

const bookmarks = (state = {}, action) => {
  switch (action.type) {
    case favoritesActions.GET_FAVORITE_USERS_SUCCESS:
      return action.payload.favorites;
    case favoritesActions.TOGGLE_FAVORITE_USER_SUCCESS:
      if (object.has(state, action.payload.username)) {
        return object.omit(state, action.payload.username);
      } else {
        return {
          ...state,
          [action.payload.username]: {},
        };
      }
    case favoritesActions.GET_FAVORITE_CATEGORIES_SUCCESS:
      return action.payload.favorites;
    case favoritesActions.TOGGLE_FAVORITE_CATEGORY_SUCCESS:
      if (object.has(state, action.payload.category)) {
        return object.omit(state, action.payload.category);
      } else {
        return {
          ...state,
          [action.payload.category]: {},
        };
      }
    default:
      return state;
  }
};

export default bookmarks;
