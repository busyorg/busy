import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../helpers/formatter';
import './Notification.less';

const NotificationTransfer = ({ notification, read, onClick }) => (
  <Link
    to={`/@${notification.from}`}
    className={classNames('Notification', {
      'Notification--unread': !read,
    })}
    onClick={onClick}
  >
    <Avatar username={notification.from} size={40} />
    <div className="Notification__text">
      <div className="Notification__text__message">
        <FormattedMessage
          id="notification_transfer_username_amount"
          defaultMessage="{username} transfered {amount} to you"
          values={{
            username: <span className="username">{notification.from}</span>,
            amount: notification.amount,
          }}
        />
      </div>
      <div className="Notification__text__date">
        <FormattedRelative value={epochToUTC(notification.timestamp)} />
      </div>
    </div>
  </Link>
);

NotificationTransfer.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    follower: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  onClick: PropTypes.func,
};

NotificationTransfer.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationTransfer;
