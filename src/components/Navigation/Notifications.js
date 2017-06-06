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
  read: false,
  date: '2017-06-06T13:46:37Z',
  payload: {
    user: 'metrox',
  },
};


const notificationReply = {
  type: NOTIFICATION_REPLY,
  read: false,
  date: '2017-06-06T13:46:37Z',
  payload: {
    user: 'good-karma',
    post_url: 'https://google.com',
  },
};

const notificationTransfer = {
  type: NOTIFICATION_TRANSFER,
  read: false,
  date: '2017-06-06T13:46:37Z',
  payload: {
    user: 'stabe',
    amount: 60.00,
  },
};


const notificationMention = {
  type: NOTIFICATION_MENTION,
  read: true,
  date: '2017-06-06T13:46:37Z',
  payload: {
    user: 'furion',
    post_url: 'https://google.com',
  },
};

const NotificationFollowing = ({ read, date, user }) =>
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
        <Link to={`/${user}`}>{user}</Link> is now following you.
      </div>
      <div className="Notifications__notification__text__date">
        <FormattedRelative value={date} />
      </div>
    </div>
  </div>;

const NotificationReply = ({ read, date, user, post_url }) =>
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
        <Link to={`/${user}`}>{user}</Link> replied on your <Link to={post_url}>post</Link>.
      </div>
      <div className="Notifications__notification__text__date">
        <FormattedRelative value={date} />
      </div>
    </div>
  </div>;

const NotificationTransfer = ({ read, date, user, amount }) =>
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
        <Link to={`/${user}`}>{user}</Link> sent you {numeral(amount).format('0,0.000')} STEEM.
      </div>
      <div className="Notifications__notification__text__date">
        <FormattedRelative value={date} />
      </div>
    </div>
  </div>;

const NotificationMention = ({ read, date, user, post_url }) =>
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
        <Link to={`/${user}`}>{user}</Link> mentioned you on his <Link to={post_url}>post</Link>.
      </div>
      <div className="Notifications__notification__text__date">
        <FormattedRelative value={date} />
      </div>
    </div>
  </div>;

const Notifications = () =>
  <div className="Notifications">
    <NotificationFollowing
      read={notificationFollowing.read}
      date={notificationFollowing.date}
      {...notificationFollowing.payload}
    />
    <NotificationReply
      read={notificationReply.read}
      date={notificationReply.date}
      {...notificationReply.payload}
    />
    <NotificationTransfer
      read={notificationTransfer.read}
      date={notificationTransfer.date}
      {...notificationTransfer.payload}
    />
    <NotificationMention
      read={notificationMention.read}
      date={notificationMention.date}
      {...notificationMention.payload}
    />
    <div className="Notifications__footer">
      <a>See All</a>
    </div>
  </div>;

export default Notifications;
