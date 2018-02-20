import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { epochToUTC } from '../../../helpers/formatter';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationReply = ({ notification, currentAuthUsername, read }) => {
  const { permlink, parent_permlink: parentPermlink, author, timestamp } = notification;
  const userRepliedToPost = parentPermlink === permlink;
  const commentURL = `/@${currentAuthUsername}/${parentPermlink}/#@${author}/${permlink}`;

  return (
    <Link to={commentURL}>
      <div
        className={classNames('Notification', {
          'Notification--unread': !read,
        })}
      >
        <Avatar username={author} size={40} />
        <div className="Notification__text">
          <div className="Notification__text__message">
            {userRepliedToPost ? (
              <FormattedMessage
                id="notification_reply_username_post"
                defaultMessage="{username} commented your post."
                values={{
                  username: author,
                }}
              />
            ) : (
              <FormattedMessage
                id="notification_reply_username_comment"
                defaultMessage="{username} replied on your comment."
                values={{
                  username: author,
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

NotificationReply.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    author: PropTypes.string,
    permlink: PropTypes.string,
    parent_permlink: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  currentAuthUsername: PropTypes.string,
};

NotificationReply.defaultProps = {
  read: false,
  notification: {},
  currentAuthUsername: '',
};

export default NotificationReply;
