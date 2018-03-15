import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import classNames from 'classnames';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../helpers/formatter';

const NotificationVote = ({ onClick, read, notification, currentAuthUsername }) => {
  const { voter, timestamp, permlink } = notification;
  const postURL = `/@${currentAuthUsername}/${permlink}`;
  let message = (
    <FormattedMessage
      id="notification_unvoted_username_post"
      defaultMessage="{username} unvoted your post"
      values={{ username: <span className="username">{voter}</span> }}
    />
  );

  if (notification.weight > 0) {
    message = (
      <FormattedMessage
        id="notification_upvoted_username_post"
        defaultMessage="{username} upvoted your post"
        values={{ username: <span className="username">{voter}</span> }}
      />
    );
  } else if (notification.weight < 0) {
    message = (
      <FormattedMessage
        id="notification_downvoted_username_post"
        defaultMessage="{username} downvoted your post"
        values={{ username: <span className="username">{voter}</span> }}
      />
    );
  }

  return (
    <Link
      role="presentation"
      onClick={onClick}
      className={classNames('Notification', {
        'Notification--unread': !read,
      })}
      to={postURL}
    >
      <Avatar username={voter} size={40} />
      <div className="Notification__text">
        <div className="Notification__text__message">{message}</div>
        <div className="Notification__text__date">
          <FormattedRelative value={epochToUTC(timestamp)} />
        </div>
      </div>
    </Link>
  );
};

NotificationVote.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape(),
  onClick: PropTypes.func,
  currentAuthUsername: PropTypes.string,
};

NotificationVote.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
  currentAuthUsername: '',
};

export default NotificationVote;
