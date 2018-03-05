import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../helpers/formatter';
import './Notification.less';

const NotificationReblog = ({ notification, read, onClick, currentAuthUsername }) => (
  <Link
    to={`/@${currentAuthUsername}/${notification.permlink}`}
    className={classNames('Notification', {
      'Notification--unread': !read,
    })}
    onClick={onClick}
  >
    <Avatar username={notification.account} size={40} />
    <div className="Notification__text">
      <div className="Notification__text__message">
        <FormattedMessage
          id="notification_reblogged_username_post"
          defaultMessage="{username} reblogged your post"
          values={{
            username: <span className="username">{notification.account}</span>,
          }}
        />
      </div>
      <div className="Notification__text__date">
        <FormattedRelative value={epochToUTC(notification.timestamp)} />
      </div>
    </div>
  </Link>
);

NotificationReblog.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    account: PropTypes.string,
    permlink: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  onClick: PropTypes.func,
  currentAuthUsername: PropTypes.string,
};

NotificationReblog.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
  currentAuthUsername: '',
};

export default NotificationReblog;
