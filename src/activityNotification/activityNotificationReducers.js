import * as notificationActions from './activityNotificationActions';

const initialState = {
  isFetching: false,
  list: [],
};

export const activityNotification = (state = initialState, action) => {
  switch (action.type) {
    case notificationActions.FETCH_ACTIVITY_NOTIFICATION_START:
      return {
        ...state,
        isFetching: true,
      }
    case notificationActions.FETCH_ACTIVITY_NOTIFICATION_SUCCESS:
      return {
        ...state,
        list: action.payload.notifications,
        isFetching: false,
      }
    case notificationActions.FETCH_ACTIVITY_NOTIFICATION_ERROR:
      return {
        ...state,
        isFetching: true,
      }
    default:
      return state;
  }
};
