import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationFollowing = ({ onClick, id, read, date, payload }) => (
  <div
    role="presentation"
    onClick={() => onClick(id)}
    className={classNames('Notification', {
      'Notification--unread': !read,
    })}
  >
    <Avatar username={payload.user} size={40} />
    <div className="Notification__text">
      <div className="Notification__text__message">
        <FormattedMessage
          id="notification_following_username"
          defaultMessage="{username} is now following you."
          values={{
            username: <Link to={`/${payload.user}`}>{payload.user}</Link>,
          }}
        />
      </div>
      <div className="Notification__text__date">
        <FormattedRelative value={date} />
      </div>
    </div>
  </div>
);

NotificationFollowing.propTypes = {
  onClick: PropTypes.func,
  id: PropTypes.number.isRequired,
  read: PropTypes.bool.isRequired,
  date: PropTypes.string.isRequired,
  payload: PropTypes.shape().isRequired,
};

NotificationFollowing.defaultProps = {
  onClick: () => {},
};

export default NotificationFollowing;
