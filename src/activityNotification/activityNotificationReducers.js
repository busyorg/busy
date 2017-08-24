import * as notificationActions from './activityNotificationActions';
import { uniqNotifications } from './activityNotificationHelpers';

const initialState = {
  isFetching: false,
  list: [],
};

const getUnseenNotifsCounter = (list) =>
  uniqNotifications(list).reduce((prevItem, current) => {
    if (current.seen == 0) {
      return prevItem + 1;
    } else {
      return prevItem;
    }
  }, 0);

export const activityNotification = (state = initialState, action) => {
  switch (action.type) {
    case notificationActions.FETCH_ACTIVITY_NOTIFICATION_START:
      return {
        ...state,
        isFetching: true,
      }
    case notificationActions.FETCH_ACTIVITY_NOTIFICATION_SUCCESS:
      // early exit in case of no new data
      const isDataNew = state.list[0]
        && state.list[0].id === action.payload.notifications[0].id
        && state.list.length >= action.payload.notifications.length;

      if (isDataNew) {
        return {
          ...state,
          isFetching: false,
        };
      }

      return {
        ...state,
        list: action.payload.notifications,
        unseenCounter: getUnseenNotifsCounter(action.payload.notifications),
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
