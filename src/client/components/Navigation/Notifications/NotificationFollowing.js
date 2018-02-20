import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../helpers/formatter';
import './Notification.less';

const NotificationFollowing = ({ notification, read }) => (
  <Link to={`/@${notification.follower}`}>
    <div
      className={classNames('Notification', {
        'Notification--unread': !read,
      })}
    >
      <Avatar username={notification.follower} size={40} />
      <div className="Notification__text">
        <div className="Notification__text__message">
          <FormattedMessage
            id="notification_following_username"
            defaultMessage="{username} started following you"
            values={{
              username: <span className="username">{notification.follower}</span>,
            }}
          />
        </div>
        <div className="Notification__text__date">
          <FormattedRelative value={epochToUTC(notification.timestamp)} />
        </div>
      </div>
    </div>
  </Link>
);

NotificationFollowing.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    follower: PropTypes.string,
    timestamp: PropTypes.number,
  }),
};

NotificationFollowing.defaultProps = {
  read: false,
  notification: {},
};

export default NotificationFollowing;
