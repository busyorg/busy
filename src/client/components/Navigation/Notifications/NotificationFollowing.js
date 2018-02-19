import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationFollowing = ({ onClick, notification }) => (
  <div
    role="presentation"
    onClick={() => onClick(notification.id)}
    className={classNames('Notification', {
      'Notification--unread': !notification.read,
    })}
  >
    <Avatar username={notification.follower} size={40} />
    <div className="Notification__text">
      <div className="Notification__text__message">
        <FormattedMessage
          id="notification_following_username"
          defaultMessage="{username} is now following you."
          values={{
            username: <Link to={`/@${notification.follower}`}>{notification.follower}</Link>,
          }}
        />
      </div>
      <div className="Notification__text__date">
        <FormattedRelative value={notification.timestamp} />
      </div>
    </div>
  </div>
);

NotificationFollowing.propTypes = {
  onClick: PropTypes.func,
  notification: PropTypes.shape({
    follower: PropTypes.string,
    timestamp: PropTypes.number,
  }),
};

NotificationFollowing.defaultProps = {
  onClick: () => {},
  notification: {},
};

export default NotificationFollowing;
