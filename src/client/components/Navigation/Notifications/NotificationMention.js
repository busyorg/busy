import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationMention = ({ onClick, notification }) => (
  <div
    role="presentation"
    onClick={() => onClick(notification.id)}
    className={classNames('Notification', {
      'Notification--unread': !notification.read,
    })}
  >
    <Avatar username={notification.author} size={40} />
    <div className="Notification__text">
      <div className="Notification__text__message">
        <FormattedMessage
          id="notification_mention_username_post"
          defaultMessage="{username} mentioned you on this post {post}."
          values={{
            username: <Link to={`/${notification.author}`}>{notification.author}</Link>,
            post: <Link to={notification.permlink}>{notification.permlink}</Link>,
          }}
        />
      </div>
      <div className="Notification__text__date">
        <FormattedRelative value={notification.timestamp} />
      </div>
    </div>
  </div>
);

NotificationMention.propTypes = {
  onClick: PropTypes.func,
  notification: PropTypes.shape({
    is_root_post: PropTypes.bool,
    author: PropTypes.string,
    permlink: PropTypes.string,
    timestamp: PropTypes.number,
  }),
};

NotificationMention.defaultProps = {
  onClick: () => {},
  notification: {},
};

export default NotificationMention;
