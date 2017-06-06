import React from 'react';
import classNames from 'classnames';
import numeral from 'numeral';
import { Link } from 'react-router';
import { FormattedRelative } from 'react-intl';
import Avatar from '../Avatar';
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

const NotificationFollowing = ({ read, date, payload }) =>
  <div
    className={
      classNames('Notifications__notification', {
        'Notifications__notification--unread': !read,
      })
    }
  >
    <Avatar username="guest123" size={40} />
    <div className="Notifications__notification__text">
      <div className="Notifications__notification__text__message">
        <Link to={`/${payload.user}`}>{payload.user}</Link> is now following you.
      </div>
      <div className="Notifications__notification__text__date">
        <FormattedRelative value={date} />
      </div>
    </div>
  </div>;

const NotificationReply = ({ read, date, payload }) =>
  <div
    className={
      classNames('Notifications__notification', {
        'Notifications__notification--unread': !read,
      })
    }
  >
    <Avatar username="guest123" size={40} />
    <div className="Notifications__notification__text">
      <div className="Notifications__notification__text__message">
        <Link to={`/${payload.user}`}>{payload.user}</Link> replied on your <Link to={payload.post_url}>post</Link>.
      </div>
      <div className="Notifications__notification__text__date">
        <FormattedRelative value={date} />
      </div>
    </div>
  </div>;

const NotificationTransfer = ({ read, date, payload }) =>
  <div
    className={
      classNames('Notifications__notification', {
        'Notifications__notification--unread': !read,
      })
    }
  >
    <Avatar username="guest123" size={40} />
    <div className="Notifications__notification__text">
      <div className="Notifications__notification__text__message">
        <Link to={`/${payload.user}`}>{payload.user}</Link> sent you {numeral(payload.amount).format('0,0.000')} STEEM.
      </div>
      <div className="Notifications__notification__text__date">
        <FormattedRelative value={date} />
      </div>
    </div>
  </div>;

const NotificationMention = ({ read, date, payload }) =>
  <div
    className={
      classNames('Notifications__notification', {
        'Notifications__notification--unread': !read,
      })
    }
  >
    <Avatar username="guest123" size={40} />
    <div className="Notifications__notification__text">
      <div className="Notifications__notification__text__message">
        <Link to={`/${payload.user}`}>{payload.user}</Link> mentioned you on his <Link to={payload.post_url}>post</Link>.
      </div>
      <div className="Notifications__notification__text__date">
        <FormattedRelative value={date} />
      </div>
    </div>
  </div>;

const Notifications = () =>
  <div className="Notifications">
    {
      notifications && notifications.map((notification) => {
        if (notification.type === NOTIFICATION_FOLLOWING) {
          return <NotificationFollowing key={notification.id} {...notification} />;
        } else if (notification.type === NOTIFICATION_REPLY) {
          return <NotificationReply key={notification.id} {...notification} />;
        } else if (notification.type === NOTIFICATION_TRANSFER) {
          return <NotificationTransfer key={notification.id} {...notification} />;
        } else if (notification.type === NOTIFICATION_MENTION) {
          return <NotificationMention key={notification.id} {...notification} />;
        }

        return null;
      })
    }
    <div className="Notifications__footer">
      <a>See All</a>
    </div>
  </div>;

export default Notifications;
