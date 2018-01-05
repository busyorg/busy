import { createAction } from 'redux-actions';

export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';

export const showNotification = createAction(SHOW_NOTIFICATION);

export const notify = (text, context) => dispatch => {
  dispatch(
    showNotification({
      text,
      context,
    }),
  );
};
