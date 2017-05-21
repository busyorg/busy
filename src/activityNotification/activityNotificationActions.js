export const FETCH_ACTIVITY_NOTIFICATION = '@activityNotifications/FETCH_ACTIVITY_NOTIFICATION';
export const FETCH_ACTIVITY_NOTIFICATION_START = '@activityNotifications/FETCH_ACTIVITY_NOTIFICATION_START';
export const FETCH_ACTIVITY_NOTIFICATION_SUCCESS = '@activityNotifications/FETCH_ACTIVITY_NOTIFICATION_SUCCESS';
export const FETCH_ACTIVITY_NOTIFICATION_ERROR = '@activityNotifications/FETCH_ACTIVITY_NOTIFICATION_ERROR';

const fetchNotifications = (username, token) => {
  console.log(process.env.BUSYPUSH_ENDPOINT);
  return fetch(`${process.env.BUSYPUSH_ENDPOINT}/api/getNotifications`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      token,
    }),
  })
  .then(jsonRes => jsonRes.json())
}

export const fetchActivityNotifications = () =>
  (dispatch, getState) => {
    const { auth } = getState();
    const username = auth.isAuthenticated && auth.user.name;
    const token = auth.isAuthenticated && auth.token;

    dispatch({
      type: FETCH_ACTIVITY_NOTIFICATION,
      payload: {
        promise: fetchNotifications(username, token),
      }
    });
  }
