import { createAction } from 'redux-actions';
import {
  getFavoriteUsers as getFavoriteUsersHelper,
  toggleFavoriteUser as toggleFavoriteUserkHelper,
  getFavoriteCategories as getFavoriteCategoriesHelper,
  toggleFavoriteCategory as toggleFavoriteCategoryHelper,
} from '../helpers/localStorageHelpers';

export const GET_FAVORITE_USERS = '@favorites/GET_FAVORITE_USERS';
export const GET_FAVORITE_USERS_SUCCESS = '@favorites/GET_FAVORITE_USERS_SUCCESS';
export const GET_FAVORITE_USERS_FAIL = '@favorites/GET_FAVORITE_USERS_FAIL';

export const getFavoriteUsersRequest = createAction(GET_FAVORITE_USERS);
export const getFavoriteUsersSuccess = createAction(GET_FAVORITE_USERS_SUCCESS);

export const getFavoriteUsers = () => {
  return (dispatch) => {
    dispatch(getFavoriteUsersRequest());
    const users = getFavoriteUsersHelper();
    dispatch(
      getFavoriteUsersSuccess({ users })
    );
  };
};

export const TOGGLE_FAVORITE_USER = '@favorites/TOGGLE_FAVORITE_USER';
export const TOGGLE_FAVORITE_USER_SUCCESS = '@favorites/TOGGLE_FAVORITE_USER_SUCCESS';
export const TOGGLE_FAVORITE_USER_FAIL = '@favorites/TOGGLE_FAVORITE_USER_FAIL';

export const toggleFavoriteUserRequest = createAction(TOGGLE_FAVORITE_USER);
export const toggleFavoriteUserSuccess = createAction(TOGGLE_FAVORITE_USER_SUCCESS);

export const toggleFavoriteUser = ({ username }) => {
  return (dispatch) => {
    dispatch(toggleFavoriteUserRequest({ username }));
    toggleFavoriteUserkHelper(username);
    dispatch(
      toggleFavoriteUserSuccess({ username })
    );
  };
};

export const GET_FAVORITE_CATEGORIES = '@favorites/GET_FAVORITE_CATEGORIES';
export const GET_FAVORITE_CATEGORIES_SUCCESS = '@favorites/GET_FAVORITE_CATEGORIES_SUCCESS';
export const GET_FAVORITE_CATEGORIES_FAIL = '@favorites/GET_FAVORITE_CATEGORIES_FAIL';

export const getFavoriteCategoriesRequest = createAction(GET_FAVORITE_CATEGORIES);
export const getFavoriteCategoriesSuccess = createAction(GET_FAVORITE_CATEGORIES_SUCCESS);

export const getFavoriteCategories = () => {
  return (dispatch) => {
    dispatch(getFavoriteCategoriesRequest());
    const categories = getFavoriteCategoriesHelper();
    dispatch(
      getFavoriteCategoriesSuccess({ categories })
    );
  };
};

export const TOGGLE_FAVORITE_CATEGORY = '@favorites/TOGGLE_FAVORITE_CATEGORY';
export const TOGGLE_FAVORITE_CATEGORY_SUCCESS = '@favorites/TOGGLE_FAVORITE_CATEGORY_SUCCESS';
export const TOGGLE_FAVORITE_CATEGORY_FAIL = '@favorites/TOGGLE_FAVORITE_CATEGORY_FAIL';

export const toggleFavoriteCategoryRequest = createAction(TOGGLE_FAVORITE_CATEGORY);
export const toggleFavoriteCategorySuccess = createAction(TOGGLE_FAVORITE_CATEGORY_SUCCESS);

export const toggleFavoriteCategory = ({ category }) => {
  return (dispatch) => {
    dispatch(toggleFavoriteCategoryRequest({ category }));
    toggleFavoriteCategoryHelper(category);
    dispatch(
      toggleFavoriteCategorySuccess({ category })
    );
  };
};
