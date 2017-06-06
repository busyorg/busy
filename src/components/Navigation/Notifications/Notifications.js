import React, { PropTypes } from 'react';
import NotificationFollowing from './NotificationFollowing';
import NotificationReply from './NotificationReply';
import NotificationTransfer from './NotificationTransfer';
import NotificationMention from './NotificationMention';
import './Notifications.less';

export const NOTIFICATION_FOLLOWING = 'NOTIFICATION_FOLLOWING';
export const NOTIFICATION_REPLY = 'NOTIFICATION_REPLY';
export const NOTIFICATION_TRANSFER = 'NOTIFICATION_TRANSFER';
export const NOTIFICATION_MENTION = 'NOTIFICATION_MENTION';

const notificationFollowing = {
  type: NOTIFICATION_FOLLOWING,
  id: 0,
  read: false,
  date: '2017-06-06T13:46:37Z',
  payload: {
    user: 'metrox',
  },
};


const notificationReply = {
  type: NOTIFICATION_REPLY,
  id: 1,
  read: false,
  date: '2017-06-06T13:46:37Z',
  payload: {
    user: 'good-karma',
    post_url: 'https://google.com',
  },
};

const notificationTransfer = {
  type: NOTIFICATION_TRANSFER,
  id: 2,
  read: false,
  date: '2017-06-06T13:46:37Z',
  payload: {
    user: 'stabe',
    amount: 60.00,
  },
};


const notificationMention = {
  type: NOTIFICATION_MENTION,
  id: 3,
  read: true,
  date: '2017-06-06T13:46:37Z',
  payload: {
    user: 'furion',
    post_url: 'https://google.com',
  },
};

const notifications = [
  notificationFollowing,
  notificationReply,
  notificationTransfer,
  notificationMention,
];

const Notifications = ({ onClick, onSeeAllClick }) =>
  <div className="Notifications">
    {
      notifications && notifications.map((notification) => {
        if (notification.type === NOTIFICATION_FOLLOWING) {
          return (<NotificationFollowing
            onClick={id => onClick(id)} key={notification.id} {...notification}
          />);
        } else if (notification.type === NOTIFICATION_REPLY) {
          return (<NotificationReply
            onClick={id => onClick(id)} key={notification.id} {...notification}
          />);
        } else if (notification.type === NOTIFICATION_TRANSFER) {
          return (<NotificationTransfer
            onClick={id => onClick(id)} key={notification.id} {...notification}
          />);
        } else if (notification.type === NOTIFICATION_MENTION) {
          return (<NotificationMention
            onClick={id => onClick(id)} key={notification.id} {...notification}
          />);
        }

        return null;
      })
    }
    <div className="Notifications__footer">
      <a onClick={onSeeAllClick}>See All</a>
    </div>
  </div>;

Notifications.propTypes = {
  onClick: PropTypes.func,
  onSeeAllClick: () => {},
};

Notification.defaultProps = {
  onClick: () => {},
  onSeeAllClick: () => {},
};

export default Notifications;
