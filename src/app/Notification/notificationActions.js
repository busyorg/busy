import { createAction } from 'redux-actions';

export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';

export const showNotification = createAction(SHOW_NOTIFICATION);
export const closeNotification = createAction(CLOSE_NOTIFICATION);

export const notify = text => {
  return (dispatch) => {
    const notifId = `busy-notif${Date.now()}`;

    dispatch(
      showNotification({
        notifId,
        text,
      })
    );

    setTimeout(
      () => {
        dispatch(
          closeNotification({ notifId })
        );
      }
    , 4000);
  };
};
