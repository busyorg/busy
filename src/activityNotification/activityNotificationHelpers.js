import _ from 'lodash';

export const uniqNotifications = list => _.uniqBy(list, 'notification_id') || [];

export const makeNotificationTitle = (notification, listByNotificationId) => {
  let title = '';
  let numberOfSimilarNotifications = 0;

  // similar notification in terms of the id of the post that notification is related to
  // for example all comments sent on a post has the same notificationId
  if (listByNotificationId[notification.notification_id] &&
    listByNotificationId[notification.notification_id].length > 1) {
      numberOfSimilarNotifications = listByNotificationId[notification.notification_id].length - 1;
  }

  switch(notification.action_type) {
  case 'comment':
    if (numberOfSimilarNotifications > 0) {
      title = `New comment by ${notification.from_username} and ${numberOfSimilarNotifications} others on your post`;
    } else {
      title = `New comment by ${notification.from_username} on your post`;
    }
    break;
  case 'transfer':
    title = 'New transfer';
  }

  return title;
};