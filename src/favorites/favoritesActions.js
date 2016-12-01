import { createAction } from 'redux-actions';

export const ADD_USER_FAVORITE = '@favorites/ADD_USER_FAVORITE';
export const REMOVE_USER_FAVORITE = '@favorites/REMOVE_USER_FAVORITE';

export const ADD_CATEGORY_FAVORITE = '@favorites/ADD_CATEGORY_FAVORITE';
export const REMOVE_CATEGORY_FAVORITE = '@favorites/REMOVE_CATEGORY_FAVORITE';

export const addUserFavorite = createAction(ADD_USER_FAVORITE);
export const removeUserFavorite = createAction(REMOVE_USER_FAVORITE);

export const addCategoryFavorite = createAction(ADD_CATEGORY_FAVORITE);
export const removeCategoryFavorite = createAction(REMOVE_CATEGORY_FAVORITE);
