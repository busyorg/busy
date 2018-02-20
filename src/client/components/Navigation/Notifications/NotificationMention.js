import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationMention = ({ onClick, notification }) => {
  const { author, permlink, timestamp } = notification;

  return (
    <Link to={`/@${author}/${permlink}`}>
      <div
        role="presentation"
        onClick={() => onClick(notification.id)}
        className={classNames('Notification', {
          'Notification--unread': !notification.read,
        })}
      >
        <Avatar username={author} size={40} />
        <div className="Notification__text">
          <div className="Notification__text__message">
            {notification.is_root_post ? (
              <FormattedMessage
                id="notification_mention_username_post"
                defaultMessage="{username} mentioned you in a post."
                values={{
                  username: author,
                }}
              />
            ) : (
              <FormattedMessage
                id="notification_mention_username_post"
                defaultMessage="{username} mentioned you in a comment."
                values={{
                  username: author,
                }}
              />
            )}
          </div>
          <div className="Notification__text__date">
            <FormattedRelative value={timestamp} />
          </div>
        </div>
      </div>
    </Link>
  );
};

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
