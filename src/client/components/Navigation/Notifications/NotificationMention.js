import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../helpers/formatter';
import './Notification.less';

const NotificationMention = ({ notification, read }) => {
  const { author, permlink, timestamp } = notification;

  return (
    <Link to={`/@${author}/${permlink}`}>
      <div
        className={classNames('Notification', {
          'Notification--unread': !read,
        })}
      >
        <Avatar username={author} size={40} />
        <div className="Notification__text">
          <div className="Notification__text__message">
            {notification.is_root_post ? (
              <FormattedMessage
                id="notification_mention_username_post"
                defaultMessage="{username} mentioned you in a post"
                values={{
                  username: <span className="username">{author}</span>,
                }}
              />
            ) : (
              <FormattedMessage
                id="notification_mention_username_post"
                defaultMessage="{username} mentioned you in a comment"
                values={{
                  username: <span className="username">{author}</span>,
                }}
              />
            )}
          </div>
          <div className="Notification__text__date">
            <FormattedRelative value={epochToUTC(timestamp)} />
          </div>
        </div>
      </div>
    </Link>
  );
};

NotificationMention.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    is_root_post: PropTypes.bool,
    author: PropTypes.string,
    permlink: PropTypes.string,
    timestamp: PropTypes.number,
  }),
};

NotificationMention.defaultProps = {
  read: false,
  notification: {},
};

export default NotificationMention;
