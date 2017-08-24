import fetch from 'isomorphic-fetch';
import { uniqNotifications } from './activityNotificationHelpers';

export const FETCH_ACTIVITY_NOTIFICATION = '@activityNotifications/FETCH_ACTIVITY_NOTIFICATION';
export const FETCH_ACTIVITY_NOTIFICATION_START = '@activityNotifications/FETCH_ACTIVITY_NOTIFICATION_START';
export const FETCH_ACTIVITY_NOTIFICATION_SUCCESS = '@activityNotifications/FETCH_ACTIVITY_NOTIFICATION_SUCCESS';
export const FETCH_ACTIVITY_NOTIFICATION_ERROR = '@activityNotifications/FETCH_ACTIVITY_NOTIFICATION_ERROR';

export const MARK_AS_SEEN_NOTIFICATION = '@activityNotifications/MARK_AS_SEEN_NOTIFICATION';
export const MARK_AS_SEEN_NOTIFICATION_START = '@activityNotifications/MARK_AS_SEEN_NOTIFICATION_START';
export const MARK_AS_SEEN_NOTIFICATION_SUCCESS = '@activityNotifications/MARK_AS_SEEN_NOTIFICATION_SUCCESS';
export const MARK_AS_SEEN_NOTIFICATION_ERROR = '@activityNotifications/MARK_AS_SEEN_NOTIFICATION_ERROR';

const fetchNotifications = (username, token, limit) => {
  return fetch(`${process.env.BUSYPUSH_ENDPOINT}/api/getNotifications`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      token,
      limit,
    }),
  })
  .then(jsonRes => jsonRes.json())
}

const markAsSeenPromise = (notificationId) =>
  fetch(`${process.env.BUSYPUSH_ENDPOINT}/api/seenNotification?notificationId=${notificationId}`);

export const fetchActivityNotifications = (limit = 10) =>
  (dispatch, getState) => {
    const { auth } = getState();
    const username = auth.isAuthenticated && auth.user.name;
    const token = auth.isAuthenticated && auth.token;

    dispatch({
      type: FETCH_ACTIVITY_NOTIFICATION,
      payload: {
        promise: fetchNotifications(username, token, limit),
      }
    });
  }

export const markAsSeen = (notificationId) => (dispatch, getState) => {
  dispatch({
    type: MARK_AS_SEEN_NOTIFICATION,
    payload: {
      promise: markAsSeenPromise(notificationId),
    }
  });
};
