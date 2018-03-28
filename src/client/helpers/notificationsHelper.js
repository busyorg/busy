import * as notificationConstants from '../../common/constants/notifications';

export const getNotificationsMessage = (notification, intl, displayUsername) => {
  switch (notification.type) {
    case notificationConstants.REPLY:
      return intl.formatMessage(
        {
          id: 'notification_reply_username_post',
          defaultMessage: '{username} commented on your post',
        },
        { username: displayUsername ? notification.author : '' },
      );
    case notificationConstants.FOLLOW:
      return intl.formatMessage(
        {
          id: 'notification_following_username',
          defaultMessage: '{username} started following you',
        },
        { username: displayUsername ? notification.follower : '' },
      );
    case notificationConstants.MENTION:
      return notification.is_root_post
        ? intl.formatMessage(
            {
              id: 'notification_mention_username_post',
              defaultMessage: '{username} mentioned you in a post',
            },
            { username: displayUsername ? notification.author : '' },
          )
        : intl.formatMessage(
            {
              id: 'notification_mention_username_post',
              defaultMessage: '{username} mentioned you in a comment',
            },
            { username: displayUsername ? notification.author : '' },
          );
    case notificationConstants.VOTE: {
      let message = intl.formatMessage(
        {
          id: 'notification_unvoted_username_post',
          defaultMessage: '{username} unvoted your post',
        },
        {
          username: displayUsername ? notification.voter : '',
        },
      );

      if (notification.weight > 0) {
        message = intl.formatMessage(
          {
            id: 'notification_upvoted_username_post',
            defaultMessage: '{username} upvoted your post',
          },
          { username: displayUsername ? notification.voter : '' },
        );
      } else if (notification.weight < 0) {
        message = intl.formatMessage(
          {
            id: 'notification_downvoted_username_post',
            defaultMessage: '{username} downvoted your post',
          },
          { username: displayUsername ? notification.voter : '' },
        );
      }

      return message;
    }
    case notificationConstants.REBLOG:
      return intl.formatMessage(
        {
          id: 'notification_reblogged_username_post',
          defaultMessage: '{username} reblogged your post',
        },
        { username: displayUsername ? notification.account : '' },
      );
    case notificationConstants.TRANSFER:
      return intl.formatMessage(
        {
          id: 'notification_transfer_username_amount',
          defaultMessage: '{username} transfered {amount} to you',
        },
        {
          username: displayUsername ? notification.from : '',
          amount: notification.amount,
        },
      );
    case notificationConstants.WITNESS_VOTE:
      return notification.approve
        ? intl.formatMessage(
            {
              id: 'notification_approved_witness',
              defaultMessage: '{username} approved your witness',
            },
            { username: displayUsername ? notification.account : '' },
          )
        : intl.formatMessage(
            {
              id: 'notification_unapproved_witness',
              defaultMessage: '{username} unapproved your witness',
            },
            { username: displayUsername ? notification.account : '' },
          );
    default:
      return intl.formatMessage({
        id: 'notification_generic_default_message',
        defaultMessage: 'You have a new notification',
      });
  }
};

export const getNotificationsLink = (notification, currentAuthUsername) => {
  switch (notification.type) {
    case notificationConstants.REPLY:
      return `/@${currentAuthUsername}/${notification.parent_permlink}/#@${notification.author}/${
        notification.permlink
      }`;
    case notificationConstants.FOLLOW:
      return `/@${notification.follower}`;
    case notificationConstants.MENTION:
      return `/@${notification.author}/${notification.permlink}`;
    case notificationConstants.VOTE:
    case notificationConstants.REBLOG:
      return `/@${currentAuthUsername}/${notification.permlink}`;
    case notificationConstants.TRANSFER:
      return `/@${notification.from}`;
    case notificationConstants.WITNESS_VOTE:
      return `/@${notification.account}`;
    default:
      return '/notifications';
  }
};

export const getNotificationsAvatar = (notification, currentAuthUsername) => {
  switch (notification.type) {
    case notificationConstants.REPLY:
      return notification.author;
    case notificationConstants.FOLLOW:
      return notification.follower;
    case notificationConstants.MENTION:
      return notification.author;
    case notificationConstants.VOTE:
      return notification.voter;
    case notificationConstants.TRANSFER:
      return notification.from;
    case notificationConstants.REBLOG:
    case notificationConstants.WITNESS_VOTE:
      return notification.account;
    default:
      return currentAuthUsername;
  }
};
